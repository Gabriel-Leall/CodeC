import Link from "next/link";
import { Play } from "lucide-react";

import { eloToDanRank } from "@/lib/rating";
import {
  type Challenge,
  getDifficultyColor,
  getDifficultyLabel,
  getLevelCompatibility,
  getStatusLabel,
} from "./ema-challenge-card-helpers";

interface EmaChallengeCardProps {
  challenge: Challenge;
  matched: boolean;
  isActive: boolean;
  setActiveCardId: (id: string | null) => void;
  userElo: number;
}

export function EmaChallengeCard({
  challenge,
  matched,
  isActive,
  setActiveCardId,
  userElo,
}: EmaChallengeCardProps) {
  const compatibility = getLevelCompatibility(challenge.recommendedElo, userElo);
  const hasAttempt = challenge.attempts.length > 0;
  const nodeDanRank = eloToDanRank(challenge.recommendedElo);
  const tagList = challenge.tags.split(",").flatMap(tag => {
    const normalizedTag = tag.trim();
    return normalizedTag ? [normalizedTag] : [];
  });

  return (
    <article
      aria-hidden={!matched}
      className={`challenge-card relative flex w-full max-w-[18rem] min-w-0 flex-col justify-between border-2 border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] p-4 pb-3.5 pt-5 text-[color:var(--zen-ink)] transition-all duration-500 ease-in-out hover:scale-[1.02] hover:border-[color:var(--zen-moss)] hover:shadow-none dark:border-border/80 dark:bg-card/95 dark:hover:border-primary/50 dark:hover:shadow-[0_0_15px_rgba(76,124,99,0.08)] md:w-[260px] md:max-w-[260px] ${
        matched
          ? "opacity-100 filter-none"
          : "pointer-events-none select-none opacity-20 blur-[1.5px]"
      }`}
      onMouseEnter={() => setActiveCardId(challenge.id)}
      onMouseLeave={() => setActiveCardId(null)}
      onFocusCapture={() => setActiveCardId(challenge.id)}
      onBlurCapture={event => {
        const relatedTarget = event.relatedTarget;
        if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) {
          setActiveCardId(null);
        }
      }}
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

      <Link
        href={`/train/${challenge.id}`}
        tabIndex={matched ? undefined : -1}
        className="min-h-[32px] min-w-0 text-center text-xs font-serif font-bold text-[color:var(--zen-ink)] transition-colors hover:text-[color:var(--zen-hanko)] hover:underline dark:text-foreground dark:hover:text-primary"
      >
        <span className="line-clamp-2 block">{challenge.title}</span>
      </Link>

      <div className="mt-3 space-y-3">
        <ChallengeDetails
          challenge={challenge}
          compatibility={compatibility}
          hasAttempt={hasAttempt}
          isActive={isActive}
          nodeDanRank={nodeDanRank.kanji}
          tagList={tagList}
        />

        <div className="flex items-center justify-between border-t border-[color:var(--zen-border)] pt-2.5 dark:border-border/40">
          <span
            className={`border px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase ${getDifficultyColor(
              challenge.difficulty,
            )}`}
          >
            {getDifficultyLabel(challenge.difficulty)}
          </span>

          <Link
            href={`/train/${challenge.id}`}
            tabIndex={matched ? undefined : -1}
            className="inline-flex h-8 items-center gap-1 border border-[color:var(--zen-hanko)] bg-[color:var(--zen-hanko)] px-2.5 text-[10px] font-mono uppercase text-white transition-all active:translate-y-0.5 hover:bg-[color:color-mix(in_oklch,var(--zen-hanko)_86%,black)] dark:border-primary/20 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
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
  isActive,
  nodeDanRank,
  tagList,
}: {
  challenge: Challenge;
  compatibility: ReturnType<typeof getLevelCompatibility>;
  hasAttempt: boolean;
  isActive: boolean;
  nodeDanRank: string;
  tagList: string[];
}) {
  const statusLabel = getStatusLabel(challenge.attempts);

  return (
    <>
      <div className="grid gap-1.5 border-t border-[color:var(--zen-border)] pt-2 text-[10px] font-mono text-[color:var(--zen-ink)] dark:border-border/40 dark:text-foreground md:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">ELO:</span>
          <span className="text-right font-bold">
            {challenge.recommendedElo} ({nodeDanRank})
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Status:</span>
          <span className="text-right font-bold">{statusLabel}</span>
        </div>
        {compatibility ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Nível:</span>
            <span className={compatibility.className}>{compatibility.label}</span>
          </div>
        ) : null}
        {tagList.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {tagList.map(tag => (
              <span
                key={tag}
                className="border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_5%,transparent)] px-1.5 py-0.5 text-[9px] uppercase text-[color:var(--zen-muted)] dark:border-border/40 dark:bg-secondary/60 dark:text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div
        className={`absolute bottom-full left-1/2 mb-4 hidden w-72 -translate-x-1/2 flex-col gap-2 border-2 border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] p-3.5 shadow-none transition-all duration-300 dark:border-border/90 dark:bg-card dark:shadow-[3px_3px_0px_rgba(0,0,0,0.08)] md:flex ${
          isActive
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible translate-y-2 scale-95 opacity-0"
        }`}
        role="note"
        aria-hidden={!isActive}
      >
        <div className="border-b border-[color:var(--zen-border)] pb-1 text-[9px] font-mono uppercase tracking-widest text-[color:var(--zen-muted)] dark:border-border/40 dark:text-muted-foreground">
          Detalhes do Desafio
        </div>

        <div className="space-y-1.5 text-[10px] font-mono text-[color:var(--zen-ink)] dark:text-foreground">
          <div className="flex justify-between gap-3">
            <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Recomendado:</span>
            <span className="text-right font-bold">
              ELO {challenge.recommendedElo} ({nodeDanRank})
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Status atual:</span>
            <span className="text-right font-bold">{statusLabel}</span>
          </div>
          {compatibility ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[color:var(--zen-muted)] dark:text-muted-foreground">Nível:</span>
              <span className={compatibility.className}>{compatibility.label}</span>
            </div>
          ) : null}
          {!hasAttempt ? (
            <div className="pt-1 text-[9px] text-[color:var(--zen-muted)] dark:text-muted-foreground">
              Sem tentativas ainda.
            </div>
          ) : null}
        </div>

        {tagList.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-1 border-t border-[color:var(--zen-border)] pt-2 dark:border-border/40">
            {tagList.map(tag => (
              <span
                key={tag}
                className="border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_5%,transparent)] px-1.5 py-0.5 text-[9px] font-mono uppercase text-[color:var(--zen-muted)] dark:border-border/40 dark:bg-secondary/60 dark:text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="absolute left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[color:var(--zen-border)] dark:border-t-border" />
      </div>
    </>
  );
}
