"use client";

import { useEffect, useReducer, useState } from "react";
import {
  Search,
  Filter,
  Loader2,
} from "lucide-react";

import { Button } from "@CC/ui/components/button";
import { Input } from "@CC/ui/components/input";
import { HankoStamp } from "@CC/ui/components/hanko-stamp";
import {
  ZenEmptyState,
  ZenLoading,
  ZenToast,
} from "@CC/ui/components/zen";
import { getChallenges } from "../actions";
import { eloToDanRank } from "@/lib/rating";
import {
  EmaChallengeCard,
} from "./ema-challenge-card";
import { getDifficultyLabel, type Challenge } from "./ema-challenge-card-helpers";

const PAGE_SIZE = 15;

type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";

interface ChallengesState {
  challenges: Challenge[] | undefined;
  loadingMore: boolean;
  hasMore: boolean;
  userElo: number;
  filterDifficulty: DifficultyFilter;
  searchQuery: string;
}

type ChallengesAction =
  | {
      type: "initialLoaded";
      payload: { challenges: Challenge[]; hasMore: boolean; userElo: number };
    }
  | { type: "initialFailed" }
  | { type: "loadingMore"; payload: boolean }
  | { type: "appendLoaded"; payload: { challenges: Challenge[]; hasMore: boolean } }
  | { type: "setFilter"; payload: DifficultyFilter }
  | { type: "setSearch"; payload: string };

const initialState: ChallengesState = {
  challenges: undefined,
  loadingMore: false,
  hasMore: false,
  userElo: 1200,
  filterDifficulty: "ALL",
  searchQuery: "",
};

function challengesReducer(
  state: ChallengesState,
  action: ChallengesAction
): ChallengesState {
  switch (action.type) {
    case "initialLoaded":
      return {
        ...state,
        challenges: action.payload.challenges,
        hasMore: action.payload.hasMore,
        userElo: action.payload.userElo,
      };
    case "initialFailed":
      return {
        ...state,
        challenges: [],
      };
    case "loadingMore":
      return {
        ...state,
        loadingMore: action.payload,
      };
    case "appendLoaded":
      return {
        ...state,
        challenges: [...(state.challenges ?? []), ...action.payload.challenges],
        hasMore: action.payload.hasMore,
      };
    case "setFilter":
      return {
        ...state,
        filterDifficulty: action.payload,
      };
    case "setSearch":
      return {
        ...state,
        searchQuery: action.payload,
      };
    default:
      return state;
  }
}

function ChallengesHeader() {
  return (
    <div className="text-center space-y-3 pb-4">
      <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
        Jardim dos Desafios
      </h1>
      <p className="text-xs font-mono text-muted-foreground max-w-xl mx-auto">
        Explore o repositório de exercícios de diagnóstico e leitura de código. Siga a trilha e
        aprimore sua visão.
      </p>
    </div>
  );
}

