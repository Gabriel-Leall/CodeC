import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const promotedChallenges = [
  "react-rendering/react-memo-002-filtered-list-stale-dependency",
  "typescript-async/ts-async-003-abort-controller-leak",
  "typescript-generics/ts-generics-006-api-helper-returns-any",
  "typescript-types/ts-types-005-in-operator-on-partial-record",
] as const;

function challengeRoot(relativePath: string) {
  return path.resolve(process.cwd(), "content", "challenges", relativePath);
}

describe("question bank wave 3 promotion", () => {
  test("promoted challenges exist with split content files", () => {
    for (const relativePath of promotedChallenges) {
      const directory = challengeRoot(relativePath);
      expect(existsSync(directory)).toBe(true);
      expect(existsSync(path.join(directory, "challenge.json"))).toBe(true);
      expect(existsSync(path.join(directory, "code.tsx"))).toBe(true);
      expect(existsSync(path.join(directory, "solution.md"))).toBe(true);
    }
  });

  test("promoted questions keep the arena prompt format", () => {
    for (const relativePath of promotedChallenges) {
      const challengeJson = JSON.parse(
        readFileSync(path.join(challengeRoot(relativePath), "challenge.json"), "utf8"),
      ) as { question: string };

      expect(challengeJson.question.includes("Na sua resposta, cubra:")).toBe(true);
      expect(challengeJson.question.includes("1)")).toBe(true);
      expect(challengeJson.question.includes("2)")).toBe(true);
      expect(challengeJson.question.includes("3)")).toBe(true);
    }
  });
});
