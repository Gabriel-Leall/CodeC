import { cn } from "@kodan/ui/lib/utils";
import type { ReactNode } from "react";
import { ZenPaper } from "../layout/ZenPaper";
import { DanProgress } from "../progression/DanProgress";
import { ZenAchievementSeal } from "../progression/ZenAchievementSeal";
import { ZenRankBadge } from "../progression/ZenRankBadge";
import type { ZenRank } from "../zen-types";
import { ZenAvatar } from "./ZenAvatar";

type ZenProfileCardProps = {
  name: ReactNode;
  subtitle?: ReactNode;
  rank: ZenRank;
  xp: number;
  achievement?: ReactNode;
  className?: string;
};

export function ZenProfileCard({ name, subtitle, rank, xp, achievement = "Ritual em andamento", className }: ZenProfileCardProps) {
  return (
    <ZenPaper className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <ZenAvatar fallback={typeof name === "string" ? name.slice(0, 1).toUpperCase() : "道"} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{name}</div>
          {subtitle ? <div className="text-xs text-[color:var(--zen-muted)]">{subtitle}</div> : null}
        </div>
      </div>
      <ZenRankBadge rank={rank} />
      <DanProgress value={xp} label="Ascensão" />
      <ZenAchievementSeal title={achievement} description="Marca de progresso atual." />
    </ZenPaper>
  );
}
