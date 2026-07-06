import type { ReactNode } from "react";
import { Filter, Search, X } from "lucide-react";

import { Button } from "@kodan/ui/components/button";
import { HankoStamp } from "@kodan/ui/components/hanko-stamp";
import { Input } from "@kodan/ui/components/input";
import { ZenEmptyState, ZenLoading, ZenSkeleton } from "@kodan/ui/components/zen";
import { eloToDanRank } from "@/lib/rating";
import { type DifficultyFilter } from "./challenges-list-state";
import { getDifficultyLabel } from "./ema-challenge-card-helpers";

function ChallengesHeader() {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
        Mapa de treino
      </p>
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold leading-none tracking-tight text-[color:var(--zen-ink)] dark:text-foreground lg:text-[2.35rem]">
          Jardim dos Desafios
        </h1>
        <p className="max-w-none text-xs/relaxed font-mono text-[color:var(--zen-muted)] dark:text-muted-foreground">
          Explore o repositório de exercícios de diagnóstico e leitura de código. Siga a trilha e
          aprimore sua visão sem perder o contexto do seu progresso.
        </p>
      </div>
    </div>
  );
}

export function ChallengesSidebar({
  totalChallengesCount,
  visibleChallengesCount,
  filterDifficulty,
  searchQuery,
  userElo,
  onFilterChange,
  onSearchChange,
  onClearFilters,
}: {
  totalChallengesCount: number;
  visibleChallengesCount: number;
  filterDifficulty: DifficultyFilter;
  searchQuery: string;
  userElo: number;
  onFilterChange: (difficulty: DifficultyFilter) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}) {
  const activeViewLabel = getActiveViewLabel(filterDifficulty, searchQuery);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="zen-paper relative overflow-hidden border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] p-5 dark:border-border/80 dark:bg-card/90 lg:p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[color:color-mix(in_oklch,var(--zen-hanko)_32%,transparent)]" />
        <div className="pointer-events-none absolute right-6 top-6 size-16 rounded-full border border-[color:var(--zen-border)]/55 opacity-45 dark:border-border/50" />
        <div className="pointer-events-none absolute right-11 top-11 size-6 rounded-full border border-[color:var(--zen-border)]/45 opacity-35 dark:border-border/40" />

        <div className="relative space-y-6">
          <ChallengesHeader />

          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <SummaryMetric
              label="Carregados"
              value={String(totalChallengesCount)}
              note="Nós disponíveis"
            />
            <SummaryMetric
              label="Visíveis"
              value={String(visibleChallengesCount)}
              note="Após filtros"
            />
            <SummaryMetric label="Vista" value={activeViewLabel} note="Contexto atual" />
          </div>

          <div className="border-t border-[color:var(--zen-border)] pt-5 dark:border-border/60">
            <ChallengesFilters
              filterDifficulty={filterDifficulty}
              searchQuery={searchQuery}
              onFilterChange={onFilterChange}
              onSearchChange={onSearchChange}
              onClearFilters={onClearFilters}
            />
          </div>

          <div className="border-t border-[color:var(--zen-border)] pt-5 dark:border-border/60">
            <RankBadge userElo={userElo} variant="panel" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChallengesFilters({
  filterDifficulty,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onClearFilters,
}: {
  filterDifficulty: DifficultyFilter;
  searchQuery: string;
  onFilterChange: (difficulty: DifficultyFilter) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}) {
  const hasActiveSearch = searchQuery.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
          Buscar na trilha
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-[color:var(--zen-muted)] dark:text-muted-foreground/60" />
          <Input
            aria-label="Buscar desafios por título ou tag"
            placeholder="Título, tag, padrão..."
            className="h-10 border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] pl-10 pr-10 text-left text-xs font-mono text-[color:var(--zen-ink)] placeholder:text-[color:var(--zen-muted)] focus:border-[color:var(--zen-hanko)] focus:bg-[color:var(--zen-washi)] focus:ring-0 dark:border-border/80 dark:bg-card/45 dark:text-foreground dark:placeholder:text-muted-foreground dark:focus:border-primary/50 dark:focus:bg-card"
            value={searchQuery}
            onChange={event => onSearchChange(event.target.value)}
          />
          {hasActiveSearch ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Limpar busca"
              className="absolute right-2 top-2 size-6 border-transparent text-[color:var(--zen-muted)] hover:border-[color:var(--zen-border)] hover:bg-transparent hover:text-[color:var(--zen-ink)] dark:hover:text-foreground"
              onClick={() => onSearchChange("")}
            >
              <X className="size-3" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
          <Filter className="size-3" />
          <span>Dificuldade</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map(diff => (
            <button
              key={diff}
              type="button"
              onClick={() => onFilterChange(diff)}
              className={`relative inline-flex h-9 items-center justify-center overflow-hidden border px-3 text-[11px] font-mono uppercase tracking-[0.16em] transition-all duration-300 ${
                filterDifficulty === diff
                  ? "border-[color:var(--zen-hanko)] bg-[color:color-mix(in_oklch,var(--zen-hanko)_7%,transparent)] text-[color:var(--zen-hanko)] dark:border-primary/60 dark:text-primary"
                  : "border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] text-[color:var(--zen-muted)] hover:border-[color:var(--zen-ink)] hover:text-[color:var(--zen-ink)] dark:border-border/80 dark:bg-card/45 dark:text-muted-foreground dark:hover:border-foreground/40 dark:hover:text-foreground"
              }`}
            >
              {filterDifficulty === diff ? <HankoStamp /> : null}
              <span className="relative z-10">
                {diff === "ALL" ? "Todos" : getDifficultyLabel(diff)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {hasActiveSearch || filterDifficulty !== "ALL" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 w-full border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--zen-ink)] hover:bg-[color:color-mix(in_oklch,var(--zen-ink)_5%,transparent)] dark:border-border/80 dark:bg-card dark:text-foreground dark:hover:bg-secondary/50"
          onClick={onClearFilters}
        >
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
}

function RankBadge({
  userElo,
  variant = "default",
}: {
  userElo: number;
  variant?: "default" | "panel";
}) {
  const danRank = eloToDanRank(userElo);
  const panelVariant = variant === "panel";

  return (
    <div className={`flex flex-col ${panelVariant ? "items-stretch" : "items-center pt-2"}`}>
      <div
        className={`relative z-10 flex flex-col justify-center border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] p-4 font-serif shadow-none dark:border-border dark:bg-card/85 dark:shadow-[3px_3px_0px_rgba(0,0,0,0.06)] ${
          panelVariant ? "items-start text-left" : "w-64 items-center text-center"
        }`}
      >
        <span className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--zen-muted)] dark:text-muted-foreground">
          Rank de Diagnóstico
        </span>
        <div className="mt-1 font-serif text-2xl font-bold leading-none text-[color:var(--zen-ink)] dark:text-foreground">
          {danRank.kanji} <span className="text-sm font-normal">({danRank.kyuDan})</span>
        </div>
        <div className="mt-2.5">
          <span className="block text-[11px] font-medium italic text-[color:var(--zen-moss)] dark:text-primary">
            {danRank.description}
          </span>
          <span className="mt-0.5 block text-[10px] font-mono text-[color:var(--zen-muted)] dark:text-muted-foreground">
            {userElo} ELO
          </span>
        </div>

        <div
          className={`absolute flex size-3 items-center justify-center rounded-full border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] dark:border-border/80 dark:bg-background ${
            panelVariant
              ? "-bottom-1.5 left-6 -translate-x-1/2"
              : "-bottom-1.5 left-1/2 -translate-x-1/2"
          }`}
        >
          <div className="size-1 rounded-full bg-[color:var(--zen-hanko)] dark:bg-primary" />
        </div>
      </div>

      <div
        className={`bg-[color:var(--zen-border)] dark:bg-border/80 ${
          panelVariant ? "ml-[1.45rem] h-6 w-0.5" : "h-8 w-0.5"
        }`}
      />
    </div>
  );
}

export function ChallengesBoard({
  totalChallengesCount,
  visibleChallengesCount,
  filterDifficulty,
  searchQuery,
  children,
}: {
  totalChallengesCount: number;
  visibleChallengesCount: number;
  filterDifficulty: DifficultyFilter;
  searchQuery: string;
  children: ReactNode;
}) {
  const activeViewLabel = getActiveViewLabel(filterDifficulty, searchQuery);
  const searchLabel = searchQuery.trim() ? "Ativa" : "Nenhuma";

  return (
    <section className="zen-paper relative overflow-hidden border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] dark:border-border/80 dark:bg-card/85">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--zen-ink)_4%,transparent),transparent)]" />
      <div className="pointer-events-none absolute right-8 top-6 size-24 rounded-full border border-[color:var(--zen-border)]/40 opacity-50 dark:border-border/35" />
      <div className="pointer-events-none absolute right-14 top-12 size-10 rounded-full border border-[color:var(--zen-border)]/30 opacity-35 dark:border-border/25" />

      <div className="relative border-b border-[color:var(--zen-border)] px-5 py-5 dark:border-border/60 md:px-8 md:py-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
              Workspace da trilha
            </p>
            <h2 className="text-2xl font-serif font-bold leading-tight text-[color:var(--zen-ink)] dark:text-foreground md:text-[2rem]">
              Quadro de progresso e leitura
            </h2>
            <p className="text-xs/relaxed font-mono text-[color:var(--zen-muted)] dark:text-muted-foreground">
              A árvore principal continua no centro. O contexto de busca, dificuldade e progresso
              fica ao lado, para a navegação parecer uma mesa de estudo e não um bloco único.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:w-[23rem]">
            <BoardMetric label="Visíveis" value={String(visibleChallengesCount)} />
            <BoardMetric label="Carregados" value={String(totalChallengesCount)} />
            <BoardMetric label="Busca" value={searchLabel} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
          <span className="border border-[color:var(--zen-border)] px-2 py-1 dark:border-border/70">
            Ordem: ELO recomendado
          </span>
          <span className="border border-[color:var(--zen-border)] px-2 py-1 dark:border-border/70">
            Vista: {activeViewLabel}
          </span>
        </div>
      </div>

      <div className="relative min-h-[720px] px-2 py-6 md:px-6 md:py-8">{children}</div>
    </section>
  );
}

