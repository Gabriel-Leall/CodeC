import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { PrismaClient } from "../prisma/generated/client";

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

async function collectJsonFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectJsonFiles(fullPath);
      files.push(...nested);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

function assertChallengeShape(input: unknown, filePath: string): asserts input is ChallengeContentEntry {
  if (!input || typeof input !== "object") {
    throw new Error(`Desafio inválido em ${filePath}: payload não é objeto`);
  }

  const candidate = input as Record<string, unknown>;
  const requiredStringFields = ["id", "title", "difficulty", "code", "question", "solution"];

  for (const field of requiredStringFields) {
    if (typeof candidate[field] !== "string" || candidate[field]!.toString().trim().length === 0) {
      throw new Error(`Desafio inválido em ${filePath}: campo "${field}" ausente ou vazio`);
    }
  }

  if (typeof candidate.recommendedElo !== "number" || !Number.isFinite(candidate.recommendedElo)) {
    throw new Error(`Desafio inválido em ${filePath}: "recommendedElo" deve ser número`);
  }

  if (!Array.isArray(candidate.tags) || candidate.tags.some(tag => typeof tag !== "string")) {
    throw new Error(`Desafio inválido em ${filePath}: "tags" deve ser string[]`);
  }
}

export async function readChallengesFromContent() {
  const root = await resolveContentRoot();
  const jsonFiles = await collectJsonFiles(root);
  const challenges: ChallengeContentEntry[] = [];

  for (const filePath of jsonFiles) {
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    assertChallengeShape(parsed, filePath);
    challenges.push(parsed);
  }

  return challenges;
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
