"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";

import { Button } from "@kodan/ui/components/button";
import { ZenToast } from "@kodan/ui/components/zen";
import { getChallenges } from "../actions";
import { ChallengesFocusPanel } from "./challenges-focus-panel";
import { CHALLENGES_PAGE_SIZE } from "./constants";
import {
  challengesReducer,
  createInitialChallengesState,
  getVisibleChallenges,
  resolveActiveChallengeId,
  type ChallengesInitialData,
} from "./challenges-list-state";
import {
  ChallengesBoard,
  ChallengesLoadingState,
  ChallengesSidebar,
  ChallengesStatePanel,
} from "./challenges-shell";
import { ChallengesTree } from "./challenges-tree";
import { type Challenge } from "./ema-challenge-card-helpers";

export default function ChallengesPageClient({
  initialData,
}: {
  initialData: ChallengesInitialData;
}) {
  const [state, dispatch] = useReducer(
    challengesReducer,
    initialData,
    createInitialChallengesState,
  );
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [zenToastOpen, setZenToastOpen] = useState(false);
  const [zenToastMessage, setZenToastMessage] = useState<string | undefined>(undefined);
  const toastTimeoutsRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      toastTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
      toastTimeoutsRef.current = [];
    },
    [],
  );

  const showZenErrorToast = (message: string) => {
    toastTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    toastTimeoutsRef.current = [];
    setZenToastMessage(message);
    setZenToastOpen(false);
    toastTimeoutsRef.current.push(window.setTimeout(() => setZenToastOpen(true), 20));
    toastTimeoutsRef.current.push(window.setTimeout(() => setZenToastOpen(false), 3200));
  };

  const loadInitialChallenges = async () => {
    if (state.loadingInitial) {
      return;
    }

    dispatch({ type: "reloadStarted" });

    try {
      const response = await getChallenges({ limit: CHALLENGES_PAGE_SIZE, offset: 0 });
      if (response.success && response.data) {
        dispatch({
          type: "reloadSucceeded",
          payload: {
            challenges: response.data.items as Challenge[],
            hasMore: response.data.hasMore,
            userElo: response.data.userElo,
          },
        });
        return;
      }

      const errorMessage = response.error || "Não foi possível carregar os desafios agora.";
      dispatch({ type: "reloadFailed", payload: errorMessage });
      showZenErrorToast(errorMessage);
    } catch {
      const errorMessage = "Erro ao conectar ao servidor";
      dispatch({ type: "reloadFailed", payload: errorMessage });
      showZenErrorToast(errorMessage);
    }
  };

  const loadMoreChallenges = async () => {
    if (state.loadingInitial || state.loadingMore || !state.hasMore) {
      return;
    }

    dispatch({ type: "loadingMore", payload: true });

    try {
      const response = await getChallenges({
        limit: CHALLENGES_PAGE_SIZE,
        offset: state.challenges.length,
      });

      if (response.success && response.data) {
        dispatch({
          type: "appendLoaded",
          payload: {
            challenges: response.data.items as Challenge[],
            hasMore: response.data.hasMore,
          },
        });
        dispatch({ type: "loadingMore", payload: false });
      } else {
        showZenErrorToast(response.error || "Erro ao carregar mais desafios");
        dispatch({ type: "loadingMore", payload: false });
      }
    } catch {
      showZenErrorToast("Erro ao conectar ao servidor");
      dispatch({ type: "loadingMore", payload: false });
    }
  };

  const visibleChallenges = getVisibleChallenges(
    state.challenges,
    state.searchQuery,
    state.filterDifficulty,
  );
  const hasMatches = visibleChallenges.length > 0;
  const hasActiveFilters =
    state.searchQuery.trim().length > 0 || state.filterDifficulty !== "ALL";
  const visibleChallengesCount = visibleChallenges.length;
  const activeCardId = resolveActiveChallengeId(visibleChallenges, focusedCardId);
  const activeChallenge =
    visibleChallenges.find(challenge => challenge.id === activeCardId) ?? visibleChallenges[0] ?? null;

  return (
    <div className="mx-auto w-full max-w-[1380px] px-4 py-6 md:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <ChallengesSidebar
          totalChallengesCount={state.challenges.length}
          visibleChallengesCount={visibleChallengesCount}
          filterDifficulty={state.filterDifficulty}
          searchQuery={state.searchQuery}
          userElo={state.userElo}
          onFilterChange={difficulty => dispatch({ type: "setFilter", payload: difficulty })}
          onSearchChange={query => dispatch({ type: "setSearch", payload: query })}
          onClearFilters={() => dispatch({ type: "clearFilters" })}
        />

        <ChallengesBoard
          totalChallengesCount={state.challenges.length}
          visibleChallengesCount={visibleChallengesCount}
          filterDifficulty={state.filterDifficulty}
          searchQuery={state.searchQuery}
        >
          <div className="relative w-full py-2">
            {state.loadingInitial ? (
              <ChallengesLoadingState />
            ) : state.initialError ? (
              <ChallengesStatePanel
                title="Trilha indisponível"
                description={state.initialError}
                action={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 rounded-none border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] px-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--zen-ink)] hover:bg-[color:color-mix(in_oklch,var(--zen-ink)_5%,transparent)] dark:border-border/80 dark:bg-card dark:text-foreground dark:hover:bg-secondary/50"
                    onClick={loadInitialChallenges}
                  >
                    Tentar novamente
                  </Button>
                }
              />
            ) : state.challenges.length === 0 ? (
              <ChallengesStatePanel
                title="Jardim Deserto"
                description="Nenhum desafio registrado no templo do código."
              />
            ) : !hasMatches ? (
              <ChallengesStatePanel
                title="Nenhum desafio corresponde à busca atual"
                description={
                  hasActiveFilters
                    ? "A trilha continua aqui, mas nenhum nó combina com o termo ou a dificuldade selecionada."
                    : "Nenhum desafio disponível corresponde ao estado atual."
                }
                action={
                  hasActiveFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-none border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] px-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--zen-ink)] hover:bg-[color:color-mix(in_oklch,var(--zen-ink)_5%,transparent)] dark:border-border/80 dark:bg-card dark:text-foreground dark:hover:bg-secondary/50"
                      onClick={() => dispatch({ type: "clearFilters" })}
                    >
                      Limpar filtros
                    </Button>
                  ) : null
                }
                animated
              />
            ) : (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <div className="min-w-0">
                  <ChallengesTree
                    challenges={state.challenges}
                    searchQuery={state.searchQuery}
                    filterDifficulty={state.filterDifficulty}
                    activeCardId={activeCardId}
                    setFocusedCardId={setFocusedCardId}
                    userElo={state.userElo}
                  />
                </div>

                {activeChallenge ? (
                  <div className="min-w-0">
                    <ChallengesFocusPanel challenge={activeChallenge} userElo={state.userElo} />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {!state.loadingInitial && state.hasMore ? (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={loadMoreChallenges}
                disabled={state.loadingMore}
                className="h-9 rounded-none border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] px-6 font-mono text-xs uppercase text-[color:var(--zen-ink)] hover:bg-[color:color-mix(in_oklch,var(--zen-ink)_5%,transparent)] dark:border-border/80 dark:bg-card dark:text-foreground dark:hover:bg-secondary/50"
              >
                {state.loadingMore ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    Carregando…
                  </>
                ) : (
                  "Revelar mais"
                )}
              </Button>
            </div>
          ) : null}
        </ChallengesBoard>
      </div>

      <div className="fixed bottom-4 right-4 z-[80]">
        <ZenToast open={zenToastOpen} tone="error" title="Falha de carregamento">
          {zenToastMessage ?? ""}
        </ZenToast>
      </div>
    </div>
  );
}
