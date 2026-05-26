import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "../prisma/generated/client";
import {
  challengeIndexSchema,
  challengeLegacySchema,
  challengeSplitMetaSchema,
  type ChallengeIndexEntry,
  type ChallengeLegacy,
  type ChallengeSplitMeta,
} from "./challenge-schemas";

export type ChallengeContentEntry = {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  code: string;
  question: string;
  solution: string;
  tags: string[];
};

type ChallengeLoadResult = {
  challenge: ChallengeContentEntry;
  indexEntry: ChallengeIndexEntry;
};

type ChallengeSource =
  | {
      kind: "split";
      filePath: string;
    }
  | {
      kind: "legacy";
      filePath: string;
    };

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

function getCandidateRoots() {
  return [
    path.resolve(process.cwd(), "content", "challenges"),
    path.resolve(process.cwd(), "..", "..", "content", "challenges"),
    path.resolve(moduleDir, "..", "..", "..", "content", "challenges"),
  ];
}

async function resolveContentRoot() {
  for (const candidate of getCandidateRoots()) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("Pasta de conteúdo não encontrada em /content/challenges");
}

async function readJsonUnknown(filePath: string): Promise<unknown> {
  const raw = await readFile(filePath, "utf-8");
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error(`JSON inválido em ${filePath}`);
  }
}

function inferLanguage(tags: string[]): string {
  const normalized = tags.map(tag => tag.toLowerCase());
  if (normalized.includes("react")) {
    return "react";
  }
  if (normalized.includes("typescript")) {
    return "typescript";
  }
  if (normalized.includes("javascript")) {
    return "javascript";
  }
  return "react";
}

function buildIndexEntryFromMeta(meta: {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  recommendedElo: number;
  tags: string[];
  language?: string;
  type?: string;
  estimatedTime?: number;
  status?: string;
}): ChallengeIndexEntry {
  return {
    id: meta.id,
    title: meta.title,
    language: meta.language ?? inferLanguage(meta.tags),
    difficulty: meta.difficulty,
    type: meta.type ?? "debugging",
    tags: meta.tags,
    estimatedTime: meta.estimatedTime ?? (meta.difficulty === "HARD" ? 18 : meta.difficulty === "MEDIUM" ? 12 : 8),
    recommendedElo: meta.recommendedElo,
    status: meta.status ?? "ACTIVE",
  };
}

async function collectChallengeSources(root: string): Promise<ChallengeSource[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const challengeJson = entries.find(entry => entry.isFile() && entry.name.toLowerCase() === "challenge.json");
  if (challengeJson) {
    return [
      {
        kind: "split",
        filePath: path.join(root, challengeJson.name),
      },
    ];
  }

  const files: ChallengeSource[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectChallengeSources(fullPath);
      files.push(...nested);
      continue;
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".json")) {
      continue;
    }

    const name = entry.name.toLowerCase();
    if (name === "index.json") {
      continue;
    }

    files.push({
      kind: "legacy",
      filePath: fullPath,
    });
  }

  return files;
}

async function loadLegacyChallenge(filePath: string): Promise<ChallengeLoadResult> {
  const parsed = challengeLegacySchema.parse(await readJsonUnknown(filePath)) as ChallengeLegacy;
  const solution = parsed.solution ?? parsed.expectedAnswer ?? "";

  const challenge: ChallengeContentEntry = {
    id: parsed.id,
    title: parsed.title,
    difficulty: parsed.difficulty,
    recommendedElo: parsed.recommendedElo,
    code: parsed.code,
    question: parsed.question,
    solution,
    tags: parsed.tags,
  };

  return {
    challenge,
    indexEntry: buildIndexEntryFromMeta(parsed),
  };
}

async function loadSplitChallenge(filePath: string): Promise<ChallengeLoadResult> {
  const parsed = challengeSplitMetaSchema.parse(await readJsonUnknown(filePath)) as ChallengeSplitMeta;

  const codeFileName = parsed.codeFile ?? "code.tsx";
  const solutionFileName = parsed.solutionFile ?? parsed.expectedAnswerFile ?? "solution.md";
  const codePath = path.resolve(path.dirname(filePath), codeFileName);
  const solutionPath = path.resolve(path.dirname(filePath), solutionFileName);

  const [code, solution] = await Promise.all([
    readFile(codePath, "utf-8"),
    readFile(solutionPath, "utf-8"),
  ]);

  if (code.trim().length === 0) {
    throw new Error(`Desafio inválido em ${filePath}: arquivo "${codeFileName}" vazio`);
  }

  if (solution.trim().length === 0) {
    throw new Error(`Desafio inválido em ${filePath}: arquivo "${solutionFileName}" vazio`);
  }

  const challenge: ChallengeContentEntry = {
    id: parsed.id,
    title: parsed.title,
    difficulty: parsed.difficulty,
    recommendedElo: parsed.recommendedElo,
    question: parsed.question,
    tags: parsed.tags,
    code,
    solution,
  };

  return {
    challenge,
    indexEntry: buildIndexEntryFromMeta(parsed),
  };
}

async function loadChallengesAndIndex(root: string) {
  const sources = (await collectChallengeSources(root)).sort((a, b) => a.filePath.localeCompare(b.filePath));
  const ids = new Set<string>();
  const challenges: ChallengeContentEntry[] = [];
  const index: ChallengeIndexEntry[] = [];

  for (const source of sources) {
    const loaded =
      source.kind === "split"
        ? await loadSplitChallenge(source.filePath)
        : await loadLegacyChallenge(source.filePath);

    if (ids.has(loaded.challenge.id)) {
      throw new Error(`ID duplicado encontrado em ${source.filePath}: "${loaded.challenge.id}"`);
    }

    ids.add(loaded.challenge.id);
    challenges.push(loaded.challenge);
    index.push(loaded.indexEntry);
  }

  const validatedIndex = challengeIndexSchema.parse(index);
  return { challenges, index: validatedIndex };
}

export async function readChallengesFromContent() {
  const root = await resolveContentRoot();
  return (await loadChallengesAndIndex(root)).challenges;
}

export async function syncChallengesIndexFromContent() {
  const root = await resolveContentRoot();
  const { index } = await loadChallengesAndIndex(root);
  const indexPath = path.join(root, "index.json");
  await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf-8");
  return { total: index.length, indexPath };
}

export async function upsertChallengesFromContent(prisma: PrismaClient) {
  const challenges = await readChallengesFromContent();
  const ids = challenges.map(ch => ch.id);

  const existing = await prisma.challenge.findMany({
    where: {
      id: { in: ids },
    },
    select: { id: true },
  });

  const existingIds = new Set(existing.map(item => item.id));
  let inserted = 0;
  let updated = 0;

  for (const challenge of challenges) {
    const payload = {
      title: challenge.title,
      difficulty: challenge.difficulty,
      recommendedElo: challenge.recommendedElo,
      code: challenge.code,
      question: challenge.question,
      solution: challenge.solution,
      tags: challenge.tags.join(","),
    };

    await prisma.challenge.upsert({
      where: { id: challenge.id },
      update: payload,
      create: {
        id: challenge.id,
        ...payload,
      },
    });

    if (existingIds.has(challenge.id)) {
      updated += 1;
    } else {
      inserted += 1;
    }
  }

  return {
    total: challenges.length,
    inserted,
    updated,
  };
}
