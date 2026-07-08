import { ProfileAchievementsCard } from "./profile-achievements-card";
import { ProfileEloChartCard } from "./profile-elo-chart-card";
import { ProfileHero } from "./profile-hero";
import { ProfileRecommendationsCard } from "./profile-recommendations-card";
import { ProfileRecentSessionsCard } from "./profile-recent-sessions-card";
import { ProfileStatsRow } from "./profile-stats-row";
import { ProfileTopicMasteryCard } from "./profile-topic-mastery-card";
import type { ProfileViewModel } from "./profile-types";

export function ProfileContent({ profile }: { profile: ProfileViewModel }) {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5">
      <ProfileHero user={profile.user} />
      <ProfileStatsRow stats={profile.stats} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <ProfileEloChartCard points={profile.eloSeries} />
        <ProfileTopicMasteryCard topics={profile.topicMastery} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ProfileRecentSessionsCard sessions={profile.recentSessions} />
        <ProfileRecommendationsCard recommendations={profile.recommendations} />
      </div>

      <ProfileAchievementsCard achievements={profile.achievements} />
    </div>
  );
}
