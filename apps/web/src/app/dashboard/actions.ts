"use server";

import { auth } from "@CC/auth";
import prisma from "@CC/db";
import { env } from "@CC/env/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { ensureDefaultLocalUser } from "@/lib/local-user";

type FeedbackPayload = {
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

export async function getLocalUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      // Local MVP mode: allow default local user without a remote auth session.
      await ensureDefaultLocalUser();
    }

    const user = await ensureDefaultLocalUser();
    return { success: true, data: user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao obter usuário local";
    return { success: false, error: message };
  }
}

export async function getChallenges(params?: { limit?: number; offset?: number }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      await ensureDefaultLocalUser();
    }

    const user = await ensureDefaultLocalUser();
    const limit = Math.min(50, Math.max(1, params?.limit ?? 15));
    const offset = Math.max(0, params?.offset ?? 0);
    const total = await prisma.challenge.count();

    const challenges = await prisma.challenge.findMany({
      include: {
        attempts: {
          where: {
            userId: user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
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
        userElo: user.elo,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro ao buscar desafios";
    return { success: false, error: message };
  }
}

export async function getChallenge(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      await ensureDefaultLocalUser();
    }

    await ensureDefaultLocalUser();

    const challenge = await prisma.challenge.findUnique({
      where: { id },
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

export async function submitAttempt(challengeId: string, userAnswer: string, usedHint?: boolean) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      await ensureDefaultLocalUser();
    }

    const user = await ensureDefaultLocalUser();
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
      userAnswer,
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
      if (usedHint && eloChange > 7) {
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
          userAnswer,
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

export async function getAttemptsHistory() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      await ensureDefaultLocalUser();
    }

    const user = await ensureDefaultLocalUser();

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
