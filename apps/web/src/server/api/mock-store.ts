import type { FeedbackPayload } from "./service";

type MockChallenge = {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  recommendedElo: number;
  tags: string;
  code: string;
  question: string;
  solution: string;
  createdAt: Date;
  updatedAt: Date;
};

type MockAttempt = {
  id: string;
  userId: string;
  challengeId: string;
  userAnswer: string;
  feedbackJson: string;
  score: number;
  eloChange: number;
  createdAt: Date;
  challenge: MockChallenge;
};

const MOCK_USER_ID = "mock-user";
const mockChallenges: MockChallenge[] = [
  {
    id: "mock-effect-dependencies",
    title: "Filtro de Produtos com Busca Travada",
    difficulty: "EASY",
    recommendedElo: 1100,
    tags: "react, hooks, useEffect, dependencies",
    code: `const [rows, setRows] = useState<Product[]>([]);
const [filtered, setFiltered] = useState<Product[]>([]);

useEffect(() => {
  setFiltered(rows.filter((row) => row.name.includes(searchTerm)));
}, []);`,
    question:
      "Por que a busca deixa de refletir os produtos e o termo digitado? Explique a causa e proponha uma correção.",
    solution:
      "O efeito usa rows e searchTerm, mas ambos ficaram fora das dependências. Inclua as dependências ou derive filtered durante a renderização com useMemo.",
    createdAt: new Date("2026-01-10T12:00:00.000Z"),
    updatedAt: new Date("2026-01-10T12:00:00.000Z"),
  },
  {
    id: "mock-stale-closure",
    title: "Timeline de Eventos com Lista Desatualizada",
    difficulty: "EASY",
    recommendedElo: 1120,
    tags: "react, hooks, closure, state",
    code: `useEffect(() => {
  const timer = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(timer);
}, []);`,
    question:
      "Identifique por que o contador não continua avançando e mostre uma forma segura de atualizá-lo.",
    solution:
      "count foi capturado pelo closure inicial. Use a atualização funcional setCount((current) => current + 1) para sempre ler o estado recente.",
    createdAt: new Date("2026-01-11T12:00:00.000Z"),
    updatedAt: new Date("2026-01-11T12:00:00.000Z"),
  },
  {
    id: "mock-cleanup",
    title: "Listener Duplicado ao Abrir o Painel",
    difficulty: "MEDIUM",
    recommendedElo: 1250,
    tags: "react, cleanup, event-listener, useEffect",
    code: `useEffect(() => {
  window.addEventListener("resize", onResize);
}, [onResize]);`,
    question:
      "Explique o vazamento presente no componente e como impedir que listeners antigos continuem ativos.",
    solution:
      "Cada alteração em onResize registra um novo listener. Retorne uma função de cleanup que execute removeEventListener com a mesma referência.",
    createdAt: new Date("2026-01-12T12:00:00.000Z"),
    updatedAt: new Date("2026-01-12T12:00:00.000Z"),
  },
];

function cloneChallenge(challenge: MockChallenge, attempts: MockAttempt[]) {
  return {
    ...challenge,
    attempts: attempts
      .filter((attempt) => attempt.challengeId === challenge.id)
      .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
      .map(({ id, score, eloChange, createdAt }) => ({ id, score, eloChange, createdAt })),
  };
}

function getFeedback(solution: string): FeedbackPayload {
  return {
    score: 8,
    summary: "Diagnóstico registrado no modo mock. A resposta usa um feedback local previsível para você desenvolver a interface sem banco.",
    strengths: ["Relacionou o comportamento ao ciclo de renderização.", "Apontou uma correção viável para o componente."],
    blindspots: ["Compare a solução com dependências e closures antes de enviar.", "No modo integrado, este feedback poderá ser substituído pela IA configurada."],
    seniorSolution: solution,
  };
}

function calculateEloDelta(score: number) {
  return score >= 8 ? 10 + (score - 8) * 5 : score >= 5 ? 2 + (score - 5) * 1.5 : -15 + score * 2.5;
}

export function createMockTrainingStore() {
  let user = {
    id: MOCK_USER_ID,
    name: "Treinador local",
    bio: "Modo mock: dados locais para desenvolver telas sem PostgreSQL.",
    image: null as string | null,
    email: "mock@kodan.local",
    emailVerified: true,
    elo: 1200,
    createdAt: new Date("2026-01-01T12:00:00.000Z"),
    updatedAt: new Date("2026-01-01T12:00:00.000Z"),
  };
  let attempts: MockAttempt[] = [];

  return {
    getCurrentUser: () => ({ ...user }),
    updateUser: (input: { name: string; bio?: string; image?: string | null }) => {
      user = { ...user, name: input.name, ...(input.bio !== undefined ? { bio: input.bio } : {}), ...(input.image !== undefined ? { image: input.image } : {}), updatedAt: new Date() };
      return { ...user };
    },
    listChallenges: ({ limit, offset }: { limit: number; offset: number }) => ({
      items: mockChallenges.slice(offset, offset + limit).map((challenge) => cloneChallenge(challenge, attempts)),
      total: mockChallenges.length,
    }),
    getChallengeById: (id: string) => {
      const challenge = mockChallenges.find((item) => item.id === id);
      return challenge ? cloneChallenge(challenge, attempts) : null;
    },
    listAttempts: () => attempts.map((attempt) => ({ ...attempt, challenge: { ...attempt.challenge } })),
    submitAttempt: (challengeId: string, input: { userAnswer: string; usedHint?: boolean }) => {
      const challenge = mockChallenges.find((item) => item.id === challengeId);
      if (!challenge) throw new Error("Desafio não encontrado");

      const isFirstAttempt = !attempts.some((attempt) => attempt.challengeId === challengeId);
      const feedback = getFeedback(challenge.solution);
      const score = feedback.score;
      let eloChange = isFirstAttempt ? Math.round(calculateEloDelta(score)) : 0;
      if (input.usedHint && eloChange > 7) eloChange = 7;
      const newElo = isFirstAttempt ? Math.max(100, user.elo + eloChange) : user.elo;
      user = { ...user, elo: newElo, updatedAt: new Date() };
      attempts = [{ id: `mock-attempt-${attempts.length + 1}`, userId: user.id, challengeId, userAnswer: input.userAnswer, feedbackJson: JSON.stringify(feedback), score, eloChange, createdAt: new Date(), challenge }, ...attempts];

      return { score, eloChange, newElo, isFirstAttempt, feedback };
    },
  };
}

export const mockTrainingStore = createMockTrainingStore();
