import type { ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

export type AchievementBadgeTone = "blue" | "green" | "orange" | "indigo";

const TONE_CLASS_NAMES: Record<AchievementBadgeTone, string> = {
  blue: "border-[var(--profile-accent-blue)] text-[var(--profile-accent-blue)]",
  green: "border-[var(--profile-success)] text-[var(--profile-success)]",
  orange: "border-[var(--profile-warning)] text-[var(--profile-warning)]",
  indigo: "border-indigo-500 text-indigo-500",
};

export function AchievementBadge({
  tone,
  className,
  children,
}: {
  tone: AchievementBadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-[8px] border bg-[var(--profile-surface-elevated)]",
        TONE_CLASS_NAMES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
