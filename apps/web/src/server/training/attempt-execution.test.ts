import { describe, expect, test } from "bun:test";

import { evaluateAttempt, revealAttemptSolution } from "./attempt-execution";

const validFeedback = {
  score: 8,
  summary: "Bom diagnóstico.",
  strengths: ["Identificou a causa."],
  blindspots: ["Poderia detalhar o cleanup."],
};

describe("evaluateAttempt", () => {
  test("recusa uma quarta avaliação mesmo com status legado incorreto", () => {
    expect(() =>
      evaluateAttempt({
        currentElo: 1200,
        previousAttemptsCount: 3,
        usedHint: false,
        solution: "Solução",
        feedback: { score: 8 },
      })
    ).toThrow("Limite de tentativas atingido");
  });

  test("mantém a sessão aberta e oculta a solução após o primeiro erro", () => {
    const result = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 0,
      usedHint: false,
      solution: "Solução de referência.",
      feedback: { ...validFeedback, score: 4 },
    });

    expect(result).toMatchObject({
      attemptNumber: 1,
      status: "RETRY_AVAILABLE",
      score: 4,
      eloChange: 0,
      newElo: 1200,
      canRetry: true,
      canRevealSolution: true,
      remainingEvaluatedAttempts: 2,
      nextEloPotentialPercent: 60,
      eloFinalized: false,
    });
    expect(result.feedback.seniorSolution).toBe("");
  });

  test("reduz o ganho quando o praticante acerta na segunda resposta", () => {
    const result = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 1,
      usedHint: false,
      solution: "Solução de referência.",
      feedback: validFeedback,
    });

    expect(result).toMatchObject({
      attemptNumber: 2,
      status: "SOLVED",
      eloChange: 6,
      newElo: 1206,
      canRetry: false,
      canRevealSolution: false,
      eloFinalized: true,
    });
    expect(result.feedback.seniorSolution).toBe("Solução de referência.");
  });

  test("encerra a disputa por ELO depois da terceira resposta incorreta", () => {
    const result = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 2,
      usedHint: false,
      solution: "Solução de referência.",
      feedback: { ...validFeedback, score: 3 },
    });

    expect(result).toMatchObject({
      attemptNumber: 3,
      status: "ELO_EXHAUSTED",
      eloChange: 0,
      newElo: 1200,
      canRetry: false,
      canRevealSolution: true,
      remainingEvaluatedAttempts: 0,
      nextEloPotentialPercent: 0,
      eloFinalized: true,
    });
    expect(result.feedback.seniorSolution).toBe("");
  });

  test("limita o ganho a sete pontos quando uma dica foi usada", () => {
    const result = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 0,
      usedHint: true,
      solution: "Solução de referência.",
      feedback: { ...validFeedback, score: 10 },
    });

    expect(result).toMatchObject({
      status: "SOLVED",
      score: 10,
      eloChange: 7,
      newElo: 1207,
    });
  });

  test("mantém o ELO mínimo em cem", () => {
    const result = evaluateAttempt({
      currentElo: 105,
      previousAttemptsCount: 0,
      usedHint: false,
      solution: "Solução de referência.",
      feedback: { ...validFeedback, score: 7 },
    });

    expect(result).toMatchObject({ eloChange: 5, newElo: 110 });
  });

  test("normaliza feedback inválido e revela a solução quando a resposta está correta", () => {
    const result = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 0,
      usedHint: false,
      solution: "Solução canônica.",
      feedback: { score: 99, strengths: ["", 42], blindspots: null },
    });

    expect(result.score).toBe(10);
    expect(result.feedback.summary.length).toBeGreaterThan(0);
    expect(result.feedback.strengths.length).toBeGreaterThan(0);
    expect(result.feedback.blindspots.length).toBeGreaterThan(0);
    expect(result.feedback.seniorSolution).toBe("Solução canônica.");
  });

  test("rejeita respostas aleatórias, vazias ou desconexas sem conceder ELO", () => {
    const question = "Por que o Handler do clique não remove o listener ao desmontar?";
    const solution = "O evento addEventListener registrou o handler mas o cleanup não chamou removeEventListener.";
    const code = "useEffect(() => { window.addEventListener('click', handler); }, []);";

    const resultRandom = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 0,
      usedHint: false,
      solution,
      question,
      code,
      userAnswer: "qualquer resposta aleatoria",
    });

    expect(resultRandom).toMatchObject({
      score: 0,
      eloChange: 0,
      newElo: 1200,
      status: "RETRY_AVAILABLE",
      canRetry: true,
    });
    expect(resultRandom.feedback.seniorSolution).toBe("");
    expect(resultRandom.feedback.summary).toContain("não aborda");

    const resultJunk = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 0,
      usedHint: false,
      solution,
      question,
      code,
      userAnswer: "asdf",
    });

    expect(resultJunk.score).toBe(0);
    expect(resultJunk.eloChange).toBe(0);
  });

  test("atribui nota baixa (4) e não concede ELO para respostas distantes do diagnóstico correto", () => {
    const question = "Por que o Handler do clique não remove o listener ao desmontar?";
    const solution = "O evento addEventListener registrou o handler mas o cleanup não chamou removeEventListener com a mesma referência.";
    const code = "useEffect(() => { window.addEventListener('click', handler); }, []);";

    const resultPartial = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 0,
      usedHint: false,
      solution,
      question,
      code,
      userAnswer: "Tem relação com o evento do window.",
    });

    expect(resultPartial).toMatchObject({
      score: 4,
      eloChange: 0,
      status: "RETRY_AVAILABLE",
    });
    expect(resultPartial.feedback.seniorSolution).toBe("");
  });

  test("aprova e concede ELO para respostas coerentes com o diagnóstico da questão", () => {
    const question = "Por que o Handler do clique não remove o listener ao desmontar?";
    const solution = "O evento addEventListener registrou o handler mas a função de cleanup não executou removeEventListener.";
    const code = "useEffect(() => { window.addEventListener('click', handler); }, []);";

    const resultCorrect = evaluateAttempt({
      currentElo: 1200,
      previousAttemptsCount: 0,
      usedHint: false,
      solution,
      question,
      code,
      userAnswer: "O addEventListener registrou o handler no window mas faltou a função de cleanup chamando removeEventListener.",
    });

    expect(resultCorrect.score).toBeGreaterThanOrEqual(7);
    expect(resultCorrect.eloChange).toBeGreaterThan(0);
    expect(resultCorrect.status).toBe("SOLVED");
    expect(resultCorrect.feedback.seniorSolution).toBe(solution);
  });
});

describe("revealAttemptSolution", () => {
  test("encerra a sessão e libera a solução sem alterar o ELO", () => {
    const result = revealAttemptSolution({
      currentElo: 1200,
      attemptNumber: 1,
      solution: "Solução canônica.",
      feedback: { ...validFeedback, score: 4 },
    });

    expect(result).toMatchObject({
      attemptNumber: 1,
      status: "REVEALED",
      eloChange: 0,
      newElo: 1200,
      canRetry: false,
      canRevealSolution: false,
      eloFinalized: true,
    });
    expect(result.feedback.seniorSolution).toBe("Solução canônica.");
  });
});
