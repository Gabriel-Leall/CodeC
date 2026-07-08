import type { ProfileViewModel } from "./profile-types";

export function clampProficiency(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getProfileRankLabel(elo: number) {
  if (elo >= 1850) {
    return "SENSEI";
  }

  if (elo >= 1550) {
    return "RONIN";
  }

  return "KYU";
}

export function buildStaticProfileViewModel(): ProfileViewModel {
  return {
    user: {
      id: "local-nakamura",
      name: "Nakamura",
      image: "/avatar-nakamura.png",
      planLabel: "PRO",
      tagline: "Código com clareza. Diagnose com precisão. Ascenda.",
      memberSinceLabel: "Membro desde 12/2023",
      countryLabel: "Brasil",
      timezoneLabel: "Fuso horário: BRT",
      rank: getProfileRankLabel(1687),
      elo: 1687,
      topPercentLabel: "Top 12%",
    },
    stats: [
      { id: "resolved", label: "Desafios resolvidos", value: "142" },
      { id: "streak", label: "Sequência atual", value: "27 dias", accent: "warning" },
      { id: "accuracy", label: "Taxa de acerto", value: "87%" },
      { id: "study-hours", label: "Horas de estudo", value: "86 h" },
      { id: "attempts", label: "Tentativas de desafios", value: "312" },
    ],
    eloSeries: [
      { dateLabel: "5 Mai", elo: 1298 },
      { dateLabel: "7 Mai", elo: 1342 },
      { dateLabel: "9 Mai", elo: 1328 },
      { dateLabel: "12 Mai", elo: 1518 },
      { dateLabel: "14 Mai", elo: 1472 },
      { dateLabel: "16 Mai", elo: 1510 },
      { dateLabel: "19 Mai", elo: 1624 },
      { dateLabel: "21 Mai", elo: 1582 },
      { dateLabel: "23 Mai", elo: 1610 },
      { dateLabel: "26 Mai", elo: 1704 },
      { dateLabel: "28 Mai", elo: 1648 },
      { dateLabel: "30 Mai", elo: 1686 },
      { dateLabel: "2 Jun", elo: 1687 },
    ],
    topicMastery: [
      { topicId: "effects-lifecycle", label: "Effects & Lifecycle", proficiency: clampProficiency(92) },
      { topicId: "state-rendering", label: "State & Rendering", proficiency: clampProficiency(85) },
      { topicId: "async-races", label: "Async UI & Races", proficiency: clampProficiency(78) },
      { topicId: "forms-validation", label: "Forms & Validation", proficiency: clampProficiency(74) },
      { topicId: "component-patterns", label: "Component Patterns", proficiency: clampProficiency(70) },
    ],
    recentSessions: [
      { id: "s1", dateLabel: "02 Jun, 2024", challenge: "Dependências do useEffect", difficulty: "MEDIUM", result: "resolved", eloChange: 20 },
      { id: "s2", dateLabel: "01 Jun, 2024", challenge: "Cleanup Functions", difficulty: "MEDIUM", result: "resolved", eloChange: 18 },
      { id: "s3", dateLabel: "31 Mai, 2024", challenge: "Stale Closures", difficulty: "HARD", result: "resolved", eloChange: 22 },
      { id: "s4", dateLabel: "30 Mai, 2024", challenge: "Race conditions em fetch", difficulty: "HARD", result: "in_progress", eloChange: null },
      { id: "s5", dateLabel: "29 Mai, 2024", challenge: "Composição de Handlers", difficulty: "MEDIUM", result: "not_started", eloChange: null },
    ],
    recommendations: [
      { id: "r1", challenge: "AbortController em Fetch", topic: "Async UI & Races", difficulty: "MEDIUM", possibleElo: 18 },
      { id: "r2", challenge: "useTransition na prática", topic: "State & Rendering", difficulty: "MEDIUM", possibleElo: 18 },
      { id: "r3", challenge: "Validação assíncrona", topic: "Forms & Validation", difficulty: "MEDIUM", possibleElo: 16 },
      { id: "r4", challenge: "Debounce e Cancelamento", topic: "Async UI & Races", difficulty: "HARD", possibleElo: 22 },
      { id: "r5", challenge: "Tipagem de eventos", topic: "Type System", difficulty: "MEDIUM", possibleElo: 16 },
    ],
    achievements: [
      { id: "a1", title: "Foco Sustentado", description: "Estude por 20 dias consecutivos", unlockedAtLabel: "Desbloqueado em 02 Jun", tone: "blue" },
      { id: "a2", title: "Diagnóstico Afiado", description: "Resolva 100 desafios", unlockedAtLabel: "Desbloqueado em 28 Mai", tone: "green" },
      { id: "a3", title: "React Avançado", description: "Complete 10 desafios difíceis", unlockedAtLabel: "Desbloqueado em 21 Mai", tone: "orange" },
      { id: "a4", title: "Mestre em Effects", description: "Resolva 25 desafios de Effects", unlockedAtLabel: "Desbloqueado em 15 Mai", tone: "indigo" },
    ],
  };
}
