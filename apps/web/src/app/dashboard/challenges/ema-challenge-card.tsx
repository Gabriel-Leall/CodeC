import Link from "next/link";
import { Play } from "lucide-react";

import { eloToDanRank } from "@/lib/rating";
import {
  type Challenge,
  getChallengeTags,
  getDifficultyColor,
  getDifficultyLabel,
  getLevelCompatibility,
  getStatusLabel,
  getStatusPresentation,
} from "./ema-challenge-card-helpers";

interface EmaChallengeCardProps {
  challenge: Challenge;
  matched: boolean;
  isActive: boolean;
  nodeNumber: number;
  setFocusedCardId: (id: string | null) => void;
  userElo: number;
}

export function EmaChallengeCard({
  challenge,
  matched,
  isActive,
  nodeNumber,
  setFocusedCardId,
  userElo,
}: EmaChallengeCardProps) {
  const compatibility = getLevelCompatibility(challenge.recommendedElo, userElo);
  const hasAttempt = challenge.attempts.length > 0;
  const nodeDanRank = eloToDanRank(challenge.recommendedElo);
  const statusPresentation = getStatusPresentation(challenge.attempts);
  const tagList = getChallengeTags(challenge.tags);
  const visibleTags = tagList.slice(0, 4);

  return (
    <article
      aria-hidden={!matched}
      className={`challenge-card relative flex w-full max-w-[18rem] min-w-0 flex-col border-2 border-[color:var(--zen-border)] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--zen-ink)_2%,transparent),transparent_28%)] bg-[color:var(--zen-washi)] p-4 pb-3.5 pt-5 text-[color:var(--zen-ink)] transition-all duration-500 ease-in-out dark:border-border/80 dark:bg-card/95 md:w-[288px] md:max-w-[288px] ${
        matched
          ? isActive
            ? "scale-[1.02] border-[color:var(--zen-moss)] shadow-[0_18px_34px_color-mix(in_oklch,var(--zen-ink)_10%,transparent)] dark:border-primary/50 dark:shadow-[0_0_18px_rgba(76,124,99,0.12)]"
            : "opacity-100 filter-none hover:scale-[1.01] hover:border-[color:var(--zen-moss)] hover:shadow-[0_12px_24px_color-mix(in_oklch,var(--zen-ink)_8%,transparent)] dark:hover:border-primary/40"
          : "pointer-events-none select-none opacity-20 blur-[1.5px]"
      }`}
      onMouseEnter={() => setFocusedCardId(challenge.id)}
      onFocusCapture={() => setFocusedCardId(challenge.id)}
    >
      <div className="pointer-events-none absolute -top-3 left-1/2 flex -translate-x-1/2 flex-col items-center">
        <div
          className={`h-3 w-0.5 transition-colors duration-500 ${
            matched
              ? "bg-[color:var(--zen-border)] dark:bg-border/60"
              : "bg-[color:var(--zen-border)]/40 dark:bg-border/20"
          }`}
        />
        <div className="size-1.5 rounded-full border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] dark:border-border/80 dark:bg-background" />
      </div>

      <div className="absolute inset-x-4 top-4 h-px bg-[color:color-mix(in_oklch,var(--zen-border)_78%,transparent)] dark:bg-border/45" />

      <div className="relative flex items-start justify-between gap-3 border-b border-[color:var(--zen-border)] pb-3 dark:border-border/40">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_3%,transparent)] px-2 py-1 text-[9px] font-mono uppercase tracking-[0.22em] text-[color:var(--zen-muted)] dark:border-border/60 dark:text-muted-foreground">
              No {String(nodeNumber).padStart(2, "0")}
            </span>
            <span
              className={`inline-flex border px-2 py-1 text-[9px] font-mono uppercase tracking-[0.18em] ${statusPresentation.badgeClassName}`}
            >
              {statusPresentation.label}
            </span>
          </div>

          <Link
            href={`/train/${challenge.id}`}
            tabIndex={matched ? undefined : -1}
            className="block min-w-0 text-left text-[0.96rem] font-serif font-bold leading-snug text-[color:var(--zen-ink)] transition-colors hover:text-[color:var(--zen-hanko)] hover:underline dark:text-foreground dark:hover:text-primary"
          >
            <span className="line-clamp-3 block">{challenge.title}</span>
          </Link>
        </div>

        <div className="hidden shrink-0 border border-[color:var(--zen-border)] px-2 py-1 text-[9px] font-mono uppercase tracking-[0.18em] text-[color:var(--zen-muted)] dark:border-border/60 dark:text-muted-foreground md:block">
          {nodeDanRank.kyuDan}
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col space-y-3">
        <ChallengeDetails
          challenge={challenge}
          compatibility={compatibility}
          hasAttempt={hasAttempt}
          statusPresentation={statusPresentation}
          nodeDanRank={nodeDanRank.kanji}
          visibleTags={visibleTags}
        />

        <div className="mt-auto flex items-center justify-between border-t border-[color:var(--zen-border)] pt-3 dark:border-border/40">
          <span
            className={`border px-2 py-1 text-[8px] font-mono font-bold uppercase tracking-[0.18em] ${getDifficultyColor(
              challenge.difficulty,
            )}`}
          >
            {getDifficultyLabel(challenge.difficulty)}
          </span>

          <Link
            href={`/train/${challenge.id}`}
            tabIndex={matched ? undefined : -1}
            className="inline-flex h-9 items-center gap-1 border border-[color:var(--zen-hanko)] bg-[color:var(--zen-hanko)] px-3 text-[10px] font-mono uppercase tracking-[0.18em] text-white transition-all active:translate-y-0.5 hover:bg-[color:color-mix(in_oklch,var(--zen-hanko)_86%,black)] dark:border-primary/20 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            <Play className="size-3 fill-current" />
            Treinar
          </Link>
        </div>
      </div>
    </article>
  );
}

