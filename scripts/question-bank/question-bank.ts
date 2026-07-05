import path from "node:path";

export type QuestionBankLanguage = "typescript" | "react";
export type QuestionBankChallengeType = "debug" | "explain-code" | "explain-concept";
export type QuestionBankDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuestionBankSeed {
  id: string;
  title: string;
  language: QuestionBankLanguage;
  theme: string;
  challengeType: QuestionBankChallengeType;
  difficulty: QuestionBankDifficulty;
  recommendedElo: number;
  estimatedTime: number;
  tags: string[];
  mainPrompt: string;
  coverageChecklist: string[];
  miniSnippet: string;
  expectedAnswerSummary: string;
  expansionNotes: string;
}

export interface QuestionBankStats {
  total: number;
  byLanguage: Record<QuestionBankLanguage, number>;
  byChallengeType: Record<QuestionBankChallengeType, number>;
  byTheme: Record<string, number>;
}

export const REQUIRED_SECTIONS = [
  "## Main Prompt",
  "## Coverage Checklist",
  "## Mini Snippet",
  "## Expected Answer Summary",
  "## Expansion Notes",
] as const;

/**
 * Summarizes the current corpus by language, challenge type, and theme.
 */
export function collectQuestionBankStats(seeds: QuestionBankSeed[]): QuestionBankStats {
  const stats: QuestionBankStats = {
    total: seeds.length,
    byLanguage: {
      typescript: 0,
      react: 0,
    },
    byChallengeType: {
      debug: 0,
      "explain-code": 0,
      "explain-concept": 0,
    },
    byTheme: {},
  };

  for (const seed of seeds) {
    stats.byLanguage[seed.language] += 1;
    stats.byChallengeType[seed.challengeType] += 1;
    stats.byTheme[seed.theme] = (stats.byTheme[seed.theme] ?? 0) + 1;
  }

  return stats;
}

/**
 * Renders the YAML frontmatter for a single question-bank seed.
 */
function renderFrontmatter(seed: QuestionBankSeed) {
  const tagLines = seed.tags.map(tag => `  - ${tag}`).join("\n");

  return [
    "---",
    `id: ${seed.id}`,
    `title: ${seed.title}`,
    `language: ${seed.language}`,
    `theme: ${seed.theme}`,
    `challengeType: ${seed.challengeType}`,
    `difficulty: ${seed.difficulty}`,
    `recommendedElo: ${seed.recommendedElo}`,
    `estimatedTime: ${seed.estimatedTime}`,
    "tags:",
    tagLines,
    "---",
  ].join("\n");
}

/**
 * Converts a single seed into the canonical Markdown file persisted on disk.
 */
export function renderSeedMarkdown(seed: QuestionBankSeed) {
  const checklist = seed.coverageChecklist.map((item, index) => `${index + 1}. ${item}`).join("\n");
  const codeFence = seed.language === "react" ? "tsx" : "ts";

  return [
    renderFrontmatter(seed),
    "",
    "## Main Prompt",
    seed.mainPrompt,
    "",
    "## Coverage Checklist",
    checklist,
    "",
    "## Mini Snippet",
    `\`\`\`${codeFence}`,
    seed.miniSnippet.trimEnd(),
    "\`\`\`",
    "",
    "## Expected Answer Summary",
    seed.expectedAnswerSummary,
    "",
    "## Expansion Notes",
    seed.expansionNotes,
    "",
  ].join("\n");
}

/**
 * Validates the generated Markdown structure expected by the question-bank workflow.
 */
export function validateSeedMarkdown(markdown: string) {
  const errors: string[] = [];
  const lines = markdown.split(/\r?\n/);

  if (lines[0] !== "---") {
    errors.push("Missing frontmatter opening marker");
  }

  const frontmatterClosingIndex = lines.indexOf("---", 1);
  if (frontmatterClosingIndex === -1) {
    errors.push("Missing frontmatter closing marker");
  }

  const headingLines = new Set<string>();
  let insideCodeFence = false;

  for (let index = Math.max(frontmatterClosingIndex + 1, 0); index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("```")) {
      insideCodeFence = !insideCodeFence;
      continue;
    }

    if (!insideCodeFence && line.startsWith("## ")) {
      headingLines.add(line.trim());
    }
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!headingLines.has(section)) {
      errors.push(`Missing section: ${section}`);
    }
  }

  return errors;
}

/**
 * Derives the on-disk file path for a seed under the question-bank output root.
 */
export function getSeedOutputPath(rootDir: string, seed: QuestionBankSeed) {
  return path.join(rootDir, seed.language, seed.theme, `${seed.id}.md`);
}

/**
 * Detects storage key collisions before generation or validation can overwrite data.
 */
export function findDuplicateSeedOutputPaths(rootDir: string, seeds: QuestionBankSeed[]) {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];

  for (const seed of seeds) {
    const filePath = getSeedOutputPath(rootDir, seed);
    const previousSeedId = seen.get(filePath);

    if (previousSeedId) {
      duplicates.push(`${previousSeedId} and ${seed.id} map to ${filePath}`);
      continue;
    }

    seen.set(filePath, seed.id);
  }

  return duplicates;
}

/**
 * Renders the aggregate README that describes the generated corpus layout and totals.
 */
export function renderQuestionBankReadme(seeds: QuestionBankSeed[]) {
  const stats = collectQuestionBankStats(seeds);
  const themeLines = Object.entries(stats.byTheme)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([theme, count]) => `- ${theme}: ${count}`)
    .join("\n");

  return [
    "# Question Bank",
    "",
    "Banco-base editorial para futura promocao de seeds a desafios reais do Kodan.",
    "",
    "## Totais",
    "",
    `- Total: ${stats.total}`,
    `- TypeScript: ${stats.byLanguage.typescript}`,
    `- React: ${stats.byLanguage.react}`,
    `- Debug: ${stats.byChallengeType.debug}`,
    `- Explain-code: ${stats.byChallengeType["explain-code"]}`,
    `- Explain-concept: ${stats.byChallengeType["explain-concept"]}`,
    "",
    "## Estrutura",
    "",
    "Cada seed vive em um arquivo Markdown independente:",
    "",
    "`content/question-bank/<language>/<theme>/<id>.md`",
    "",
    "## Secoes obrigatorias",
    "",
    "- Main Prompt",
    "- Coverage Checklist",
    "- Mini Snippet",
    "- Expected Answer Summary",
    "- Expansion Notes",
    "",
    "## Temas",
    "",
    themeLines,
    "",
  ].join("\n");
}
