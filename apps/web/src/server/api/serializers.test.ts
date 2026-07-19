import { describe, expect, test } from "bun:test";

import { serializeChallengeDetail } from "./serializers";

describe("challenge serializers", () => {
  test("does not expose the reference solution in public challenge details", () => {
    const serialized = serializeChallengeDetail({
      id: "challenge-1",
      title: "Closure obsoleta",
      difficulty: "MEDIUM",
      recommendedElo: 1200,
      code: "const value = 1;",
      question: "Explique o problema.",
      solution: "Resposta secreta",
      tags: "react-hooks",
      attempts: [],
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(serialized).not.toHaveProperty("solution");
    expect(serialized.question).toBe("Explique o problema.");
  });
});
