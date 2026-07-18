import type { Metadata } from "next";

import { readChallengesFromContent } from "@kodan/db/challenge-content";

import { getCurrentUser } from "@/server/api/service";
import DashboardHome from "./dashboard-home";

export const metadata: Metadata = {
  title: "Dojo | Kodan",
  description: "Visão geral da sua evolução e do próximo desafio no Kodan.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [challenges, userResult] = await Promise.all([
    readChallengesFromContent(),
    getCurrentUser(),
  ]);
  const featuredChallenge =
    challenges.find((challenge) => challenge.id === "react-hooks-stale-closure-useeffect") ??
    challenges[0];

  if (!featuredChallenge) {
    throw new Error("Nenhum desafio disponível em content/challenges.");
  }

  const user = userResult.success && userResult.data
    ? userResult.data
    : { name: "Kodan", image: null, elo: 1200 };

  return (
    <DashboardHome
      challenge={featuredChallenge}
      challengeCount={challenges.length}
      userName={user.name}
      userImage={user.image}
      userElo={user.elo}
    />
  );
}
