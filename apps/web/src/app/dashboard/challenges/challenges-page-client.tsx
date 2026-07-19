"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ZenToast } from "@kodan/ui/components/zen";
import { ChallengesNavigationDrawer } from "./challenges-navigation-drawer";
import { ChallengesExplorerPanel } from "./challenges-explorer-list";
import {
  CHALLENGES_INITIAL_LOAD_SIZE,
  CHALLENGES_PAGE_SIZE,
} from "./constants";
import {
  challengesReducer,
  createInitialChallengesState,
  getPaginatedChallenges,
  getVisibleChallenges,
  resolveActiveChallengeId,
  type ChallengesInitialData,
} from "./challenges-list-state";
import {
  getChallengeTopicDescription,
  getChallengeTopicLabel,
} from "./challenges-taxonomy";
import {
  ChallengesDesktopShell,
  ChallengesLoadingState,
  ChallengesMobileShell,
  ChallengesStatePanel,
} from "./challenges-shell";
import { type Challenge } from "./ema-challenge-card-helpers";

type ChallengesApiResponse =
  | {
      success: true;
      data: {
        items: Challenge[];
        hasMore: boolean;
        total: number;
        userElo: number;
      };
    }
  | { success: false; error: string };

async function fetchChallenges(params: { limit: number; offset: number }) {
  const searchParams = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
  });
  const response = await fetch(`/api/challenges?${searchParams.toString()}`);
  return (await response.json()) as ChallengesApiResponse;
}

