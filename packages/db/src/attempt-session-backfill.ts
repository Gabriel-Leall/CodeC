import type { PrismaClient } from "../prisma/generated/client";
import type { AttemptSessionStatus } from "../prisma/generated/enums";

const PASSING_ATTEMPT_SCORE = 7;
const MAX_EVALUATED_ATTEMPTS = 3;

type AttemptForBackfill = {
  id: string;
  userId: string;
  challengeId: string;
  score: number;
  createdAt: Date;
  attemptNumber: number;
  sessionStatus: AttemptSessionStatus;
};

type AttemptBackfillUpdate = {
  id: string;
  attemptNumber: number;
  sessionStatus: AttemptSessionStatus;
};

export function planAttemptSessionBackfill(
  attempts: AttemptForBackfill[],
): AttemptBackfillUpdate[] {
  const attemptsBySession = new Map<string, AttemptForBackfill[]>();

  for (const attempt of attempts) {
    const sessionKey = `${attempt.userId}\0${attempt.challengeId}`;
    const sessionAttempts = attemptsBySession.get(sessionKey) ?? [];
    sessionAttempts.push(attempt);
    attemptsBySession.set(sessionKey, sessionAttempts);
  }

  const updates: AttemptBackfillUpdate[] = [];
  for (const sessionAttempts of attemptsBySession.values()) {
    const chronologicalAttempts = sessionAttempts.toSorted(
      (left, right) =>
        left.createdAt.getTime() - right.createdAt.getTime() ||
        left.id.localeCompare(right.id),
    );

    for (const [index, attempt] of chronologicalAttempts.entries()) {
      const attemptNumber = index + 1;
      const sessionStatus = getBackfilledStatus(attempt.score, attemptNumber);
      if (
        attempt.attemptNumber !== attemptNumber ||
        attempt.sessionStatus !== sessionStatus
      ) {
        updates.push({ id: attempt.id, attemptNumber, sessionStatus });
      }
    }
  }

  return updates.toSorted((left, right) => left.id.localeCompare(right.id));
}

function getBackfilledStatus(
  score: number,
  attemptNumber: number,
): AttemptSessionStatus {
  if (score >= PASSING_ATTEMPT_SCORE) return "SOLVED";
  if (attemptNumber >= MAX_EVALUATED_ATTEMPTS) return "ELO_EXHAUSTED";
  return "RETRY_AVAILABLE";
}

export async function backfillAttemptSessions(
  prisma: PrismaClient,
  options: { apply: boolean },
) {
  const attempts = await prisma.attempt.findMany({
    orderBy: [
      { userId: "asc" },
      { challengeId: "asc" },
      { createdAt: "asc" },
      { id: "asc" },
    ],
    select: {
      id: true,
      userId: true,
      challengeId: true,
      score: true,
      createdAt: true,
      attemptNumber: true,
      sessionStatus: true,
    },
  });
  const updates = planAttemptSessionBackfill(attempts);

  if (options.apply && updates.length > 0) {
    await prisma.$transaction(
      updates.map((update) =>
        prisma.attempt.update({
          where: { id: update.id },
          data: {
            attemptNumber: update.attemptNumber,
            sessionStatus: update.sessionStatus,
          },
        })
      ),
    );
  }

  return {
    scanned: attempts.length,
    pending: updates.length,
    applied: options.apply ? updates.length : 0,
  };
}

if (import.meta.main) {
  const apply = process.argv.includes("--apply");
  const { default: prisma } = await import("./index");

  try {
    const result = await backfillAttemptSessions(prisma, { apply });
    const mode = apply ? "apply" : "dry-run";
    console.log(
      `[backfill:attempts] mode=${mode} scanned=${result.scanned} pending=${result.pending} applied=${result.applied}`,
    );
    if (!apply && result.pending > 0) {
      console.log(
        "[backfill:attempts] execute db:backfill:attempts:apply para persistir as correções.",
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}
