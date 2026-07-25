import { env } from "@kodan/env/server";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

import { PrismaClient } from "../prisma/generated/client";

export function createPrismaClient() {
  if (env.DATABASE_URL.includes("neon.tech")) {
    const adapter = new PrismaNeon({
      connectionString: env.DATABASE_URL,
    });
    return new PrismaClient({ adapter });
  }

  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();
export default prisma;
