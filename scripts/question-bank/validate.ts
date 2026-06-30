import { readFile } from "node:fs/promises";
import path from "node:path";

import { questionBankSeeds } from "./bank-data";
import {
  collectQuestionBankStats,
  getSeedOutputPath,
  validateSeedMarkdown,
} from "./question-bank";

const outputRoot = path.resolve(process.cwd(), "content", "question-bank");

async function validate() {
  const stats = collectQuestionBankStats(questionBankSeeds);
  const errors: string[] = [];

  if (stats.total !== 75) {
    errors.push(`Expected 75 seeds, received ${stats.total}`);
  }

  if (stats.byLanguage.typescript !== 50) {
    errors.push(`Expected 50 TypeScript seeds, received ${stats.byLanguage.typescript}`);
  }

  if (stats.byLanguage.react !== 25) {
    errors.push(`Expected 25 React seeds, received ${stats.byLanguage.react}`);
  }

  for (const seed of questionBankSeeds) {
    const filePath = getSeedOutputPath(outputRoot, seed);
    const markdown = await readFile(filePath, "utf-8");
    const fileErrors = validateSeedMarkdown(markdown);
    errors.push(...fileErrors.map(error => `${seed.id}: ${error}`));
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Question bank valid: ${stats.total} seeds (${stats.byLanguage.typescript} TypeScript / ${stats.byLanguage.react} React)`);
}

await validate();
