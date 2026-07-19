import "server-only";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { isMockMode } from "@/lib/mock-mode";
import { mockTrainingStore } from "./mock-store";
import { updateCurrentUserSchema, type submitAttemptSchema } from "./schemas";
import type { z } from "zod";

export type FeedbackPayload = {
  score: number;
  summary: string;
  strengths: string[];
  blindspots: string[];
  seniorSolution: string;
};

type ChallengeRecord = {
  id: string;
  solution: string;
  title: string;
  code: string;
  question: string;
};

type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;

async function getOptionalAuthenticatedUser() {
  if (isMockMode()) {
    return mockTrainingStore.getCurrentUser();
  }

  const [{ auth }, prisma] = await Promise.all([
    import("@kodan/auth"),
    getPrisma(),
  ]);
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
}

async function requireAuthenticatedUser() {
  const user = await getOptionalAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

async function getPrisma() {
  const { default: prisma } = await import("@kodan/db");
  return prisma;
}

function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "");
  cleaned = cleaned.replace(/\s*```$/, "");
  return cleaned.trim();
}

function calculateEloDelta(score: number): number {
  if (score >= 8) {
    return 10 + (score - 8) * 5;
  }
  if (score >= 5) {
    return 2 + (score - 5) * 1.5;
  }
  return -15 + score * 2.5;
}

function normalizeFeedback(payload: unknown, solution: string): FeedbackPayload {
  const fallback = getMockFeedback(solution);

  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const obj = payload as Record<string, unknown>;
  const score =
    typeof obj.score === "number" && Number.isFinite(obj.score)
      ? Math.max(0, Math.min(10, obj.score))
      : fallback.score;

  const summary = typeof obj.summary === "string" && obj.summary.trim()
    ? obj.summary.trim()
    : fallback.summary;

  const strengths = Array.isArray(obj.strengths)
    ? obj.strengths.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : fallback.strengths;

  const blindspots = Array.isArray(obj.blindspots)
    ? obj.blindspots.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : fallback.blindspots;

  return {
    score,
    summary,
    strengths: strengths.length > 0 ? strengths : fallback.strengths,
    blindspots: blindspots.length > 0 ? blindspots : fallback.blindspots,
    seniorSolution: solution,
  };
}

async function getFeedbackFromOpenRouter(
  challenge: ChallengeRecord,
  userAnswer: string,
): Promise<FeedbackPayload> {
  const fallback = getMockFeedback(challenge.solution);
  if (isMockMode()) {
    return fallback;
  }

  const { env } = await import("@kodan/env/server");

  if (!env.OPENROUTER_API_KEY) {
    return fallback;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Você é um tech lead de React. Responda somente JSON com os campos: score (0-10), summary, strengths (string[]), blindspots (string[]).",
          },
          {
            role: "user",
            content: `Desafio: ${challenge.title}

Pergunta: ${challenge.question}

Código:
${challenge.code}

Solução de referência:
${challenge.solution}

Resposta do aluno:
${userAnswer}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return fallback;
    }

    const parsed = JSON.parse(cleanJsonResponse(content)) as unknown;
    return normalizeFeedback(parsed, challenge.solution);
  } catch {
    return fallback;
  }
}

