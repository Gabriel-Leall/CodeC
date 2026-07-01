import { describe, expect, test } from "bun:test";

import {
  collectQuestionBankStats,
  findDuplicateSeedOutputPaths,
  getSeedOutputPath,
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

    expect(errors).toContain("Missing frontmatter opening marker");
    expect(errors).toContain("Missing frontmatter closing marker");
    expect(errors).toContain("Missing section: ## Main Prompt");
  });

  test("accepts frontmatter rendered with CRLF line endings", () => {
    const markdown = renderSeedMarkdown(sampleSeed).replaceAll("\n", "\r\n");

    expect(validateSeedMarkdown(markdown)).toEqual([]);
  });

  test("rejects markdown when a required section only appears inside a code fence", () => {
    const markdown = [
      "---",
      "id: ts-sample-001",
      "---",
      "## Main Prompt",
      "Prompt real",
      "## Coverage Checklist",
      "1. item",
      "## Mini Snippet",
      "```ts",
      "## Expected Answer Summary",
      "```",
      "## Expansion Notes",
      "Notas",
    ].join("\n");

    expect(validateSeedMarkdown(markdown)).toContain("Missing section: ## Expected Answer Summary");
  });

  test("detects duplicate seed output paths before generation", () => {
    const duplicateSeed: QuestionBankSeed = {
      ...sampleSeed,
      title: "Seed duplicada",
    };

    expect(findDuplicateSeedOutputPaths("content/question-bank", [sampleSeed, duplicateSeed])).toEqual([
      `ts-sample-001 and ts-sample-001 map to ${getSeedOutputPath("content/question-bank", sampleSeed)}`,
    ]);
  });

  test("keeps the agreed corpus split", () => {
    const stats = collectQuestionBankStats(questionBankSeeds);

    expect(stats.total).toBe(75);
    expect(stats.byLanguage.typescript).toBe(50);
    expect(stats.byLanguage.react).toBe(25);
  });
});
