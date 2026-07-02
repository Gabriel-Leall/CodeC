import { readFile } from "node:fs/promises";
import path from "node:path";

import { questionBankSeeds } from "./bank-data";
import {
  collectQuestionBankStats,
  findDuplicateSeedOutputPaths,
  getSeedOutputPath,
  validateSeedMarkdown,
} from "./question-bank";

const outputRoot = path.resolve(process.cwd(), "content", "question-bank");

async function validate() {
  const stats = collectQuestionBankStats(questionBankSeeds);
  const errors: string[] = [];
  const duplicatePaths = findDuplicateSeedOutputPaths(outputRoot, questionBankSeeds);

  if (duplicatePaths.length > 0) {
    errors.push(...duplicatePaths.map(path => `Duplicate seed output path: ${path}`));
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exitCode = 1;
    return;
  }

  if (stats.total < 75) {
    errors.push(`Expected at least 75 seeds, received ${stats.total}`);
  }

  if (stats.byLanguage.typescript < 50) {
    errors.push(`Expected at least 50 TypeScript seeds, received ${stats.byLanguage.typescript}`);
  }

  if (stats.byLanguage.react < 25) {
    errors.push(`Expected at least 25 React seeds, received ${stats.byLanguage.react}`);
  }

  for (const seed of questionBankSeeds) {
    const filePath = getSeedOutputPath(outputRoot, seed);
    let markdown: string;

    try {
      markdown = await readFile(filePath, "utf-8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${seed.id}: unable to read ${filePath} (${message})`);
      continue;
    }

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