function ChallengesFilters({
  filterDifficulty,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: {
  filterDifficulty: DifficultyFilter;
  searchQuery: string;
  onFilterChange: (difficulty: DifficultyFilter) => void;
  onSearchChange: (query: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 items-center border-y border-[color:var(--zen-border)] dark:border-border/60 py-5 max-w-2xl mx-auto w-full">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-2.5 size-4 text-[color:var(--zen-muted)] dark:text-muted-foreground/60" />
        <Input
          placeholder="Buscar por título ou tag (ex: useEffect, closures)…"
          className="pl-10 h-9 rounded-none border border-[color:var(--zen-border)] dark:border-border/80 bg-[color:var(--zen-washi)] dark:bg-card/45 focus:bg-[color:var(--zen-washi)] dark:focus:bg-card focus:ring-0 focus:border-[color:var(--zen-hanko)] dark:focus:border-primary/50 text-xs font-mono text-center text-[color:var(--zen-ink)] dark:text-foreground placeholder:text-[color:var(--zen-muted)] dark:placeholder:text-muted-foreground"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center w-full">
        <span className="text-[10px] text-[color:var(--zen-muted)] dark:text-muted-foreground/60 flex items-center gap-1 font-mono uppercase tracking-widest mr-2">
          <Filter className="size-3" /> Trilha:
        </span>
        {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map(diff => (
          <button
            key={diff}
            type="button"
            onClick={() => onFilterChange(diff)}
            className={`relative h-10 px-4 text-xs font-serif font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none flex items-center justify-center ${
              filterDifficulty === diff
                ? "text-[color:var(--zen-hanko)] dark:text-rose-400 scale-105"
                : "text-[color:var(--zen-muted)] dark:text-muted-foreground/80 hover:text-[color:var(--zen-ink)] dark:hover:text-foreground"
            }`}
          >
            {filterDifficulty === diff && <HankoStamp />}
            <span className="relative z-10">
              {diff === "ALL" ? "Todos" : getDifficultyLabel(diff)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RankBadge({ userElo }: { userElo: number }) {
  const danRank = eloToDanRank(userElo);

  return (
    <div className="flex flex-col items-center pt-2">
      <div className="relative font-serif border border-[color:var(--zen-border)] dark:border-border bg-[color:var(--zen-washi)] dark:bg-card/85 p-4 text-center flex flex-col justify-center items-center rounded-none shadow-none dark:shadow-[3px_3px_0px_rgba(0,0,0,0.06)] w-64 z-10">
        <span className="text-[9px] uppercase tracking-widest text-[color:var(--zen-muted)] dark:text-muted-foreground font-mono">
          Rank de Diagnóstico
        </span>
        <div className="text-2xl font-bold text-[color:var(--zen-ink)] dark:text-foreground mt-1 font-serif leading-none">
          {danRank.kanji} <span className="text-sm font-normal">({danRank.kyuDan})</span>
        </div>
        <div className="mt-2.5">
          <span className="text-[11px] font-sans italic text-[color:var(--zen-moss)] dark:text-primary font-medium block">
            {danRank.description}
          </span>
          <span className="text-[10px] font-mono text-[color:var(--zen-muted)] dark:text-muted-foreground block mt-0.5">
            {userElo} ELO
          </span>
        </div>

        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 rounded-full border border-[color:var(--zen-border)] dark:border-border/80 bg-[color:var(--zen-washi)] dark:bg-background flex items-center justify-center">
          <div className="size-1 rounded-full bg-[color:var(--zen-hanko)] dark:bg-primary" />
        </div>
      </div>

      <div className="w-0.5 h-8 bg-[color:var(--zen-border)] dark:bg-border/80" />
    </div>
  );
}

function ChallengesStatePanel({
  title,
  description,
  animated = false,
}: {
  title: string;
  description: string;
  animated?: boolean;
}) {
  return (
    <div className={animated ? "animate-in fade-in duration-300" : ""}>
      <ZenEmptyState title={title}>{description}</ZenEmptyState>
    </div>
  );
}

function ChallengesLoadingState() {
  return (
    <div className="zen-paper flex items-center justify-center border border-[color:var(--zen-border)] py-16">
      <ZenLoading label="Invocando a Trilha…" />
    </div>
  );
}

function PairChallengeRow({
  leftChallenge,
  rightChallenge,
  leftMatched,
  rightMatched,
  leftIsHovered,
  rightIsHovered,
  setHoveredId,
  userElo,
}: {
  leftChallenge: Challenge;
  rightChallenge: Challenge;
  leftMatched: boolean;
  rightMatched: boolean;
  leftIsHovered: boolean;
  rightIsHovered: boolean;
  setHoveredId: (id: string | null) => void;
  userElo: number;
}) {
  return (
    <div className="relative w-full min-h-[160px] md:h-[160px] flex flex-col md:block items-center justify-center py-4 md:py-0">
      <svg
        className="absolute inset-0 size-full hidden md:block pointer-events-none overflow-visible z-0"
        viewBox="0 0 768 160"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 384 0 C 300 10, 214 20, 214 50 C 214 100, 300 140, 384 160"
          className={`stroke-2 fill-none transition-all duration-500 ${
            leftMatched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1="214"
          y1="50"
          x2="214"
          y2="60"
          className={`stroke-2 transition-all duration-500 ${
            leftMatched ? "stroke-border/75" : "stroke-border/20"
          }`}
        />
        <path
          d="M 384 0 C 468 10, 554 20, 554 50 C 554 100, 468 140, 384 160"
          className={`stroke-2 fill-none transition-all duration-500 ${
            rightMatched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1="554"
          y1="50"
          x2="554"
          y2="60"
          className={`stroke-2 transition-all duration-500 ${
            rightMatched ? "stroke-border/75" : "stroke-border/20"
          }`}
        />
      </svg>

      <MobileVine />

      <div className="relative w-full max-w-3xl h-full flex flex-col md:block items-start md:items-center gap-6 md:gap-0 z-10 px-4 md:px-0">
        <CardPosition left>
          <EmaChallengeCard
            challenge={leftChallenge}
            matched={leftMatched}
            isHovered={leftIsHovered}
            setHoveredId={setHoveredId}
            userElo={userElo}
          />
        </CardPosition>

        <CardPosition left={false}>
          <EmaChallengeCard
            challenge={rightChallenge}
            matched={rightMatched}
            isHovered={rightIsHovered}
            setHoveredId={setHoveredId}
            userElo={userElo}
          />
        </CardPosition>
      </div>
    </div>
  );
}

function SingleChallengeRow({
  challenge,
  matched,
  isHovered,
  isLeft,
  setHoveredId,
  userElo,
}: {
  challenge: Challenge;
  matched: boolean;
  isHovered: boolean;
  isLeft: boolean;
  setHoveredId: (id: string | null) => void;
  userElo: number;
}) {
  return (
    <div className="relative w-full min-h-[160px] md:h-[160px] flex flex-col md:block items-center justify-center py-4 md:py-0">
      <svg
        className="absolute inset-0 size-full hidden md:block pointer-events-none overflow-visible z-0"
        viewBox="0 0 768 160"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M 384 0 C 390 40, 378 120, 384 160" className="stroke-border/80 fill-none stroke-2" />
        <path
          d={isLeft ? "M 384 40 C 300 40, 214 42, 214 50" : "M 384 40 C 468 40, 554 42, 554 50"}
          className={`stroke-2 fill-none transition-all duration-500 ${
            matched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1={isLeft ? "214" : "554"}
          y1="50"
          x2={isLeft ? "214" : "554"}
          y2="60"
          className={`stroke-2 transition-all duration-500 ${
            matched ? "stroke-border/75" : "stroke-border/20"
          }`}
        />
      </svg>

      <MobileVine />

      <div className="relative w-full max-w-3xl h-full flex flex-col md:block items-start md:items-center z-10 px-4 md:px-0">
        <CardPosition left={isLeft}>
          <EmaChallengeCard
            challenge={challenge}
            matched={matched}
            isHovered={isHovered}
            setHoveredId={setHoveredId}
            userElo={userElo}
          />
        </CardPosition>
      </div>
    </div>
  );
}

function MobileVine() {
  return (
    <div className="absolute left-6 top-0 bottom-0 w-8 -translate-x-1/2 pointer-events-none md:hidden z-0">
      <svg className="size-full overflow-visible" viewBox="0 0 32 100" preserveAspectRatio="none" fill="none">
        <line x1="16" y1="0" x2="16" y2="100" className="stroke-border/80 stroke-2" />
      </svg>
    </div>
  );
}

function CardPosition({
  children,
  left,
}: {
  children: React.ReactNode;
  left: boolean;
}) {
  return (
    <div
      className={`ml-12 md:ml-0 md:absolute md:top-1/2 md:-translate-y-1/2 ${
        left ? "md:left-[84px]" : "md:left-[424px]"
      }`}
    >
      <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-6 h-0.5 bg-border/40 md:hidden" />
      {children}
    </div>
  );
}

export default function ChallengesPage() {
  const [state, dispatch] = useReducer(challengesReducer, initialState);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zenToastOpen, setZenToastOpen] = useState(false);
  const [zenToastMessage, setZenToastMessage] = useState<string | undefined>(undefined);
  const loading = state.challenges === undefined;
  const challenges = state.challenges ?? [];

  const showZenErrorToast = (message: string) => {
    setZenToastMessage(message);
    setZenToastOpen(false);
    window.setTimeout(() => setZenToastOpen(true), 20);
    window.setTimeout(() => setZenToastOpen(false), 3200);
  };

  // react-doctor-disable-next-line react-doctor/no-initialize-state
  useEffect(() => {
    const fetchInitialChallenges = async () => {
      try {
        const res = await getChallenges({ limit: PAGE_SIZE, offset: 0 });
        if (res.success && res.data) {
          dispatch({
            type: "initialLoaded",
            payload: {
              challenges: res.data.items as Challenge[],
              hasMore: res.data.hasMore,
              userElo: res.data.userElo,
            },
          });
        } else {
          dispatch({ type: "initialFailed" });
          showZenErrorToast(res.error || "Erro ao carregar desafios");
        }
      } catch {
        dispatch({ type: "initialFailed" });
        showZenErrorToast("Erro ao conectar ao servidor");
      }
    };

    // react-doctor-disable-next-line react-doctor/no-initialize-state
    fetchInitialChallenges();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".challenge-card")) {
        setHoveredId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const loadMoreChallenges = async () => {
    if (state.loadingMore || !state.hasMore) {
      return;
    }

    dispatch({ type: "loadingMore", payload: true });
    try {
      const res = await getChallenges({ limit: PAGE_SIZE, offset: challenges.length });
      if (res.success && res.data) {
        dispatch({
          type: "appendLoaded",
          payload: {
            challenges: res.data.items as Challenge[],
            hasMore: res.data.hasMore,
          },
        });
        dispatch({ type: "loadingMore", payload: false });
      } else {
        showZenErrorToast(res.error || "Erro ao carregar mais desafios");
        dispatch({ type: "loadingMore", payload: false });
      }
    } catch {
      showZenErrorToast("Erro ao conectar ao servidor");
      dispatch({ type: "loadingMore", payload: false });
    }
  };


  const isMatched = (challenge: Challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      challenge.tags.toLowerCase().includes(state.searchQuery.toLowerCase());

    const matchesDifficulty =
      state.filterDifficulty === "ALL" || challenge.difficulty === state.filterDifficulty;

    return matchesSearch && matchesDifficulty;
  };

  const hasMatches = challenges.some(isMatched);

  const sortedChallenges = challenges.toSorted((a, b) => a.recommendedElo - b.recommendedElo);
  const rows: { type: "single" | "pair"; items: Challenge[] }[] = [];
  let groupIndex = 0;
  while (groupIndex < sortedChallenges.length) {
    const current = sortedChallenges[groupIndex];
    const next = sortedChallenges[groupIndex + 1];
    // Group sibling challenges: same difficulty and close ELO
    if (
      next &&
      current.difficulty === next.difficulty &&
      Math.abs(current.recommendedElo - next.recommendedElo) <= 100
    ) {
      rows.push({ type: "pair", items: [current, next] });
      groupIndex += 2;
    } else {
      rows.push({ type: "single", items: [current] });
      groupIndex += 1;
    }
  }

  return (
    <div className="flex-1 w-full bg-background/30 dark:bg-background/30 bg-[color:var(--zen-washi)] px-4 py-8 md:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <ChallengesHeader />
      <ChallengesFilters
        filterDifficulty={state.filterDifficulty}
        searchQuery={state.searchQuery}
        onFilterChange={diff => dispatch({ type: "setFilter", payload: diff })}
        onSearchChange={query => dispatch({ type: "setSearch", payload: query })}
      />
      <RankBadge userElo={state.userElo} />

      <div className="relative w-full py-2">
        {loading ? (
          <ChallengesLoadingState />
        ) : challenges.length === 0 ? (
          <ChallengesStatePanel
            title="Jardim Deserto"
            description="Nenhum desafio registrado no templo do código."
          />
        ) : !hasMatches ? (
          <ChallengesStatePanel
            title="Trilha Oculta sob a Névoa"
            description="A névoa cobre todos os nós. Nenhum desafio corresponde aos seus critérios."
            animated
          />
        ) : (
          <div className="relative flex flex-col w-full max-w-3xl mx-auto">
            {rows.map((row, rowIndex) => {
              const rowId = `row-${rowIndex}`;

              if (row.type === "pair") {
                const [leftChallenge, rightChallenge] = row.items;
                const leftMatched = isMatched(leftChallenge);
                const rightMatched = isMatched(rightChallenge);
                const leftIsHovered = hoveredId === leftChallenge.id;
                const rightIsHovered = hoveredId === rightChallenge.id;

                return (
                  <PairChallengeRow
                    key={rowId}
                    leftChallenge={leftChallenge}
                    rightChallenge={rightChallenge}
                    leftMatched={leftMatched}
                    rightMatched={rightMatched}
                    leftIsHovered={leftIsHovered}
                    rightIsHovered={rightIsHovered}
                    setHoveredId={setHoveredId}
                    userElo={state.userElo}
                  />
                );
              } else {
                const challenge = row.items[0];
                const matched = isMatched(challenge);
                const isHovered = hoveredId === challenge.id;
                const isLeft = rowIndex % 2 === 0;

                return (
                  <SingleChallengeRow
                    key={rowId}
                    challenge={challenge}
                    matched={matched}
                    isHovered={isHovered}
                    isLeft={isLeft}
                    setHoveredId={setHoveredId}
                    userElo={state.userElo}
                  />
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Botão Carregar Mais */}
      {!loading && state.hasMore ? (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMoreChallenges}
            disabled={state.loadingMore}
            className="h-9 rounded-none font-mono uppercase text-xs px-6 border-[color:var(--zen-border)] dark:border-border/80 bg-[color:var(--zen-washi)] dark:bg-card hover:bg-[color:color-mix(in_oklch,var(--zen-ink)_5%,transparent)] dark:hover:bg-secondary/50 text-[color:var(--zen-ink)] dark:text-foreground"
          >
            {state.loadingMore ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Carregando…
              </>
            ) : (
              "Revelar Mais"
            )}
          </Button>
        </div>
      ) : null}
      <div className="fixed bottom-4 right-4 z-[80]">
        <ZenToast open={zenToastOpen} tone="error" title="Falha de carregamento">
          {zenToastMessage ?? ""}
        </ZenToast>
      </div>
    </div>
  );
}
