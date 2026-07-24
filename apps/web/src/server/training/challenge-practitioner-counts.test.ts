import { describe, expect, test } from "bun:test";

import { loadPractitionerCountsForChallenges } from "./challenge-practitioner-counts";

describe("loadPractitionerCountsForChallenges", () => {
  test("restringe a consulta aos desafios da página atual", async () => {
    let receivedQuery: unknown;
    const counts = await loadPractitionerCountsForChallenges(
      {
        findMany: async (query) => {
          receivedQuery = query;
          return [
            { challengeId: "challenge-a", userId: "user-1" },
            { challengeId: "challenge-a", userId: "user-2" },
            { challengeId: "challenge-b", userId: "user-1" },
          ];
        },
      },
      ["challenge-a", "challenge-b"],
    );

    expect(receivedQuery).toEqual({
      where: { challengeId: { in: ["challenge-a", "challenge-b"] } },
      select: { challengeId: true, userId: true },
      distinct: ["challengeId", "userId"],
    });
    expect(counts).toEqual(new Map([
      ["challenge-a", 2],
      ["challenge-b", 1],
    ]));
  });

  test("não consulta tentativas quando a página está vazia", async () => {
    let queried = false;
    const counts = await loadPractitionerCountsForChallenges(
      {
        findMany: async () => {
          queried = true;
          return [];
        },
      },
      [],
    );

    expect(queried).toBe(false);
    expect(counts.size).toBe(0);
  });
});
