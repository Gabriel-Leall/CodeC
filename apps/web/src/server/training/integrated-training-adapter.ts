import "server-only";

import { headers } from "next/headers";

import {
  evaluateAttempt,
  MAX_EVALUATED_ATTEMPTS,
  revealAttemptSolution as buildRevealedAttempt,
  type AttemptSessionStatus,
} from "./attempt-execution";
import { loadPractitionerCountsForChallenges } from "./challenge-practitioner-counts";
import type { TrainingAdapter, TrainingChallenge } from "./training-adapter";

async function getPrisma() {
  const { default: prisma } = await import("@kodan/db");
  return prisma;
}

async function getFeedbackFromOpenRouter(
  challenge: Pick<TrainingChallenge, "title" | "question" | "code" | "solution">,
  userAnswer: string,
) {
  const { env } = await import("@kodan/env/server");
  if (!env.OPENROUTER_API_KEY) return undefined;

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
              "Você é um tech lead especialista em React avaliando a resposta de um aluno para um desafio de diagnóstico de código. " +
              "VALIDAÇÃO E PONTUAÇÃO OBRIGATÓRIAS:\n" +
              "1. Se a resposta do aluno for irrelevante, aleatória, com caracteres desconexos, ou não tiver nenhuma relação com a Pergunta e a Solução (ex: falar de algo totalmente fora de contexto): a nota DEVE ser de 0 a 2 (reprovado).\n" +
              "2. Se a resposta tentar abordar o problema mas estiver errada, incompleta ou distante do diagnóstico e solução de referência: dê nota de 3 a 6 (reprovado).\n" +
              "3. Apenas dê nota >= 7 se a resposta identificar a causa do problema e explicar a correção correta.\n" +
              "Retorne estritamente um JSON com os campos: score (0-10), summary (string), strengths (string[]), blindspots (string[]).",
          },
          {
            role: "user",
            content: `Desafio: ${challenge.title}\n\nPergunta: ${challenge.question}\n\nCódigo:\n${challenge.code}\n\nSolução de referência:\n${challenge.solution}\n\nResposta do aluno:\n${userAnswer}`,
          },
        ],
      }),
    });
    if (!response.ok) return undefined;

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    return content ? JSON.parse(cleanJsonResponse(content)) as unknown : undefined;
  } catch {
    return undefined;
  }
}

function cleanJsonResponse(raw: string) {
  return raw.trim().replace(/^```[a-zA-Z]*\s*/, "").replace(/\s*```$/, "").trim();
}

function isSerializableConflict(error: unknown) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2034"
  );
}

async function withSerializableRetry<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!isSerializableConflict(error)) throw error;
    return operation();
  }
}

