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

export const COVERAGE_CHECKLIST_BY_CHALLENGE_TYPE: Record<
  QuestionBankChallengeType,
  readonly [string, string, string]
> = {
  debug: [
    "Identificar a causa raiz no snippet",
    "Explicar o impacto observavel para o usuario ou para o sistema",
    "Propor a correcao minima segura com justificativa",
  ],
  "explain-code": [
    "Descrever o que o codigo esta tentando fazer",
    "Explicar onde o contrato do codigo termina ou fica fragil",
    "Apontar trade-offs, limites ou riscos da abordagem",
  ],
  "explain-concept": [
    "Definir o conceito usando o snippet como base",
    "Explicar por que esse conceito importa na pratica",
    "Conectar o conceito a uma decisao de modelagem ou manutencao",
  ],
};

export const RUNTIME_CHALLENGE_TYPE_BY_SEED_TYPE: Record<QuestionBankChallengeType, string> = {
  debug: "debugging",
  "explain-code": "explain-code",
  "explain-concept": "explain-concept",
};

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

function renderChallengeTypeGuide() {
  const lines: string[] = [];

  for (const challengeType of Object.keys(COVERAGE_CHECKLIST_BY_CHALLENGE_TYPE) as QuestionBankChallengeType[]) {
    lines.push(`### ${challengeType}`);
    lines.push("");
    lines.push(`- Runtime type sugerido: \`${RUNTIME_CHALLENGE_TYPE_BY_SEED_TYPE[challengeType]}\``);

    if (challengeType === "debug") {
      lines.push("- Quando usar: quando o usuario precisa encontrar o erro, explicar impacto e propor fix.");
    } else if (challengeType === "explain-code") {
      lines.push("- Quando usar: quando o valor esta em ler o snippet com precisao e explicar seu contrato.");
    } else {
      lines.push("- Quando usar: quando o foco e explicar um principio tecnico usando o snippet como ancora.");
    }

    lines.push("- Cobertura minima:");
    lines.push(...COVERAGE_CHECKLIST_BY_CHALLENGE_TYPE[challengeType].map(item => `  - ${item}`));
    lines.push("");
  }

  return lines.join("\n");
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
    "## Tipos oficiais",
    "",
    renderChallengeTypeGuide(),
    "## Fluxo editorial",
    "",
    "1. Edite `scripts/question-bank/bank-data.ts` para adicionar ou revisar seeds.",
    "2. Rode `bun run question-bank:generate` para regenerar Markdown e docs derivadas.",
    "3. Rode `bun run question-bank:validate` para validar contagem, estrutura e colisao de paths.",
    "4. Promova para `content/challenges/` apenas quando a seed virar um desafio jogavel de verdade.",
    "",
    "## Temas",
    "",
    themeLines,
    "",
  ].join("\n");
}

export function renderQuestionBankAuthoringGuide(seeds: QuestionBankSeed[]) {
  const stats = collectQuestionBankStats(seeds);
  const themes = Object.entries(stats.byTheme)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([theme, count]) => `- ${theme}: ${count} seed(s)`)
    .join("\n");

  return [
    "# Question Bank Authoring Guide",
    "",
    "Guia canonico para criar, revisar e promover seeds do Kodan.",
    "",
    "## O que este banco e",
    "",
    "- `content/question-bank/` guarda seeds editoriais, nao desafios jogaveis finais.",
    "- A fonte de verdade humana fica em `scripts/question-bank/bank-data.ts`.",
    "- Os arquivos Markdown sao artefatos gerados para revisao, curadoria e futura promocao.",
    "",
    "## Tipos de pergunta aceitos",
    "",
    renderChallengeTypeGuide(),
    "## Regras editoriais",
    "",
    "- Portugues por padrao.",
    "- Snippet curto, cirurgico e com potencial de expansao.",
    "- O prompt deve pedir raciocinio, nao apenas resposta decorada.",
    "- `Expected Answer Summary` descreve o que uma boa resposta precisa cobrir.",
    "- `Expansion Notes` registra como a seed poderia crescer para um desafio real.",
    "",
    "## Fluxo recomendado",
    "",
    "1. Escolha `language`, `theme` e `challengeType` antes de escrever o prompt.",
    "2. Escreva o snippet minimo que ancora o raciocinio pedido.",
    "3. Use o checklist canonico do tipo de pergunta, ajustando apenas a redacao do prompt.",
    "4. Rode `bun run question-bank:generate`.",
    "5. Rode `bun run question-bank:validate`.",
    "6. Se a seed evoluir para runtime, crie uma pasta em `content/challenges/` com `challenge.json`, `code.tsx` e `solution.md`.",
    "",
    "## Ponte para runtime",
    "",
    "- Seed `debug` promove naturalmente para runtime `debugging`.",
    "- Seed `explain-code` pode virar runtime `explain-code` ou permanecer sem `type` explicito, se o consumidor aceitar o default.",
    "- Seed `explain-concept` vira runtime `explain-concept` quando a avaliacao pede explicacao de principio e trade-off.",
    "",
    "## Temas atuais",
    "",
    themes,
    "",
  ].join("\n");
}

export function renderQuestionBankSeedTemplate() {
  const defaultChecklist = COVERAGE_CHECKLIST_BY_CHALLENGE_TYPE.debug;

  return [
    "# Question Bank Seed Template",
    "",
    "Template copiavel para IA ou curadoria humana criar novas seeds no formato oficial do Kodan.",
    "",
    "## Como preencher",
    "",
    "- Troque os placeholders entre `<...>`.",
    "- `id` deve ser estavel, em kebab-case e unico no corpus.",
    "- `title` fica em portugues e descreve o foco editorial do caso.",
    "- `challengeType` decide o checklist minimo da resposta.",
    "- `miniSnippet` deve ser curto o suficiente para caber em uma leitura rapida.",
    "",
    "## Template",
    "",
    "~~~~md",
    "---",
    "id: <language-short>-<theme-short>-<nnn>-<slug>",
    "title: <titulo em portugues>",
    "language: typescript",
    "theme: <theme-existente-ou-novo>",
    "challengeType: debug",
    "difficulty: MEDIUM",
    "recommendedElo: 1450",
    "estimatedTime: 9",
    "tags:",
    "  - typescript",
    "  - <tag-1>",
    "  - <tag-2>",
    "---",
    "",
    "## Main Prompt",
    "Explique <o problema, comportamento ou conceito> usando o snippet abaixo.",
    "",
    "## Coverage Checklist",
    `1. ${defaultChecklist[0]}`,
    `2. ${defaultChecklist[1]}`,
    `3. ${defaultChecklist[2]}`,
    "",
    "## Mini Snippet",
    "```ts",
    "function example(value?: { id: string }) {",
    "  if (!value) return;",
    "  return value.id.toUpperCase();",
    "}",
    "```",
    "",
    "## Expected Answer Summary",
    "A resposta deve explicar <o raciocinio esperado>, incluindo risco, limite ou trade-off relevante.",
    "",
    "## Expansion Notes",
    "Pode crescer para <um desafio maior, uma tela real ou um fluxo de dominio>.",
    "~~~~",
    "",
    "## Variacoes por tipo",
    "",
    "- `debug`: foco em causa raiz, impacto e correcao minima segura.",
    "- `explain-code`: foco em intencao do codigo, contrato e limites.",
    "- `explain-concept`: foco em conceito, importancia pratica e decisao de modelagem.",
    "",
  ].join("\n");
}
