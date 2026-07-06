import { describe, expect, it } from "bun:test";

import {
  buildChallengeRows,
  challengesReducer,
  createInitialChallengesState,
  getVisibleChallenges,
  matchesChallenge,
  resolveActiveChallengeId,
} from "./challenges-list-state";
import type { Challenge } from "./ema-challenge-card-helpers";

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: overrides.id ?? "challenge-1",
    title: overrides.title ?? "Stale Closure no useEffect",
    difficulty: overrides.difficulty ?? "MEDIUM",
    recommendedElo: overrides.recommendedElo ?? 1200,
    tags: overrides.tags ?? "react,useEffect,closures",
    attempts: overrides.attempts ?? [],
  };
}

describe("challenges-list-state", () => {
  it("cria o estado inicial com os dados do servidor", () => {
    const state = createInitialChallengesState({
      challenges: [makeChallenge()],
      hasMore: true,
      userElo: 1320,
      initialError: null,
    });

    expect(state.challenges).toHaveLength(1);
    expect(state.hasMore).toBe(true);
    expect(state.userElo).toBe(1320);
    expect(state.loadingInitial).toBe(false);
    expect(state.initialError).toBeNull();
  });

  it("faz match por texto e por dificuldade", () => {
    const challenge = makeChallenge();

    expect(matchesChallenge(challenge, "closure", "ALL")).toBe(true);
    expect(matchesChallenge(challenge, "react", "MEDIUM")).toBe(true);
    expect(matchesChallenge(challenge, "zustand", "ALL")).toBe(false);
    expect(matchesChallenge(challenge, "closure", "HARD")).toBe(false);
  });

  it("agrupa desafios irmãos por dificuldade e proximidade de elo", () => {
    const rows = buildChallengeRows([
      makeChallenge({ id: "1", difficulty: "EASY", recommendedElo: 900 }),
      makeChallenge({ id: "2", difficulty: "EASY", recommendedElo: 980 }),
      makeChallenge({ id: "3", difficulty: "HARD", recommendedElo: 1500 }),
    ]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      type: "pair",
      items: [expect.objectContaining({ id: "1" }), expect.objectContaining({ id: "2" })],
    });
    expect(rows[1]).toEqual({
      type: "single",
      items: [expect.objectContaining({ id: "3" })],
    });
  });

  it("retorna apenas os desafios visíveis para o filtro atual", () => {
    const visibleChallenges = getVisibleChallenges(
      [
        makeChallenge({ id: "1", title: "Stale closure no React", difficulty: "MEDIUM" }),
        makeChallenge({ id: "2", title: "Promise race no fetch", difficulty: "HARD" }),
      ],
      "react",
      "MEDIUM",
    );

    expect(visibleChallenges).toEqual([expect.objectContaining({ id: "1" })]);
  });

  it("resolve o desafio ativo mantendo o atual quando ele ainda esta visível", () => {
    const visibleChallenges = [
      makeChallenge({ id: "1", recommendedElo: 900 }),
      makeChallenge({ id: "2", recommendedElo: 1050 }),
    ];

    expect(resolveActiveChallengeId(visibleChallenges, "2")).toBe("2");
    expect(resolveActiveChallengeId(visibleChallenges, null)).toBe("1");
    expect(resolveActiveChallengeId(visibleChallenges, "fora-da-lista")).toBe("1");
    expect(resolveActiveChallengeId([], "2")).toBeNull();
  });

  it("limpa o erro inicial quando um recarregamento funciona", () => {
    const initialState = createInitialChallengesState({
      challenges: [],
      hasMore: false,
      userElo: 1200,
      initialError: "Falha anterior",
    });

    const loadingState = challengesReducer(initialState, { type: "reloadStarted" });
    const reloadedState = challengesReducer(loadingState, {
      type: "reloadSucceeded",
      payload: {
        challenges: [makeChallenge()],
        hasMore: false,
        userElo: 1280,
      },
    });

    expect(loadingState.loadingInitial).toBe(true);
    expect(reloadedState.loadingInitial).toBe(false);
    expect(reloadedState.initialError).toBeNull();
    expect(reloadedState.challenges).toHaveLength(1);
    expect(reloadedState.userElo).toBe(1280);
  });
});