export async function getCurrentUser() {
  try {
    const user = await requireAuthenticatedUser();
    return { success: true, data: user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao obter usuário local";
    return { success: false, error: message };
  }
}

function isValidProfileImage(input: string) {
  return /^data:image\/(png|jpe?g|webp|gif);base64,[a-zA-Z0-9+/=]+$/.test(input);
}

export async function updateCurrentUserProfile(
  params: z.infer<typeof updateCurrentUserSchema>,
) {
  try {
    const parsedParams = updateCurrentUserSchema.parse(params);
    const name = parsedParams.name.trim().slice(0, 60);
    const bio =
      typeof parsedParams.bio === "string" ? parsedParams.bio.trim().slice(0, 180) : undefined;

    let image: string | null | undefined = undefined;
    if (parsedParams.image === null) {
      image = null;
    } else if (typeof parsedParams.image === "string") {
      if (!isValidProfileImage(parsedParams.image)) {
        return { success: false, error: "Formato de imagem inválido" };
      }
      if (parsedParams.image.length > 2_000_000) {
        return { success: false, error: "Imagem muito grande (máx. 2MB em base64)" };
      }
      image = parsedParams.image;
    }

    if (isMockMode()) {
      const updatedUser = mockTrainingStore.updateUser({ name, bio, image });
      revalidatePath("/", "layout");
      revalidatePath("/profile");
      revalidatePath("/dashboard");
      revalidatePath("/challenges");
      return { success: true, data: updatedUser };
    }

    const user = await requireAuthenticatedUser();
    const prisma = await getPrisma();

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        ...(bio !== undefined ? { bio } : {}),
        ...(image !== undefined ? { image } : {}),
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/challenges");

    return { success: true, data: updatedUser };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar perfil";
    return { success: false, error: message };
  }
}

export async function listChallenges(params?: { limit?: number; offset?: number }) {
  try {
    const limit = Math.min(50, Math.max(1, params?.limit ?? 15));
    const offset = Math.max(0, params?.offset ?? 0);

    if (isMockMode()) {
      const result = mockTrainingStore.listChallenges({ limit, offset });
      const nextOffset = offset + result.items.length;
      return {
        success: true,
        data: {
          items: result.items,
          total: result.total,
          offset,
          nextOffset,
          hasMore: nextOffset < result.total,
          userElo: mockTrainingStore.getCurrentUser().elo,
        },
      };
    }

    const prisma = await getPrisma();
    const [user, total] = await Promise.all([
      getOptionalAuthenticatedUser(),
      prisma.challenge.count(),
    ]);

    const challenges = await prisma.challenge.findMany({
      include: user
        ? {
            attempts: {
              where: {
                userId: user.id,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          }
        : undefined,
      orderBy: {
        recommendedElo: "asc",
      },
      take: limit,
      skip: offset,
    });

    const nextOffset = offset + challenges.length;
    return {
      success: true,
      data: {
        items: challenges,
        total,
        offset,
        nextOffset,
        hasMore: nextOffset < total,
        userElo: user?.elo ?? 1200,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao buscar desafios";
    return { success: false, error: message };
  }
}

export async function getChallengeById(id: string) {
  try {
    if (isMockMode()) {
      const challenge = mockTrainingStore.getChallengeById(id);
      return challenge
        ? { success: true, data: challenge }
        : { success: false, error: "Desafio não encontrado" };
    }

    const prisma = await getPrisma();
    const user = await getOptionalAuthenticatedUser();

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: user
        ? {
            attempts: {
              where: {
                userId: user.id,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          }
        : undefined,
    });

    if (!challenge) {
      return { success: false, error: "Desafio não encontrado" };
    }

    return { success: true, data: challenge };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao buscar desafio";
    return { success: false, error: message };
  }
}

export async function submitChallengeAttempt(challengeId: string, input: SubmitAttemptInput) {
  try {
    if (isMockMode()) {
      const result = mockTrainingStore.submitAttempt(challengeId, input);
      revalidatePath("/profile");
      revalidatePath("/challenges");
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/challenges");
      return { success: true, data: result };
    }

    const user = await requireAuthenticatedUser();
    const prisma = await getPrisma();
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return { success: false, error: "Desafio não encontrado" };
    }

    const feedbackObj = await getFeedbackFromOpenRouter(
      {
        id: challenge.id,
        solution: challenge.solution,
        title: challenge.title,
        code: challenge.code,
        question: challenge.question,
      },
      input.userAnswer,
    );

    const score = Math.max(0, Math.min(10, feedbackObj.score));
    const attemptResult = await prisma.$transaction(async (tx) => {
      const freshUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { id: true, elo: true },
      });

      if (!freshUser) {
        throw new Error("Usuário padrão local não encontrado");
      }

      const previousAttemptsCount = await tx.attempt.count({
        where: {
          userId: user.id,
          challengeId: challenge.id,
        },
      });

      const isFirstAttempt = previousAttemptsCount === 0;
      let eloChange = isFirstAttempt ? Math.round(calculateEloDelta(score)) : 0;
      if (input.usedHint && eloChange > 7) {
        eloChange = 7;
      }
      const newElo = isFirstAttempt ? Math.max(100, freshUser.elo + eloChange) : freshUser.elo;

      if (isFirstAttempt) {
        await tx.user.update({
          where: { id: user.id },
          data: { elo: newElo },
        });
      }

      await tx.attempt.create({
        data: {
          userId: user.id,
          challengeId: challenge.id,
          userAnswer: input.userAnswer,
          feedbackJson: JSON.stringify(feedbackObj),
          score,
          eloChange,
        },
      });

      return { eloChange, newElo, isFirstAttempt };
    });

    revalidatePath("/profile");
    revalidatePath("/challenges");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/challenges");

    return {
      success: true,
      data: {
        score,
        eloChange: attemptResult.eloChange,
        newElo: attemptResult.newElo,
        isFirstAttempt: attemptResult.isFirstAttempt,
        feedback: feedbackObj,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao enviar tentativa";
    return { success: false, error: message };
  }
}

export async function listCurrentUserAttempts() {
  try {
    if (isMockMode()) {
      return { success: true, data: mockTrainingStore.listAttempts() };
    }

    const user = await requireAuthenticatedUser();
    const prisma = await getPrisma();

    const attempts = await prisma.attempt.findMany({
      where: {
        userId: user.id,
      },
      include: {
        challenge: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: attempts };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao buscar histórico de tentativas";
    return { success: false, error: message };
  }
}

function getMockFeedback(solution: string): FeedbackPayload {
  return {
    score: 8,
    summary:
      "Você identificou os principais problemas do código, demonstrando boa compreensão do fluxo do React. Alguns detalhes mais sutis poderiam ser aprofundados.",
    strengths: [
      "Identificou o problema principal relacionado ao fluxo de estado e efeitos.",
      "Construiu uma explicação lógica sobre o impacto no comportamento do componente.",
    ],
    blindspots: [
      "Faltou detalhar o cleanup de efeitos assíncronos quando aplicável.",
      "Poderia mencionar estratégias para manter dependências estáveis entre renderizações.",
    ],
    seniorSolution: solution,
  };
}
