import prisma from "@kodan/db";

import { ensureDefaultLocalUser } from "@/lib/local-user";
import { buildProfileViewModel } from "./profile-data";
import { ProfileShell } from "./profile-shell";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await ensureDefaultLocalUser();
  const attempts = await prisma.attempt.findMany({
    where: {
      userId: user.id,
    },
    include: {
      challenge: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const attemptedChallengeIds = new Set(
    attempts.map((attempt) => attempt.challengeId),
  );
  const recommendations = await prisma.challenge.findMany({
    where:
      attemptedChallengeIds.size > 0
        ? {
            id: {
              notIn: [...attemptedChallengeIds],
            },
          }
        : undefined,
    orderBy: [
      {
        recommendedElo: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 5,
  });
  const profile = buildProfileViewModel({
    user,
    attempts,
    recommendations,
  });

  return <ProfileShell profile={profile} />;
}
