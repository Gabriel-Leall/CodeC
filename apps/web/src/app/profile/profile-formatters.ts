import type { ProfileDifficulty, ProfileSessionStatus } from "./profile-types";

const PT_BR_INTEGER = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

export function formatInteger(value: number) {
  return PT_BR_INTEGER.format(value);
}

export function formatSignedElo(value: number | null) {
  if (value === null) {
    return "—";
  }

  return value > 0 ? `+${value}` : `${value}`;
}

export function formatDifficultyLabel(difficulty: ProfileDifficulty) {
  if (difficulty === "EASY") {
    return "Fácil";
  }

  if (difficulty === "MEDIUM") {
    return "Média";
  }

  if (difficulty === "HARD") {
    return "Difícil";
  }

  throw new Error(`Unsupported profile difficulty: ${difficulty}`);
}

export function formatSessionStatusLabel(status: ProfileSessionStatus) {
  if (status === "resolved") {
    return "Resolvido";
  }

  if (status === "in_progress") {
    return "Em progresso";
  }

  if (status === "not_started") {
    return "Não iniciado";
  }

  throw new Error(`Unsupported profile session status: ${status}`);
}
