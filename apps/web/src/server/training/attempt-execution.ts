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
  question?: string;
  code?: string;
  userAnswer?: string;
  feedback?: unknown;
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

  const normalizedFeedback = normalizeFeedback(
    input.feedback,
    input.solution,
    input.userAnswer,
    input.question,
    input.code
  );
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

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

const COMMON_JUNK_PATTERNS = [
  /^([a-z0-9])\1+$/i,
  /^(asdf|qwerty|zxcv|1234|abc|test|teste|qualquer|foo|bar|nao sei|sei la|sim|nao|ok)$/i,
];

const STOP_WORDS = new Set([
  "o", "a", "os", "as", "um", "uma", "uns", "umas", "de", "do", "da", "dos", "das",
  "em", "no", "na", "nos", "nas", "para", "por", "com", "sem", "que", "se", "como",
  "mas", "ou", "e", "ao", "aos", "seu", "sua", "seus", "suas", "meu", "minha",
  "ser", "esta", "estao", "foi", "foram", "ter", "tem", "tinha", "pode", "podem",
  "mais", "muito", "muita", "qual", "quais", "quando", "onde", "este", "esta",
  "isto", "esse", "essa", "isso", "aquele", "aquela", "aquilo", "pela", "pelo"
]);

export function evaluateLocalAnswer(
  userAnswer: string | undefined,
  solution: string,
  question?: string,
  code?: string,
): { score: number; summary: string; strengths: string[]; blindspots: string[] } {
  const trimmed = userAnswer?.trim() ?? "";

  if (!trimmed || trimmed.length < 6 || COMMON_JUNK_PATTERNS.some((p) => p.test(trimmed))) {
    return {
      score: 0,
      summary: "A resposta enviada é muito curta ou não apresenta uma explicação diagnóstica válida para o desafio.",
      strengths: [],
      blindspots: ["Descreva a causa do erro no código e proponha a correção adequada."],
    };
  }

  const normalizedAnswer = normalizeText(trimmed);
  const answerWords = new Set(normalizedAnswer.split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w)));

  const referenceText = `${solution} ${question ?? ""} ${code ?? ""}`;
  const normalizedRef = normalizeText(referenceText);
  const refWords = normalizedRef
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const targetKeywords = Array.from(new Set(refWords));

  let matchesCount = 0;
  for (const keyword of targetKeywords) {
    for (const userWord of answerWords) {
      if (
        userWord === keyword ||
        (keyword.length >= 4 && userWord.includes(keyword)) ||
        (userWord.length >= 4 && keyword.includes(userWord))
      ) {
        matchesCount++;
        break;
      }
    }
  }

  const solutionKeywords = Array.from(
    new Set(
      normalizeText(solution)
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    )
  );

  let solutionMatchesCount = 0;
  for (const keyword of solutionKeywords) {
    for (const userWord of answerWords) {
      if (
        userWord === keyword ||
        (keyword.length >= 4 && userWord.includes(keyword)) ||
        (userWord.length >= 4 && keyword.includes(userWord))
      ) {
        solutionMatchesCount++;
        break;
      }
    }
  }

  const requiredMatches = Math.min(3, Math.max(1, Math.floor(targetKeywords.length / 4)));
  const matchRatio = matchesCount / Math.max(1, requiredMatches);

  if (matchesCount === 0 || (solutionMatchesCount === 0 && matchRatio < 0.4)) {
    return {
      score: 0,
      summary: "A resposta enviada não aborda a causa do erro nem os conceitos técnicos questionados neste desafio.",
      strengths: [],
      blindspots: [
        "A resposta fornecida está distante da solução de referência.",
        "Analise o enunciado e o código para identificar o comportamento incorreto.",
      ],
    };
  }

  if (solutionMatchesCount < 2 && matchRatio < 0.8) {
    return {
      score: 4,
      summary: "Sua resposta cita termos do desafio, mas está incompleta ou distante da causa raiz e da solução esperada.",
      strengths: ["Identificou parte do contexto do código."],
      blindspots: [
        "Aprofunde a explicação técnica da causa do erro.",
        "Especifique com mais detalhes como implementar a correção.",
      ],
    };
  }

  return {
    score: 8,
    summary: "Boa análise! Você identificou a causa raiz do problema e propôs uma explicação compatível com a solução de referência.",
    strengths: [
      "Diagnóstico preciso da causa raiz.",
      "Construiu uma explicação técnica alinhada com a solução de referência.",
    ],
    blindspots: [
      "Mantenha atenção nos detalhes de limpeza de efeitos e estabilidade de referências.",
    ],
  };
}

function normalizeFeedback(
  payload: unknown,
  solution: string,
  userAnswer?: string,
  question?: string,
  code?: string,
): FeedbackPayload {
  const value = payload && typeof payload === "object" ? payload as Record<string, unknown> : null;
  if (value && typeof value.score === "number" && Number.isFinite(value.score)) {
    const score = Math.max(0, Math.min(10, value.score));
    const isPassing = score >= PASSING_ATTEMPT_SCORE;
    const summary = typeof value.summary === "string" && value.summary.trim()
      ? value.summary.trim()
      : isPassing
        ? DEFAULT_SUMMARY
        : "A resposta fornecida não atinge o nível necessário para resolver o desafio.";
    const strengths = readNonEmptyStrings(value.strengths);
    const blindspots = readNonEmptyStrings(value.blindspots);

    return {
      score,
      summary,
      strengths: strengths.length > 0 ? strengths : (isPassing ? DEFAULT_STRENGTHS : []),
      blindspots: blindspots.length > 0 ? blindspots : (isPassing ? DEFAULT_BLINDSPOTS : ["Identifique a causa raiz e forneça uma explicação diagnóstica precisa."]),
      seniorSolution: solution,
    };
  }

  const evaluated = evaluateLocalAnswer(userAnswer, solution, question, code);
  return {
    ...evaluated,
    seniorSolution: solution,
  };
}

function readNonEmptyStrings(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

