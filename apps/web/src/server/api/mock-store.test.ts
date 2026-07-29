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

  test("mantém a mesma sessão até resolver e reduz o ELO potencial", () => {
    const store = createMockTrainingStore({
      feedbackForAnswer: (answer) => ({
        score: answer === "resposta correta e suficientemente detalhada" ? 8 : 4,
        summary: "Avaliação simulada.",
        strengths: ["Há uma linha de raciocínio."],
        blindspots: ["Ainda falta identificar a causa principal."],
      }),
    });
    const challengeId = store.listChallenges({ limit: 1, offset: 0 }).items[0]!.id;

    const first = store.submitAttempt(challengeId, {
      userAnswer: "primeira resposta incorreta e incompleta",
    });
    const second = store.submitAttempt(challengeId, {
      userAnswer: "resposta correta e suficientemente detalhada",
    });

    expect(first).toMatchObject({
      status: "RETRY_AVAILABLE",
      attemptNumber: 1,
      eloChange: 0,
    });
    expect(second).toMatchObject({
      status: "SOLVED",
      attemptNumber: 2,
      eloChange: 6,
      newElo: 1206,
    });
    expect(() => store.submitAttempt(challengeId, {
      userAnswer: "uma nova resposta depois de resolver",
    })).toThrow("Tentativa encerrada");
  });

  test("revela a solução e bloqueia novas respostas", () => {
    const store = createMockTrainingStore({
      feedbackForAnswer: () => ({
        score: 4,
        summary: "Avaliação simulada.",
        strengths: ["Há uma linha de raciocínio."],
        blindspots: ["Ainda falta identificar a causa principal."],
      }),
    });
    const challengeId = store.listChallenges({ limit: 1, offset: 0 }).items[0]!.id;

    store.submitAttempt(challengeId, { userAnswer: "resposta incorreta mas detalhada" });
    const revealed = store.revealSolution(challengeId);

    expect(revealed).toMatchObject({ status: "REVEALED", eloChange: 0, newElo: 1200 });
    expect(revealed.feedback.seniorSolution.length).toBeGreaterThan(0);
    expect(() => store.submitAttempt(challengeId, {
      userAnswer: "tentativa depois de revelar a solução",
    })).toThrow("Tentativa encerrada");
  });
});
