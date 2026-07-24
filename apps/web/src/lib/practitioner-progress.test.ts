import { describe, expect, test } from "bun:test";

import { buildPractitionerProgress } from "./practitioner-progress";

describe("buildPractitionerProgress", () => {
  test("consolida resoluções, precisão, sequência e primeiras tentativas", () => {
    const attempts = [
      { id: "repeat", score: 9, eloChange: 0, createdAt: new Date("2026-07-22T10:00:00Z"), challenge: { id: "a", difficulty: "HARD" } },
      { id: "first-a", score: 6, eloChange: 5, createdAt: new Date("2026-07-21T10:00:00Z"), challenge: { id: "a", difficulty: "HARD" } },
      { id: "first-b", score: 3, eloChange: -8, createdAt: new Date("2026-07-20T10:00:00Z"), challenge: { id: "b", difficulty: "EASY" } },
    ];

    const progress = buildPractitionerProgress(attempts, new Date("2026-07-22T12:00:00Z"));

    expect(progress.resolvedCount).toBe(1);
    expect(progress.accuracy).toBe(33);
    expect(progress.streak).toBe(3);
    expect(progress.studyHours).toBe(1);
    expect(progress.firstAttempts.map((attempt) => attempt.id)).toEqual(["first-b", "first-a"]);
  });

  test("não conta notas abaixo de sete como desafio resolvido", () => {
    const progress = buildPractitionerProgress([
      {
        score: 6,
        eloChange: 0,
        createdAt: new Date("2026-07-22T10:00:00Z"),
        challenge: { id: "a", difficulty: "EASY" },
      },
    ], new Date("2026-07-22T12:00:00Z"));

    expect(progress.resolvedCount).toBe(0);
    expect(progress.accuracy).toBe(0);
  });
});
