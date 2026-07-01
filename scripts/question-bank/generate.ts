import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { questionBankSeeds } from "./bank-data";
import {
  findDuplicateSeedOutputPaths,
  getSeedOutputPath,
  renderQuestionBankReadme,
  renderSeedMarkdown,
} from "./question-bank";

const outputRoot = path.resolve(process.cwd(), "content", "question-bank");

async function generate() {
  const duplicatePaths = findDuplicateSeedOutputPaths(outputRoot, questionBankSeeds);
  if (duplicatePaths.length > 0) {
    throw new Error(`Duplicate seed output paths detected:\n${duplicatePaths.join("\n")}`);
  }

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  for (const seed of questionBankSeeds) {
    const filePath = getSeedOutputPath(outputRoot, seed);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${renderSeedMarkdown(seed).trimEnd()}\n`, "utf-8");
  }

  await writeFile(
    path.join(outputRoot, "README.md"),
    `${renderQuestionBankReadme(questionBankSeeds).trimEnd()}\n`,
    "utf-8",
  );

  console.log(`Generated ${questionBankSeeds.length} question-bank seeds in ${outputRoot}`);
}

await generate();
