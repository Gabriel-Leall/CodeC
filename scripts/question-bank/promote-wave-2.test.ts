import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const promotedChallenges = [
  "react-state/react-async-004-retry-button-double-submit",
  "react-state/react-state-004-optimistic-counter-race",
  "react-interview/medium/react-contracts-004-component-api-incompatible-default",
  "typescript-async/ts-async-001-race-guard-after-await",
  "typescript-async/ts-async-007-stale-cache-write",
  "typescript-state/ts-state-009-defensive-copy-at-boundary",
  "typescript-generics/ts-generics-001-generic-constraint-too-wide",
  "typescript-generics/ts-generics-008-generic-reducer-action-payload",
] as const;

function challengeRoot(relativePath: string) {
  return path.resolve(process.cwd(), "content", "challenges", relativePath);
}

describe("question bank wave 2 promotion", () => {
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
