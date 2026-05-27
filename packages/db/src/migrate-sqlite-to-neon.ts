import path from "node:path";
import { fileURLToPath } from "node:url";

import { Database } from "bun:sqlite";

import { env } from "@CC/env/server";

import prisma from "./index";

type UserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  elo: number;
};

type SessionRow = {
  id: string;
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
};

type AccountRow = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  scope: string | null;
  password: string | null;
  createdAt: string;
  updatedAt: string;
};

type VerificationRow = {
  id: string;
  identifier: string;
  value: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

type ChallengeRow = {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  code: string;
  question: string;
  solution: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
};

type AttemptRow = {
  id: string;
  userId: string;
  challengeId: string;
  userAnswer: string;
  feedbackJson: string;
  score: number;
  eloChange: number;
  createdAt: string;
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const appDir = path.join(repoRoot, "apps", "web");

function resolveSqliteFile(input?: string) {
  const candidate = input ?? env.LEGACY_SQLITE_URL ?? "file:../../local.db";

  if (!candidate.startsWith("file:")) {
    throw new Error(`LEGACY_SQLITE_URL must use file: syntax. Received: ${candidate}`);
  }

  const filePath = candidate.slice("file:".length);
  return path.isAbsolute(filePath) ? filePath : path.resolve(appDir, filePath);
}

function asDate(value: string | null) {
  return value ? new Date(value) : null;
}

function getRows<T>(db: Database, table: string) {
  return db.query(`SELECT * FROM "${table}"`).all() as T[];
}

async function main() {
  const sqlitePath = resolveSqliteFile();
  const legacyDb = new Database(sqlitePath, { readonly: true });

  try {
    const users = getRows<UserRow>(legacyDb, "user");
    const sessions = getRows<SessionRow>(legacyDb, "session");
    const accounts = getRows<AccountRow>(legacyDb, "account");
    const verifications = getRows<VerificationRow>(legacyDb, "verification");
    const challenges = getRows<ChallengeRow>(legacyDb, "challenge");
    const attempts = getRows<AttemptRow>(legacyDb, "attempt");

    console.log(
      `[sqlite->neon] source=${sqlitePath} users=${users.length} sessions=${sessions.length} accounts=${accounts.length} verifications=${verifications.length} challenges=${challenges.length} attempts=${attempts.length}`,
    );

    await prisma.attempt.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.user.deleteMany();

    if (users.length > 0) {
      await prisma.user.createMany({
        data: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: Boolean(user.emailVerified),
          image: user.image,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          elo: user.elo,
        })),
      });
    }

    if (challenges.length > 0) {
      await prisma.challenge.createMany({
        data: challenges.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          difficulty: challenge.difficulty,
          recommendedElo: challenge.recommendedElo,
          code: challenge.code,
          question: challenge.question,
          solution: challenge.solution,
          tags: challenge.tags,
          createdAt: new Date(challenge.createdAt),
          updatedAt: new Date(challenge.updatedAt),
        })),
        skipDuplicates: true,
      });
    }

    if (verifications.length > 0) {
      await prisma.verification.createMany({
        data: verifications.map(verification => ({
          id: verification.id,
          identifier: verification.identifier,
          value: verification.value,
          expiresAt: new Date(verification.expiresAt),
          createdAt: new Date(verification.createdAt),
          updatedAt: new Date(verification.updatedAt),
        })),
      });
    }

    if (sessions.length > 0) {
      await prisma.session.createMany({
        data: sessions.map(session => ({
          id: session.id,
          expiresAt: new Date(session.expiresAt),
          token: session.token,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          userId: session.userId,
        })),
      });
    }

    if (accounts.length > 0) {
      await prisma.account.createMany({
        data: accounts.map(account => ({
          id: account.id,
          accountId: account.accountId,
          providerId: account.providerId,
          userId: account.userId,
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
          idToken: account.idToken,
          accessTokenExpiresAt: asDate(account.accessTokenExpiresAt),
          refreshTokenExpiresAt: asDate(account.refreshTokenExpiresAt),
          scope: account.scope,
          password: account.password,
          createdAt: new Date(account.createdAt),
          updatedAt: new Date(account.updatedAt),
        })),
      });
    }

    if (attempts.length > 0) {
      await prisma.attempt.createMany({
        data: attempts.map(attempt => ({
          id: attempt.id,
          userId: attempt.userId,
          challengeId: attempt.challengeId,
          userAnswer: attempt.userAnswer,
          feedbackJson: attempt.feedbackJson,
          score: attempt.score,
          eloChange: attempt.eloChange,
          createdAt: new Date(attempt.createdAt),
        })),
      });
    }

    console.log("[sqlite->neon] migration completed");
  } finally {
    legacyDb.close();
    await prisma.$disconnect();
  }
}

await main();
