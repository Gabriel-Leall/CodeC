import Link from "next/link";
import { ArrowRight, Crosshair, History, Layers3 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@kodan/ui/components/button";
import { cn } from "@kodan/ui/lib/utils";
import { eloToDanRank } from "@/lib/rating";
import {
  getChallengeTopicDescription,
  getChallengeTopicKey,
  getChallengeTopicLabel,
} from "./challenges-taxonomy";
import {
  type Challenge,
  getChallengeProgress,
  getChallengeTags,
  getDifficultyColor,
  getDifficultyLabel,
  getLevelCompatibility,
  getStatusPresentation,
} from "./ema-challenge-card-helpers";

export function ChallengesFocusPanel({
  challenge,
  userElo,
  activePosition,
  totalVisible,
  previousChallengeTitle,
  nextChallengeTitle,
  onSelectPrevious,
  onSelectNext,
}: {
  challenge: Challenge;
  userElo: number;
  activePosition: number;
  totalVisible: number;
  previousChallengeTitle: string | null;
  nextChallengeTitle: string | null;
  onSelectPrevious: (() => void) | null;
  onSelectNext: (() => void) | null;
}) {
  const topicKey = getChallengeTopicKey(challenge);
  const topicLabel = getChallengeTopicLabel(topicKey);
  const recommendedRank = eloToDanRank(challenge.recommendedElo);
  const userRank = eloToDanRank(userElo);
  const statusPresentation = getStatusPresentation(challenge.attempts);
  const progress = getChallengeProgress(challenge.attempts);
  const compatibility = getLevelCompatibility(
    challenge.recommendedElo,
    userElo,
  );
  const tags = getChallengeTags(challenge.tags);

  return (
    <aside className="xl:sticky xl:top-24">
      <div className="rounded-[24px] border border-slate-200 bg-white/95 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950/95">
        <div className="space-y-5">
          <header className="space-y-3 border-b border-slate-200 pb-4 dark:border-slate-800">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Item ativo
            </p>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>React</span>
                  <span>/</span>
                  <span>{topicLabel}</span>
                </div>
                <h3 className="text-xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
                  {challenge.title}
                </h3>
              </div>

              <span
                className={cn(
                  "inline-flex rounded-full border px-2 py-1 text-[10px] font-medium",
                  statusPresentation.badgeClassName,
                )}
              >
                {statusPresentation.label}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              {getChallengeTopicDescription(topicKey)}
            </p>
          </header>

          <div className="grid gap-3">
            <StatCard
              label="Posição"
              value={`${activePosition}/${totalVisible}`}
              note="ordem da lista visível"
              icon={<Layers3 className="size-4" />}
            />
            <StatCard
              label="Dificuldade"
              value={getDifficultyLabel(challenge.difficulty)}
              note={`${challenge.recommendedElo} ELO recomendado`}
              icon={<Crosshair className="size-4" />}
              badgeClassName={getDifficultyColor(challenge.difficulty)}
            />
            <StatCard
              label="Seu momento"
              value={userRank.kyuDan}
              note={`${userElo} ELO · ${userRank.description}`}
              icon={<History className="size-4" />}
            />
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-slate-50/75 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Progresso
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {progress.label}
                </p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {progress.percent}%
              </p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300",
                  progress.barClassName,
                )}
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {recommendedRank.kanji} · {recommendedRank.kyuDan}
              </span>
              {compatibility ? (
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2 py-1 text-[10px] font-medium",
                    compatibility.className,
                  )}
                >
                  {compatibility.label}
                </span>
              ) : (
                <span>Pede um salto acima do seu ELO atual.</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="grid gap-2">
              <NavigationButton
                directionLabel="Anterior"
                challengeTitle={previousChallengeTitle}
                onClick={onSelectPrevious}
              />
              <NavigationButton
                directionLabel="Próximo"
                challengeTitle={nextChallengeTitle}
                onClick={onSelectNext}
              />
            </div>

            <Link
              href={`/train/${challenge.id}`}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Abrir arena
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function StatCard({
  label,
  value,
  note,
  icon,
  badgeClassName,
}: {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  badgeClassName?: string;
}) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-50">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {note}
          </p>
        </div>
        <div className="mt-0.5 text-slate-400 dark:text-slate-500">{icon}</div>
      </div>

      {badgeClassName ? (
        <span
          className={cn(
            "mt-3 inline-flex rounded-full border px-2 py-1 text-[10px] font-medium",
            badgeClassName,
          )}
        >
          faixa
        </span>
      ) : null}
    </div>
  );
}

function NavigationButton({
  directionLabel,
  challengeTitle,
  onClick,
}: {
  directionLabel: string;
  challengeTitle: string | null;
  onClick: (() => void) | null;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={!onClick}
      className="h-auto min-h-14 items-start justify-start rounded-xl border-slate-200 bg-white px-4 py-3 text-left hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
      onClick={onClick ?? undefined}
    >
      <span className="flex flex-col items-start gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
          {directionLabel}
        </span>
        <span className="line-clamp-2 text-sm leading-6 text-slate-900 dark:text-slate-100">
          {challengeTitle ?? "Fim desta direção"}
        </span>
      </span>
    </Button>
  );
}
