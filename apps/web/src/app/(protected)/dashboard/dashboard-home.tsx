"use client";

import type { ChallengeContentEntry } from "@kodan/db/challenge-content";

import { DashboardHomeHeader } from "./dashboard-home/dashboard-home-header";
import { DashboardNavigation } from "./dashboard-home/dashboard-navigation";
import { DojoInitiationCard } from "./dashboard-home/dojo-initiation-card";
import { RecommendedChallengeCard } from "./dashboard-home/recommended-challenge-card";
import { useDashboardThemeAssets } from "./dashboard-home/use-dashboard-theme-assets";

type DashboardHomeProps = {
  challenge: ChallengeContentEntry;
  challengeCount: number;
  userName: string;
  userImage: string | null;
  userElo: number;
  userStreak: number;
};

export default function DashboardHome({ challenge, challengeCount, userName, userImage, userElo, userStreak }: DashboardHomeProps) {
  const themeAssets = useDashboardThemeAssets();

  return (
    <div data-dashboard-home="true" className="min-h-full bg-[var(--dojo-page)] font-mono text-[var(--dojo-ink)]">
      <DashboardHomeHeader
        userName={userName}
        userImage={userImage}
        userElo={userElo}
        userStreak={userStreak}
      />
      <div className="grid gap-5 p-5 sm:p-8 2xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.75fr)]">
        <section className="space-y-5">
          <RecommendedChallengeCard challenge={challenge} />
          <DojoInitiationCard icon={themeAssets.initiation} />
        </section>
        <DashboardNavigation challengeCount={challengeCount} icons={themeAssets} />
      </div>
    </div>
  );
}
