import { ArrowRight, Check, Star, Zap } from "lucide-react";
import Link from "next/link";

import { AchievementBadge, SectionCard } from "@kodan/ui/components/profile";
import type { AchievementItem } from "./profile-types";

export function ProfileAchievementsCard({
  achievements,
}: {
  achievements: AchievementItem[];
}) {
  return (
    <SectionCard
      title="Conquistas recentes"
      footer={
        <Link
          href="/challenges"
          className="profile-focusable inline-flex items-center gap-2 rounded-[4px] text-sm font-medium text-[var(--profile-accent-blue)]"
        >
          Explorar desafios
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      }
    >
      {achievements.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-4">
          {achievements.slice(0, 4).map((achievement) => (
            <AchievementRow key={achievement.id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <p className="rounded-[8px] border border-dashed border-[color:var(--profile-border)] px-4 py-5 text-sm text-[var(--profile-text-secondary)]">
          Nenhuma conquista recente desbloqueada.
        </p>
      )}
    </SectionCard>
  );
}

function AchievementRow({ achievement }: { achievement: AchievementItem }) {
  return (
    <article className="flex min-w-0 items-start gap-4">
      <AchievementBadge tone={achievement.tone}>{getAchievementIcon(achievement)}</AchievementBadge>
      <div className="min-w-0">
        <h3 className="font-serif text-sm font-semibold text-[var(--profile-text-primary)]">
          {achievement.title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-[var(--profile-text-secondary)]">
          {achievement.description}
        </p>
        <p className="mt-0.5 text-xs text-[var(--profile-text-muted)]">
          {achievement.unlockedAtLabel}
        </p>
      </div>
    </article>
  );
}

function getAchievementIcon(achievement: AchievementItem) {
  if (achievement.tone === "green") {
    return <Check className="size-5" aria-hidden="true" />;
  }

  if (achievement.tone === "orange") {
    return <Zap className="size-5" aria-hidden="true" />;
  }

  return <Star className="size-5" aria-hidden="true" />;
}