function ChallengeDetails({
  challenge,
  compatibility,
  hasAttempt,
  statusPresentation,
  nodeDanRank,
  visibleTags,
}: {
  challenge: Challenge;
  compatibility: ReturnType<typeof getLevelCompatibility>;
  hasAttempt: boolean;
  statusPresentation: ReturnType<typeof getStatusPresentation>;
  nodeDanRank: string;
  visibleTags: string[];
}) {
  const statusLabel = getStatusLabel(challenge.attempts);

  return (
    <>
      <div className="grid gap-2 text-[10px] font-mono text-[color:var(--zen-ink)] dark:text-foreground">
        <div className="grid gap-2 border-b border-[color:var(--zen-border)] pb-3 dark:border-border/35">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Status:</span>
            <span className="text-right font-bold">{statusLabel}</span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
            {statusPresentation.note}
          </p>
        </div>

        <div className="grid gap-1.5 md:grid-cols-2">
          <div className="flex items-center justify-between gap-3 md:block">
            <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">ELO:</span>
            <span className="text-right font-bold md:mt-1 md:block">
              {challenge.recommendedElo} ({nodeDanRank})
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 md:block">
            <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Tentativas:</span>
            <span className="text-right font-bold md:mt-1 md:block">
              {hasAttempt ? "1+" : "0"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Nível:</span>
          {compatibility ? (
            <span className={compatibility.className}>{compatibility.label}</span>
          ) : (
            <span className="text-right text-[color:var(--zen-muted)] dark:text-muted-foreground">
              Na borda do seu nível
            </span>
          )}
        </div>

        {visibleTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 border-t border-[color:var(--zen-border)] pt-2 dark:border-border/35">
            {visibleTags.map(tag => (
              <span
                key={tag}
                className="border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_4%,transparent)] px-1.5 py-1 text-[9px] uppercase tracking-[0.16em] text-[color:var(--zen-muted)] dark:border-border/40 dark:bg-secondary/30 dark:text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
