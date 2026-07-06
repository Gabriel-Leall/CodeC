import Link from "next/link";
import { ArrowRight, Crosshair, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { eloToDanRank } from "@/lib/rating";
import {
  type Challenge,
  getChallengeTags,
  getDifficultyColor,
  getDifficultyLabel,
  getLevelCompatibility,
  getStatusPresentation,
} from "./ema-challenge-card-helpers";

export function ChallengesFocusPanel({
  challenge,
  userElo,
}: {
  challenge: Challenge;
  userElo: number;
}) {
  const recommendedRank = eloToDanRank(challenge.recommendedElo);
  const userRank = eloToDanRank(userElo);
  const statusPresentation = getStatusPresentation(challenge.attempts);
  const compatibility = getLevelCompatibility(challenge.recommendedElo, userElo);
  const tags = getChallengeTags(challenge.tags);

  return (
    <aside className="xl:sticky xl:top-24">
      <div className="zen-paper relative overflow-hidden border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] p-5 dark:border-border/80 dark:bg-card/90">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:color-mix(in_oklch,var(--zen-hanko)_32%,transparent)]" />
        <div className="pointer-events-none absolute right-5 top-5 size-16 rounded-full border border-[color:var(--zen-border)]/45 opacity-45 dark:border-border/35" />

        <div className="relative space-y-5">
          <header className="space-y-3 border-b border-[color:var(--zen-border)] pb-4 dark:border-border/55">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
                  Desafio em foco
                </p>
                <h3 className="text-xl font-serif font-bold leading-tight text-[color:var(--zen-ink)] dark:text-foreground">
                  {challenge.title}
                </h3>
              </div>

              <span
                className={`inline-flex shrink-0 border px-2 py-1 text-[9px] font-mono uppercase tracking-[0.18em] ${statusPresentation.badgeClassName}`}
              >
                {statusPresentation.label}
              </span>
            </div>

            <p className="text-xs/relaxed font-mono text-[color:var(--zen-muted)] dark:text-muted-foreground">
              {statusPresentation.note}. Este nó conversa com o seu rank atual e ajuda a orientar
              qual leitura vale atacar agora.
            </p>
          </header>

          <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
            <FocusMetric
              label="Dificuldade"
              value={getDifficultyLabel(challenge.difficulty)}
              note="Tom da trilha"
              badgeClassName={getDifficultyColor(challenge.difficulty)}
            />
            <FocusMetric
              label="ELO recomendado"
              value={`${challenge.recommendedElo}`}
              note={`${recommendedRank.kanji} · ${recommendedRank.kyuDan}`}
            />
            <FocusMetric
              label="Seu momento"
              value={userRank.kanji}
              note={`${userElo} ELO · ${userRank.description}`}
            />
          </div>

          <div className="grid gap-3 border-y border-[color:var(--zen-border)] py-4 dark:border-border/55">
            <InsightRow
              icon={<Crosshair className="size-3.5" />}
              label="Compatibilidade"
              value={
                compatibility ? compatibility.label : "Pede fôlego extra"
              }
              note={
                compatibility
                  ? "Bom ponto de ataque para evoluir sem quebrar o ritmo."
                  : "Está um passo acima do seu ELO atual, útil para treinos de expansão."
              }
            />
            <InsightRow
              icon={<Sparkles className="size-3.5" />}
              label="Histórico"
              value={challenge.attempts.length > 0 ? `${challenge.attempts.length} registro(s)` : "Ainda intacto"}
              note={
                challenge.attempts.length > 0
                  ? "A trilha já viu esse exercício, então vale comparar leitura e precisão."
                  : "Bom momento para um primeiro diagnóstico a frio."
              }
            />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
              Marcadores do problema
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_4%,transparent)] px-2 py-1 text-[9px] font-mono uppercase tracking-[0.16em] text-[color:var(--zen-muted)] dark:border-border/40 dark:bg-secondary/30 dark:text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[color:var(--zen-border)] pt-4 dark:border-border/55">
            <Link
              href={`/train/${challenge.id}`}
              className="inline-flex h-10 w-full items-center justify-center gap-2 border border-[color:var(--zen-hanko)] bg-[color:var(--zen-hanko)] px-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white transition-all hover:bg-[color:color-mix(in_oklch,var(--zen-hanko)_86%,black)] dark:border-primary/20 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              Abrir arena
              <ArrowRight className="size-3.5" />
            </Link>

            <p className="mt-3 text-[10px] font-mono leading-relaxed text-[color:var(--zen-muted)] dark:text-muted-foreground">
              Passe pela árvore para trocar o foco sem perder a trilha, depois entre na arena
              quando o diagnóstico fizer sentido.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function FocusMetric({
  label,
  value,
  note,
  badgeClassName,
}: {
  label: string;
  value: string;
  note: string;
  badgeClassName?: string;
}) {
  return (
    <div className="border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_2%,transparent)] p-3 dark:border-border/70 dark:bg-background/20">
      <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-[color:var(--zen-ink)] dark:text-foreground">
          {value}
        </span>
        {badgeClassName ? (
          <span className={`inline-flex border px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-[0.16em] ${badgeClassName}`}>
            faixa
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-[10px] font-mono leading-relaxed text-[color:var(--zen-muted)] dark:text-muted-foreground">
        {note}
      </div>
    </div>
  );
}

function InsightRow({
  icon,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-[color:var(--zen-border)] text-[color:var(--zen-muted)] dark:border-border/60 dark:text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
          {label}
        </div>
        <div className="text-sm font-semibold text-[color:var(--zen-ink)] dark:text-foreground">
          {value}
        </div>
        <p className="text-[10px] font-mono leading-relaxed text-[color:var(--zen-muted)] dark:text-muted-foreground">
          {note}
        </p>
      </div>
    </div>
  );
}
