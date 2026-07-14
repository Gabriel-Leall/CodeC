import { describe, expect, test } from "bun:test";

import { createMockTrainingStore } from "./mock-store";

describe("createMockTrainingStore", () => {
  test("fornece desafios e registra uma tentativa sem banco de dados", () => {
    const store = createMockTrainingStore();
    const firstChallenge = store.listChallenges({ limit: 1, offset: 0 }).items[0];

    expect(firstChallenge).toBeDefined();
    expect(firstChallenge?.attempts).toHaveLength(0);

    const result = store.submitAttempt(firstChallenge!.id, {
      userAnswer: "O efeito depende de rows, mas a lista de dependências está vazia e produz dados desatualizados.",
      usedHint: false,
    });

    expect(result.isFirstAttempt).toBe(true);
    expect(result.newElo).toBeGreaterThan(1200);
    expect(store.getChallengeById(firstChallenge!.id)?.attempts).toHaveLength(1);
  });
});
