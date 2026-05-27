import "server-only";

import prisma from "@CC/db";

export const DEFAULT_LOCAL_USER_EMAIL = "default@trainer.com";
export const DEFAULT_LOCAL_USER_NAME = "Treinador CCT";
export const DEFAULT_LOCAL_USER_ELO = 1200;
const DEFAULT_LOCAL_USER_ID = "default-user-id";

export async function ensureDefaultLocalUser() {
  return prisma.user.upsert({
    where: {
      email: DEFAULT_LOCAL_USER_EMAIL,
    },
    update: {},
    create: {
      id: DEFAULT_LOCAL_USER_ID,
      name: DEFAULT_LOCAL_USER_NAME,
      email: DEFAULT_LOCAL_USER_EMAIL,
      elo: DEFAULT_LOCAL_USER_ELO,
      emailVerified: true,
    },
  });
}
