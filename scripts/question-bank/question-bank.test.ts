import { describe, expect, test } from "bun:test";

import {
  collectQuestionBankStats,
  renderSeedMarkdown,
  validateSeedMarkdown,
  type QuestionBankSeed,
} from "./question-bank";
import { questionBankSeeds } from "./bank-data";

const sampleSeed: QuestionBankSeed = {
  id: "ts-sample-001",
  title: "Narrowing perdido apos await",
  language: "typescript",
  theme: "types-and-narrowing",
  challengeType: "debug",
  difficulty: "MEDIUM",
  recommendedElo: 1450,
  estimatedTime: 10,
  tags: ["typescript", "narrowing", "async"],
  mainPrompt: "Explique por que o narrowing nao sobrevive do jeito esperado.",
  coverageChecklist: [
    "Identificar a perda de garantia",
    "Explicar o risco em runtime",
    "Propor a correcao segura",
  ],
  miniSnippet: "async function run(input?: { value: string }) {\n  if (!input) return;\n  await Promise.resolve();\n  return input.value.toUpperCase();\n}",
  expectedAnswerSummary: "A boa resposta explica por que o valor pode mudar entre a checagem e o uso.",
  expansionNotes: "Expandir para fluxo com cancelamento e dependencias externas.",
};

describe("question bank toolkit", () => {
  test("renders markdown with required sections", () => {
    const markdown = renderSeedMarkdown(sampleSeed);

    expect(markdown).toContain("---");
    expect(markdown).toContain("## Main Prompt");
    expect(markdown).toContain("## Coverage Checklist");
    expect(markdown).toContain("## Mini Snippet");
    expect(markdown).toContain("## Expected Answer Summary");
    expect(markdown).toContain("## Expansion Notes");
  });

  test("reports validation errors for malformed markdown", () => {
    const errors = validateSeedMarkdown("# invalid");

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(error => error.includes("Main Prompt"))).toBe(true);
  });

  test("keeps the agreed corpus split", () => {
    const stats = collectQuestionBankStats(questionBankSeeds);

    expect(stats.total).toBe(75);
    expect(stats.byLanguage.typescript).toBe(50);
    expect(stats.byLanguage.react).toBe(25);
  });
});
