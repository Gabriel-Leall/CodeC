import { describe, expect, test } from "bun:test";

import { planAttemptSessionBackfill } from "./attempt-session-backfill";

describe("planAttemptSessionBackfill", () => {
  test("recalcula número e status por praticante e desafio", () => {
    const updates = planAttemptSessionBackfill([
      attempt({
        id: "a-3",
        userId: "user-a",
        challengeId: "challenge-a",
        score: 4,
        createdAt: "2026-01-03T00:00:00.000Z",
      }),
      attempt({
        id: "b-1",
        userId: "user-b",
        challengeId: "challenge-a",
        score: 8,
        createdAt: "2026-01-01T12:00:00.000Z",
      }),
      attempt({
        id: "a-1",
        userId: "user-a",
        challengeId: "challenge-a",
        score: 4,
        createdAt: "2026-01-01T00:00:00.000Z",
      }),
      attempt({
        id: "a-2",
        userId: "user-a",
        challengeId: "challenge-a",
        score: 8,
        createdAt: "2026-01-02T00:00:00.000Z",
      }),
    ]);

    expect(updates).toEqual([
      { id: "a-2", attemptNumber: 2, sessionStatus: "SOLVED" },
      { id: "a-3", attemptNumber: 3, sessionStatus: "ELO_EXHAUSTED" },
      { id: "b-1", attemptNumber: 1, sessionStatus: "SOLVED" },
    ]);
  });

  test("é idempotente e ignora registros já classificados", () => {
    const updates = planAttemptSessionBackfill([
      attempt({
        id: "ready",
        attemptNumber: 1,
        sessionStatus: "SOLVED",
        score: 9,
      }),
    ]);

    expect(updates).toEqual([]);
  });
});

function attempt(overrides: Partial<{
  id: string;
  userId: string;
  challengeId: string;
  score: number;
  createdAt: string | Date;
  attemptNumber: number;
  sessionStatus: "RETRY_AVAILABLE" | "SOLVED" | "ELO_EXHAUSTED" | "REVEALED";
}> = {}) {
  const { createdAt, ...rest } = overrides;
  return {
    id: "attempt-1",
    userId: "user-1",
    challengeId: "challenge-1",
    score: 4,
    attemptNumber: 1,
    sessionStatus: "RETRY_AVAILABLE" as
      | "RETRY_AVAILABLE"
      | "SOLVED"
      | "ELO_EXHAUSTED"
      | "REVEALED",
    ...rest,
    createdAt: new Date(createdAt ?? "2026-01-01T00:00:00.000Z"),
  };
}