export function ChallengesStatePanel({
  title,
  description,
  action,
  animated = false,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  animated?: boolean;
}) {
  return (
    <div className={animated ? "animate-in fade-in duration-300" : ""}>
      <ZenEmptyState title={title}>{description}</ZenEmptyState>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ChallengesLoadingState() {
  return (
    <div className="zen-paper flex min-h-[420px] items-center justify-center border border-[color:var(--zen-border)] py-16">
      <ZenLoading label="Invocando a Trilha…" />
    </div>
  );
}

export function ChallengesRouteLoadingState() {
  return (
    <div className="mx-auto w-full max-w-[1380px] px-4 py-6 md:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="zen-paper border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] p-5 dark:border-border/80 dark:bg-card/90 lg:p-6">
          <div className="space-y-4">
            <ZenSkeleton className="h-4 w-28" />
            <ZenSkeleton className="h-10 w-5/6" />
            <ZenSkeleton className="h-3 w-full" />
            <ZenSkeleton className="h-3 w-4/5" />
            <div className="grid gap-2 pt-2">
              <ZenSkeleton className="h-16 w-full" />
              <ZenSkeleton className="h-16 w-full" />
              <ZenSkeleton className="h-16 w-full" />
            </div>
          </div>
        </div>

        <div className="zen-paper border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] p-5 dark:border-border/80 dark:bg-card/85 md:p-8">
          <div className="space-y-4">
            <ZenSkeleton className="h-4 w-36" />
            <ZenSkeleton className="h-10 w-1/2" />
            <ZenSkeleton className="h-3 w-3/4" />
            <div className="grid gap-3 pt-4 md:grid-cols-2">
              <ZenSkeleton className="h-32 w-full" />
              <ZenSkeleton className="h-32 w-full" />
              <ZenSkeleton className="h-32 w-full" />
              <ZenSkeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryMetric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_2%,transparent)] p-3 dark:border-border/70 dark:bg-background/20">
      <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 line-clamp-2 min-h-[2.3rem] text-base font-semibold text-[color:var(--zen-ink)] dark:text-foreground">
        {value}
      </div>
      <div className="mt-1 text-[10px] font-mono text-[color:var(--zen-muted)] dark:text-muted-foreground">
        {note}
      </div>
    </div>
  );
}

function BoardMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_2%,transparent)] px-3 py-2 dark:border-border/70 dark:bg-background/20">
      <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-[color:var(--zen-muted)] dark:text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-[color:var(--zen-ink)] dark:text-foreground">
        {value}
      </div>
    </div>
  );
}

function getActiveViewLabel(filterDifficulty: DifficultyFilter, searchQuery: string) {
  if (searchQuery.trim()) {
    return "Busca ativa";
  }

  if (filterDifficulty === "ALL") {
    return "Todos os níveis";
  }

  return getDifficultyLabel(filterDifficulty);
}