export default function ChallengesPageClient({
  initialData,
}: {
  initialData: ChallengesInitialData;
}) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    challengesReducer,
    initialData,
    createInitialChallengesState,
  );
  const [focusedChallengeId, setFocusedChallengeId] = useState<string | null>(
    null,
  );
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [zenToastOpen, setZenToastOpen] = useState(false);
  const [zenToastMessage, setZenToastMessage] = useState<string | undefined>(
    undefined,
  );
  const toastTimeoutsRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      toastTimeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
      toastTimeoutsRef.current = [];
    },
    [],
  );

  const showZenErrorToast = (message: string) => {
    toastTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId),
    );
    toastTimeoutsRef.current = [];
    setZenToastMessage(message);
    setZenToastOpen(false);
    toastTimeoutsRef.current.push(
      window.setTimeout(() => setZenToastOpen(true), 20),
    );
    toastTimeoutsRef.current.push(
      window.setTimeout(() => setZenToastOpen(false), 3200),
    );
  };

  const loadInitialChallenges = async () => {
    if (state.loadingInitial) {
      return;
    }

    dispatch({ type: "reloadStarted" });

    try {
      const response = await fetchChallenges({
        limit: CHALLENGES_INITIAL_LOAD_SIZE,
        offset: 0,
      });
      if (response.success) {
        dispatch({
          type: "reloadSucceeded",
          payload: {
            challenges: response.data.items as Challenge[],
            hasMore: response.data.hasMore,
            totalCount: response.data.total,
            userElo: response.data.userElo,
          },
        });
        return;
      }

      const errorMessage =
        response.error || "Não foi possível carregar os desafios agora.";
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
      const response = await fetchChallenges({
        limit: CHALLENGES_PAGE_SIZE,
        offset: state.challenges.length,
      });

      if (response.success) {
        dispatch({
          type: "appendLoaded",
          payload: {
            challenges: response.data.items as Challenge[],
            hasMore: response.data.hasMore,
            totalCount: response.data.total,
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
    state.topicFilter,
    state.statusFilter,
    state.typeFilter,
    state.onlyUnsolved,
    state.sortBy,
  );
  const paginatedChallenges = getPaginatedChallenges(
    visibleChallenges,
    state.page,
    CHALLENGES_PAGE_SIZE,
  );
  const activeChallengeId = resolveActiveChallengeId(
    paginatedChallenges,
    focusedChallengeId,
  );
  const topicLabel =
    state.topicFilter === "ALL"
      ? "Todos os desafios"
      : getChallengeTopicLabel(state.topicFilter);
  const topicDescription =
    state.topicFilter === "ALL"
      ? "Escolha um exercício e continue sua evolução no Dojo."
      : getChallengeTopicDescription(state.topicFilter);
  const hasActiveFilters =
    state.searchQuery.trim().length > 0 ||
    state.filterDifficulty !== "ALL" ||
    state.statusFilter !== "ALL" ||
    state.typeFilter !== "ALL" ||
    state.onlyUnsolved ||
    state.sortBy !== "RECENT";

  const handlePageChange = async (page: number) => {
    if (page < 1) {
      return;
    }

    const requestedEnd = page * CHALLENGES_PAGE_SIZE;
    if (requestedEnd > state.challenges.length && state.hasMore) {
      await loadMoreChallenges();
    }

    dispatch({ type: "setPage", payload: page });
  };

  const openChallenge = (challengeId: string) => {
    router.push(`/train/${challengeId}`);
  };


  const content = state.loadingInitial ? (
    <ChallengesLoadingState />
  ) : state.initialError ? (
    <ChallengesStatePanel
      title="Catálogo indisponível"
      description={state.initialError}
      action={
        <button
          type="button"
          className="challengers-control h-10 rounded-[8px] border px-4 text-sm"
          disabled={state.loadingInitial}
          onClick={loadInitialChallenges}
        >
          {state.loadingInitial ? "Carregando..." : "Tentar novamente"}
        </button>
      }
    />
  ) : state.challenges.length === 0 ? (
    <ChallengesStatePanel
      title="Nenhum desafio carregado"
      description="O catálogo ainda não recebeu exercícios para esta trilha."
    />
  ) : (
    <ChallengesExplorerPanel
      topicLabel={topicLabel}
      topicDescription={topicDescription}
      topicFilter={state.topicFilter}
      challenges={paginatedChallenges}
      activeChallengeId={activeChallengeId}
      visibleCount={visibleChallenges.length}
      page={state.page}
      pageSize={CHALLENGES_PAGE_SIZE}
      filterDifficulty={state.filterDifficulty}
      statusFilter={state.statusFilter}
      typeFilter={state.typeFilter}
      onlyUnsolved={state.onlyUnsolved}
      sortBy={state.sortBy}
      hasActiveFilters={hasActiveFilters}
      loadingMore={state.loadingMore}
      onFocusChallenge={setFocusedChallengeId}
      onOpenChallenge={openChallenge}
      onFilterChange={(difficulty) =>
        dispatch({ type: "setFilter", payload: difficulty })
      }
      onStatusChange={(status) =>
        dispatch({ type: "setStatus", payload: status })
      }
      onTypeChange={(type) => dispatch({ type: "setType", payload: type })}
      onOnlyUnsolvedChange={(checked) =>
        dispatch({ type: "setOnlyUnsolved", payload: checked })
      }
      onSortChange={(sortBy) => dispatch({ type: "setSort", payload: sortBy })}
      onClearFilters={() => dispatch({ type: "clearFilters" })}
      onPageChange={(page) => void handlePageChange(page)}
    />
  );

  return (
    <main
      data-challengers-screen="true"
      className="h-full min-h-0 bg-[var(--challengers-page)] text-[var(--challengers-ink)]"
    >
      <div className="hidden h-full min-h-0 w-full lg:block">
        <ChallengesDesktopShell
          userElo={state.userElo}
          title={topicLabel}
          description={topicDescription}
          searchQuery={state.searchQuery}
          onSearchChange={(query) =>
            dispatch({ type: "setSearch", payload: query })
          }
        >
          {content}
        </ChallengesDesktopShell>
      </div>

      <ChallengesMobileShell
        userElo={state.userElo}
        searchQuery={state.searchQuery}
        filtersOpen={navigationOpen}
        onSearchChange={(query) =>
          dispatch({ type: "setSearch", payload: query })
        }
        onOpenFilters={() => setNavigationOpen(true)}
      >
        {content}
      </ChallengesMobileShell>

      <ChallengesNavigationDrawer
        open={navigationOpen}
        challenges={state.challenges}
        topicFilter={state.topicFilter}
        filterDifficulty={state.filterDifficulty}
        onClose={() => setNavigationOpen(false)}
        onTopicChange={(topic) => dispatch({ type: "setTopic", payload: topic })}
        onDifficultyChange={(difficulty) =>
          dispatch({ type: "setFilter", payload: difficulty })
        }
      />

      <div className="fixed bottom-4 right-4 z-50">
        <ZenToast open={zenToastOpen} tone="error" title="Falha de carregamento">
          {zenToastMessage ?? ""}
        </ZenToast>
      </div>
    </main>
  );
}
