import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const promotedChallenges = [
  "react-hooks/react-effects-001-stale-closure-interval",
  "react-rendering/react-effects-002-object-dependency-loop",
  "react-hooks/react-effects-005-event-listener-stale-prop",
  "react-state/react-async-001-fetch-out-of-order",
  "react-state/react-async-003-loading-flag-shared-between-requests",
  "react-state/react-state-001-nested-state-mutation",
  "react-rendering/react-state-003-key-instability-on-reorder",
  "react-rendering/react-memo-001-usememo-side-effect",
  "react-interview/easy/react-contracts-001-controlled-uncontrolled-input",
  "typescript-types/ts-types-003-user-defined-type-guard-lie",
  "typescript-architecture/ts-arch-003-overload-contract-drift",
  "typescript-state/ts-state-001-shallow-copy-nested-state",
] as const;

function challengeRoot(relativePath: string) {
  return path.resolve(process.cwd(), "content", "challenges", relativePath);
}

describe("question bank wave 1 promotion", () => {
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