export const integratedTrainingAdapter: TrainingAdapter = {
  async getOptionalUser() {
    const [{ auth }, prisma, requestHeaders] = await Promise.all([
      import("@kodan/auth"),
      getPrisma(),
      headers(),
    ]);
    const session = await auth.api.getSession({ headers: requestHeaders });
    return session?.user
      ? prisma.user.findUnique({ where: { id: session.user.id } })
      : null;
  },
  async getUserById(userId) {
    const prisma = await getPrisma();
    return prisma.user.findUnique({ where: { id: userId } });
  },
  async updateUser(userId, input) {
    const prisma = await getPrisma();
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        ...(input.bio !== undefined ? { bio: input.bio } : {}),
        ...(input.image !== undefined ? { image: input.image } : {}),
      },
    });
  },
  async listChallenges({ limit, offset, userId }) {
    const prisma = await getPrisma();
    const [user, total, items] = await Promise.all([
      userId ? prisma.user.findUnique({ where: { id: userId } }) : null,
      prisma.challenge.count(),
      prisma.challenge.findMany({
        include: userId
          ? { attempts: { where: { userId }, orderBy: { createdAt: "desc" }, take: 1 } }
          : undefined,
        orderBy: { recommendedElo: "asc" },
        take: limit,
        skip: offset,
      }),
    ]);
    const uniquePractitionersByChallenge =
      await loadPractitionerCountsForChallenges(
        prisma.attempt,
        items.map((challenge) => challenge.id),
      );
    return {
      items: items.map((challenge) => ({
        ...challenge,
        uniquePractitionerCount:
          uniquePractitionersByChallenge.get(challenge.id) ?? 0,
      })),
      total,
      userElo: user?.elo ?? 1200,
    };
  },
  async getChallengeById(id, userId) {
    const prisma = await getPrisma();
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: userId
        ? { attempts: { where: { userId }, orderBy: { createdAt: "desc" } } }
        : undefined,
    });
    if (!challenge) return null;
    const practitionerPairs = await prisma.attempt.findMany({
      where: { challengeId: id },
      select: { userId: true },
      distinct: ["userId"],
    });
    return {
      ...challenge,
      uniquePractitionerCount: practitionerPairs.length,
    };
  },
  async submitAttempt(userId, challengeId, input) {
    const prisma = await getPrisma();
    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new Error("Desafio não encontrado");

    const feedbackInput = await getFeedbackFromOpenRouter(challenge, input.userAnswer);
    return withSerializableRetry(() =>
      prisma.$transaction(async (tx) => {
        const freshUser = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true, elo: true },
        });
        if (!freshUser) throw new Error("Usuário padrão local não encontrado");

        const previousAttempts = await tx.attempt.findMany({
          where: { userId, challengeId },
          orderBy: { createdAt: "desc" },
          select: { sessionStatus: true },
        });
        if (previousAttempts.length >= MAX_EVALUATED_ATTEMPTS) {
          throw new Error("Limite de tentativas atingido");
        }
        const latestStatus = previousAttempts[0]?.sessionStatus;
        if (latestStatus && latestStatus !== "RETRY_AVAILABLE") {
          throw new Error("Tentativa encerrada");
        }

        const evaluation = evaluateAttempt({
          currentElo: freshUser.elo,
          previousAttemptsCount: previousAttempts.length,
          usedHint: Boolean(input.usedHint),
          solution: challenge.solution,
          question: challenge.question,
          code: challenge.code,
          userAnswer: input.userAnswer,
          feedback: feedbackInput,
        });

        if (evaluation.eloChange !== 0) {
          await tx.user.update({
            where: { id: userId },
            data: { elo: evaluation.newElo },
          });
        }
        await tx.attempt.create({
          data: {
            userId,
            challengeId,
            userAnswer: input.userAnswer,
            feedbackJson: JSON.stringify(evaluation.feedback),
            score: evaluation.score,
            eloChange: evaluation.eloChange,
            attemptNumber: evaluation.attemptNumber,
            sessionStatus: evaluation.status,
          },
        });
        return evaluation;
      }, { isolationLevel: "Serializable" })
    );
  },
  async revealAttemptSolution(userId, challengeId) {
    const prisma = await getPrisma();
    return withSerializableRetry(() =>
      prisma.$transaction(async (tx) => {
        const [user, challenge, latestAttempt] = await Promise.all([
          tx.user.findUnique({ where: { id: userId }, select: { elo: true } }),
          tx.challenge.findUnique({ where: { id: challengeId }, select: { solution: true } }),
          tx.attempt.findFirst({
            where: { userId, challengeId },
            orderBy: { createdAt: "desc" },
          }),
        ]);
        if (!user) throw new Error("Usuário padrão local não encontrado");
        if (!challenge) throw new Error("Desafio não encontrado");
        if (
          !latestAttempt ||
          latestAttempt.sessionStatus === "SOLVED" ||
          latestAttempt.sessionStatus === "REVEALED"
        ) {
          throw new Error("Tentativa encerrada");
        }

        const revealed = buildRevealedAttempt({
          currentElo: user.elo,
          attemptNumber: latestAttempt.attemptNumber,
          solution: challenge.solution,
          feedback: JSON.parse(latestAttempt.feedbackJson) as unknown,
        });
        await tx.attempt.update({
          where: { id: latestAttempt.id },
          data: {
            feedbackJson: JSON.stringify(revealed.feedback),
            sessionStatus: revealed.status,
          },
        });
        return revealed;
      }, { isolationLevel: "Serializable" })
    );
  },
  async listAttempts(userId) {
    const prisma = await getPrisma();
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      include: { challenge: true },
      orderBy: { createdAt: "desc" },
    });
    return attempts.map((attempt) => ({
      ...attempt,
      sessionStatus: attempt.sessionStatus as AttemptSessionStatus,
    }));
  },
  async listRecommendations(_userId, attemptedChallengeIds, limit) {
    const prisma = await getPrisma();
    return prisma.challenge.findMany({
      where: attemptedChallengeIds.length > 0 ? { id: { notIn: attemptedChallengeIds } } : undefined,
      orderBy: [{ recommendedElo: "asc" }, { createdAt: "desc" }],
      take: limit,
    });
  },
};
