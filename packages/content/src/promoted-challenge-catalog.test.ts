import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { readPromotedChallengeCatalog } from "./promoted-challenge-catalog";

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("readPromotedChallengeCatalog", () => {
  test("materializa desafios legacy e split por uma raiz explícita", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "kodan-catalog-"));
    temporaryRoots.push(root);
    await writeFile(path.join(root, "legacy.json"), JSON.stringify({
      id: "legacy", title: "Legacy", difficulty: "EASY", recommendedElo: 1100,
      question: "Qual é o problema?", tags: ["typescript", "react"], code: "const a = 1", solution: "Explique a causa.",
    }));
    const split = path.join(root, "split");
    await mkdir(split);
    await writeFile(path.join(split, "challenge.json"), JSON.stringify({
      id: "split", title: "Split", difficulty: "HARD", recommendedElo: 1500,
      question: "Qual é o problema?", tags: ["typescript"],
    }));
    await writeFile(path.join(split, "code.tsx"), "const value: string = 'x';");
    await writeFile(path.join(split, "solution.md"), "Use narrowing.");

    const catalog = await readPromotedChallengeCatalog({ root });

    expect(catalog.challenges.map((challenge) => challenge.id)).toEqual(["legacy", "split"]);
    expect(catalog.index.find((entry) => entry.id === "legacy")?.language).toBe("react");
    expect(catalog.index.find((entry) => entry.id === "split")?.language).toBe("typescript");
  });
});
