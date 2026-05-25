"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Circle,
  Play,
  Loader2,
  GraduationCap,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@CC/ui/components/button";
import { Input } from "@CC/ui/components/input";
import { getChallenges } from "../actions";

interface Attempt {
  id: string;
  score: number;
}

interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  tags: string;
  attempts: Attempt[];
}

const PAGE_SIZE = 15;

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [userElo, setUserElo] = useState(1200);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInitialChallenges = async () => {
      try {
        const res = await getChallenges({ limit: PAGE_SIZE, offset: 0 });
        if (res.success && res.data) {
          setChallenges(res.data.items as Challenge[]);
          setHasMore(res.data.hasMore);
          setUserElo(res.data.userElo);
        } else {
          toast.error(res.error || "Erro ao carregar desafios");
        }
      } catch {
        toast.error("Erro ao conectar ao servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialChallenges();
  }, []);

  const loadMoreChallenges = async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    try {
      const res = await getChallenges({ limit: PAGE_SIZE, offset: challenges.length });
      if (res.success && res.data) {
        setChallenges(prev => [...prev, ...(res.data.items as Challenge[])]);
        setHasMore(res.data.hasMore);
      } else {
        toast.error(res.error || "Erro ao carregar mais desafios");
      }
    } catch {
      toast.error("Erro ao conectar ao servidor");
    } finally {
      setLoadingMore(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "MEDIUM":
        return "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "HARD":
        return "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
      default:
        return "border-muted/30 bg-muted/10 text-muted-foreground";
    }
  };

  const getDifficultyLabel = (diff: string) => {
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

  const getStatusIcon = (attempts: Attempt[]) => {
    if (attempts.length === 0) {
      return (
        <span title="Não iniciado">
          <Circle className="size-4 text-muted-foreground/60" />
        </span>
      );
    }

    const lastAttempt = attempts[0];
    if (lastAttempt.score >= 5) {
      return (
        <span title="Resolvido">
          <CheckCircle2 className="size-4 text-emerald-500" />
        </span>
      );
    }

    return (
      <span title="Falhou (Nota < 5)">
        <XCircle className="size-4 text-rose-500" />
      </span>
    );
  };

  const getStatusLabel = (attempts: Attempt[]) => {
    if (attempts.length === 0) return "Não iniciado";
    const lastAttempt = attempts[0];
    if (lastAttempt.score >= 5) return "Resolvido";
    return "Falhou";
  };

  const getLevelCompatibility = (recommendedElo: number) => {
    const delta = recommendedElo - userElo;
    if (delta <= 150) {
      return {
        label: "Nível Compatível",
        className:
          "inline-flex items-center border px-2 py-0.5 text-[10px] font-mono uppercase font-bold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    }

    if (delta > 200) {
      return {
        label: "Desafio Avançado para o seu Rating",
        className:
          "inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-mono uppercase font-bold border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    }

    return null;
  };

  const filtered = challenges.filter(ch => {
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.tags.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      filterDifficulty === "ALL" || ch.difficulty === filterDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="flex-1 w-full bg-background/50 px-4 py-8 md:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-border pb-6">
        <h1 className="text-xl font-bold tracking-tight">Diretório de Desafios</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Explore o repositório de exercícios de leitura e diagnóstico React.
        </p>
        <p className="text-[10px] font-mono text-muted-foreground mt-2">Seu Rating Atual: {userElo} ELO</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar desafios por título ou tag (ex: useEffect)..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 items-center w-full md:w-auto">
          <span className="text-xs text-muted-foreground mr-1.5 flex items-center gap-1 font-medium">
            <Filter className="size-3" /> Dificuldade:
          </span>
          {(["ALL", "EASY", "MEDIUM", "HARD"] as const).map(diff => (
            <Button
              key={diff}
              variant={filterDifficulty === diff ? "default" : "outline"}
              size="xs"
              onClick={() => setFilterDifficulty(diff)}
              className="h-7 text-3xs font-mono uppercase"
            >
              {diff === "ALL" ? "Todos" : getDifficultyLabel(diff)}
            </Button>
          ))}
        </div>
      </div>

      <div className="border border-border bg-card">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Buscando repositório de desafios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <GraduationCap className="size-8 text-muted-foreground mb-3 opacity-60" />
            <h3 className="text-sm font-semibold">Nenhum desafio correspondente</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Não há exercícios com os critérios de filtragem selecionados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filtered.map(challenge => {
              const compatibility = getLevelCompatibility(challenge.recommendedElo);

              return (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div className="shrink-0">
                      {getStatusIcon(challenge.attempts)}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/train/${challenge.id}`}
                          className="text-xs font-semibold hover:text-primary hover:underline truncate"
                        >
                          {challenge.title}
                        </Link>

                        <span className={`inline-flex items-center border px-2 py-0.5 text-4xs font-mono uppercase font-bold rounded-none ${getDifficultyColor(challenge.difficulty)}`}>
                          {getDifficultyLabel(challenge.difficulty)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-3xs text-muted-foreground font-mono">
                        <span>Recomendado: ELO {challenge.recommendedElo}</span>
                        <span>•</span>
                        <span>Status: {getStatusLabel(challenge.attempts)}</span>
                        {compatibility ? (
                          <>
                            <span>•</span>
                            <span className={compatibility.className}>
                              {compatibility.label.includes("Avançado") ? <AlertTriangle className="size-3" /> : null}
                              {compatibility.label}
                            </span>
                          </>
                        ) : null}
                        <span>•</span>
                        <div className="flex gap-1.5">
                          {challenge.tags.split(",").map(tag => (
                            <span key={tag} className="bg-muted/40 px-1 border border-border/40 text-[10px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link href={`/dashboard/train/${challenge.id}`}>
                      <Button size="sm" className="h-8 gap-1 rounded-none text-2xs font-mono uppercase">
                        <Play className="size-3 fill-current" />
                        Treinar
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!loading && hasMore ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMoreChallenges}
            disabled={loadingMore}
            className="h-8 rounded-none font-mono uppercase text-xs"
          >
            {loadingMore ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                Carregando...
              </>
            ) : (
              "Carregar Mais"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
