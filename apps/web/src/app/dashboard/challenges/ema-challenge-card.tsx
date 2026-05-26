import * as React from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@CC/ui/components/button";
import { eloToDanRank } from "@/lib/rating";

export interface Attempt {
  id: string;
  score: number;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  tags: string;
  attempts: Attempt[];
}

export const getDifficultyColor = (diff: string) => {
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
};

export const getDifficultyLabel = (diff: string) => {
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
};

export const getStatusLabel = (attempts: Attempt[]) => {
  if (attempts.length === 0) return "Não iniciado";
  const lastAttempt = attempts[0];
  if (lastAttempt.score >= 5) return "Resolvido";
  return "Falhou";
};

export const getLevelCompatibility = (recommendedElo: number, userElo: number) => {
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
};

interface EmaChallengeCardProps {
  challenge: Challenge;
  matched: boolean;
  isHovered: boolean;
  setHoveredId: (id: string | null) => void;
  userElo: number;
}

export function EmaChallengeCard({
  challenge,
  matched,
  isHovered,
  setHoveredId,
  userElo,
}: EmaChallengeCardProps) {
  const compatibility = getLevelCompatibility(challenge.recommendedElo, userElo);
  const hasAttempt = challenge.attempts.length > 0;
  const resolved = hasAttempt && challenge.attempts[0].score >= 5;
  const nodeDanRank = eloToDanRank(challenge.recommendedElo);

  return (
    <div
      className={`challenge-card w-[260px] border-2 border-border/80 bg-card/95 p-4 pt-5 pb-3.5 relative flex flex-col justify-between transition-all duration-500 ease-in-out hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_0_15px_rgba(76,124,99,0.08)] rounded-none cursor-pointer ${
        matched
          ? "opacity-100 filter-none"
          : "opacity-20 blur-[1.5px] pointer-events-none select-none"
      }`}
      onMouseEnter={() => setHoveredId(challenge.id)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("a") || target.closest("button")) {
          return;
        }
        setHoveredId(isHovered ? null : challenge.id);
      }}
    >
      {/* Visual Hanging String and Hole for Ema plaque effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        <div className={`w-0.5 h-3 transition-colors duration-500 ${matched ? "bg-border/60" : "bg-border/20"}`} />
        <div className="size-1.5 rounded-full border border-border/80 bg-background" />
      </div>

      {/* Challenge Title */}
      <Link
        href={`/dashboard/train/${challenge.id}`}
        className="text-xs font-serif font-bold text-foreground hover:text-primary transition-colors hover:underline line-clamp-2 min-h-[32px] text-center"
      >
        {challenge.title}
      </Link>

      {/* Card Footer (Difficulty & Diagnose Button) */}
      <div className="flex items-center justify-between border-t border-border/40 pt-2.5 mt-2">
        <span
          className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded-none uppercase ${getDifficultyColor(
            challenge.difficulty
          )}`}
        >
          {getDifficultyLabel(challenge.difficulty)}
        </span>

        <Link href={`/dashboard/train/${challenge.id}`}>
          <Button
            size="sm"
            className="h-6 gap-1 rounded-none text-[9px] font-mono uppercase bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 transition-all shadow-[1px_1px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none"
          >
            <Play className="size-2 fill-current" />
            Treinar
          </Button>
        </Link>
      </div>

      {/* Clean Fading Tooltip/Popover with Progressive Disclosure */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-card border-2 border-border/90 p-3.5 z-50 pointer-events-none transition-all duration-300 rounded-none shadow-[3px_3px_0px_rgba(0,0,0,0.08)] flex flex-col gap-2 ${
          isHovered
            ? "opacity-100 translate-y-0 scale-100 visible"
            : "opacity-0 translate-y-2 scale-95 invisible"
        }`}
      >
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono pb-1 border-b border-border/40">
          Detalhes do Desafio
        </div>
        
        <div className="text-2xs font-mono text-foreground space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recomendado:</span>
            <span className="font-bold text-foreground">ELO {challenge.recommendedElo} ({nodeDanRank.kanji})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status atual:</span>
            <span className="font-bold text-foreground">{getStatusLabel(challenge.attempts)}</span>
          </div>
          {compatibility ? (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Nível:</span>
              <span className={compatibility.className}>{compatibility.label}</span>
            </div>
          ) : null}
        </div>

        {/* Tooltip Tags */}
        <div className="flex flex-wrap gap-1 mt-1 border-t border-border/40 pt-2">
          {challenge.tags.split(",").map(tag => (
            <span
              key={tag}
              className="bg-secondary/60 border border-border/40 text-[9px] font-mono px-1.5 py-0.5 text-muted-foreground uppercase"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
        
        {/* Arrow indicator at the bottom center of the tooltip */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-border" />
      </div>
    </div>
  );
}
