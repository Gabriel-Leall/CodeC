export interface Attempt {
  id: string;
  score: number;
}

type ChallengeStatusPresentation = {
  badgeClassName: string;
  label: string;
  note: string;
};

export interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  tags: string;
  attempts: Attempt[];
}

export function getDifficultyColor(diff: string) {
  switch (diff) {
    case "EASY":
      return "border-emerald-800/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400";
    case "MEDIUM":
      return "border-amber-800/30 bg-amber-500/10 text-amber-800 dark:text-amber-400";
    case "HARD":
      return "border-rose-800/30 bg-rose-500/10 text-rose-800 dark:text-rose-400";
    default:
      return "border-muted/30 bg-muted/10 text-muted-foreground";
  }
}

export function getDifficultyLabel(diff: string) {
  switch (diff) {
    case "EASY":
      return "Fácil";
    case "MEDIUM":
      return "Médio";
    case "HARD":
      return "Difícil";
    default:
      return diff;
  }
}

export function getStatusLabel(attempts: Attempt[]) {
  if (attempts.length === 0) return "Não iniciado";
  const lastAttempt = attempts[0];
  if (lastAttempt.score >= 5) return "Resolvido";
  return "Falhou";
}

export function getStatusPresentation(attempts: Attempt[]): ChallengeStatusPresentation {
  if (attempts.length === 0) {
    return {
      label: "Intacto",
      note: "Sem tentativas registradas",
      badgeClassName:
        "border-[color:var(--zen-border)] bg-[color:color-mix(in_oklch,var(--zen-ink)_4%,transparent)] text-[color:var(--zen-muted)] dark:border-border/60 dark:text-muted-foreground",
    };
  }

  const lastAttempt = attempts[0];
  if (lastAttempt.score >= 5) {
    return {
      label: "Resolvido",
      note: "Última leitura fechou o diagnóstico",
      badgeClassName:
        "border-emerald-800/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400",
    };
  }

  return {
    label: "Revisar",
    note: "Há uma tentativa que ainda pede ajuste",
    badgeClassName:
      "border-amber-800/30 bg-amber-500/10 text-amber-800 dark:text-amber-400",
  };
}

export function getLevelCompatibility(recommendedElo: number, userElo: number) {
  const delta = recommendedElo - userElo;
  if (delta <= 150) {
    return {
      label: "Compatível",
      className:
        "inline-flex items-center border px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold border-emerald-800/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-400",
    };
  }

  if (delta > 200) {
    return {
      label: "Avançado",
      className:
        "inline-flex items-center gap-0.5 border px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold border-amber-800/30 bg-amber-500/10 text-amber-800 dark:text-amber-400",
    };
  }

  return null;
}
