import {
  ELO_POTENTIAL_BY_ATTEMPT,
  MAX_EVALUATED_ATTEMPTS,
  PASSING_ATTEMPT_SCORE,
  type AttemptSessionStatus,
} from "@/lib/attempt-session-rules";

export {
  MAX_EVALUATED_ATTEMPTS,
  PASSING_ATTEMPT_SCORE,
  type AttemptSessionStatus,
} from "@/lib/attempt-session-rules";

export type FeedbackPayload = {
  score: number;
  summary: string;
  strengths: string[];
  blindspots: string[];
  seniorSolution: string;
};

type AttemptEvaluationInput = {
  currentElo: number;
  previousAttemptsCount: number;
  usedHint: boolean;
  solution: string;
  feedback: unknown;
};

type RevealAttemptSolutionInput = {
  currentElo: number;
  attemptNumber: number;
  solution: string;
  feedback: unknown;
};

const DEFAULT_SUMMARY =
  "Você identificou os principais problemas do código, demonstrando boa compreensão do fluxo do React. Alguns detalhes mais sutis poderiam ser aprofundados.";
const DEFAULT_STRENGTHS = [
  "Identificou o problema principal relacionado ao fluxo de estado e efeitos.",
  "Construiu uma explicação lógica sobre o impacto no comportamento do componente.",
];
const DEFAULT_BLINDSPOTS = [
  "Faltou detalhar o cleanup de efeitos assíncronos quando aplicável.",
  "Poderia mencionar estratégias para manter dependências estáveis entre renderizações.",
];

export function evaluateAttempt(input: AttemptEvaluationInput) {
  if (input.previousAttemptsCount >= MAX_EVALUATED_ATTEMPTS) {
    throw new Error("Limite de tentativas atingido");
  }

  const normalizedFeedback = normalizeFeedback(input.feedback, input.solution);
  const attemptNumber = input.previousAttemptsCount + 1;
  const isSolved = normalizedFeedback.score >= PASSING_ATTEMPT_SCORE;
  const hasEvaluatedAttemptsLeft = attemptNumber < MAX_EVALUATED_ATTEMPTS;
  const status: AttemptSessionStatus = isSolved
    ? "SOLVED"
    : hasEvaluatedAttemptsLeft
      ? "RETRY_AVAILABLE"
      : "ELO_EXHAUSTED";
  const potentialPercent = ELO_POTENTIAL_BY_ATTEMPT[attemptNumber - 1] ?? 0;
  let eloChange = isSolved
    ? Math.round(Math.max(0, calculateEloDelta(normalizedFeedback.score)) * potentialPercent / 100)
    : 0;

  if (input.usedHint && eloChange > 7) {
    eloChange = 7;
  }

  const feedback = isSolved
    ? normalizedFeedback
    : { ...normalizedFeedback, seniorSolution: "" };

  return {
    score: feedback.score,
    eloChange,
    newElo: Math.max(100, input.currentElo + eloChange),
    isFirstAttempt: attemptNumber === 1,
    attemptNumber,
    status,
    canRetry: status === "RETRY_AVAILABLE",
    canRevealSolution: !isSolved,
    remainingEvaluatedAttempts: Math.max(0, MAX_EVALUATED_ATTEMPTS - attemptNumber),
    nextEloPotentialPercent: status === "RETRY_AVAILABLE"
      ? ELO_POTENTIAL_BY_ATTEMPT[attemptNumber] ?? 0
      : 0,
    eloFinalized: status !== "RETRY_AVAILABLE",
    feedback,
  };
}

export function revealAttemptSolution(input: RevealAttemptSolutionInput) {
  const feedback = normalizeFeedback(input.feedback, input.solution);

  return {
    score: feedback.score,
    eloChange: 0,
    newElo: input.currentElo,
    isFirstAttempt: input.attemptNumber === 1,
    attemptNumber: input.attemptNumber,
    status: "REVEALED" as const,
    canRetry: false,
    canRevealSolution: false,
    remainingEvaluatedAttempts: Math.max(0, MAX_EVALUATED_ATTEMPTS - input.attemptNumber),
    nextEloPotentialPercent: 0,
    eloFinalized: true,
    feedback,
  };
}

function calculateEloDelta(score: number) {
  if (score >= 8) return 10 + (score - 8) * 5;
  if (score >= 5) return 2 + (score - 5) * 1.5;
  return -15 + score * 2.5;
}

function normalizeFeedback(payload: unknown, solution: string): FeedbackPayload {
  const value = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const score = typeof value.score === "number" && Number.isFinite(value.score)
    ? Math.max(0, Math.min(10, value.score))
    : 8;
  const summary = typeof value.summary === "string" && value.summary.trim()
    ? value.summary.trim()
    : DEFAULT_SUMMARY;
  const strengths = readNonEmptyStrings(value.strengths);
  const blindspots = readNonEmptyStrings(value.blindspots);

  return {
    score,
    summary,
    strengths: strengths.length > 0 ? strengths : DEFAULT_STRENGTHS,
    blindspots: blindspots.length > 0 ? blindspots : DEFAULT_BLINDSPOTS,
    seniorSolution: solution,
  };
}

function readNonEmptyStrings(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}
