"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  TrendingUp,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Trophy,
  History,
  Code,
} from "lucide-react";

import { Button } from "@CC/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@CC/ui/components/card";

import { getAttemptsHistory, getLocalUser } from "./actions";

interface Attempt {
  id: string;
  createdAt: Date;
  score: number;
  eloChange: number;
  challenge: {
    title: string;
    difficulty: string;
  };
}

interface ChartPoint {
  elo: number;
  title: string;
  date: string;
  change: number;
}

const INITIAL_ELO = 1200;

export default function Dashboard() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [userElo, setUserElo] = useState(INITIAL_ELO);
  const [userName, setUserName] = useState("Estudante");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, historyRes] = await Promise.all([
          getLocalUser(),
          getAttemptsHistory(),
        ]);

        if (userRes.success && userRes.data) {
          setUserElo(userRes.data.elo);
          setUserName(userRes.data.name);
        }

        if (historyRes.success && historyRes.data) {
          const mapped = historyRes.data.map(item => ({
            ...item,
            createdAt: new Date(item.createdAt),
          }));
          setAttempts(mapped);
        } else {
          toast.error(historyRes.error || "Erro ao buscar histórico");
        }
      } catch {
        toast.error("Erro ao carregar dados do painel");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const chartPoints = useMemo(() => buildChartPoints(attempts), [attempts]);
  const showChart = attempts.length >= 2 && chartPoints.length >= 3;
  const todayLabel = useMemo(
    () => new Date().toLocaleDateString("pt-BR"),
    []
  );

  return (
    <div className="flex-1 w-full bg-background/50 px-4 py-8 md:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <DashboardHeader
        userElo={userElo}
        userName={userName}
        todayLabel={todayLabel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EloTrendCard
          loading={loading}
          showChart={showChart}
          chartPoints={chartPoints}
        />
        <TrainingCtaCard />
      </div>

      <RecentActivitiesCard loading={loading} attempts={attempts} />
    </div>
  );
}

function DashboardHeader({
  userElo,
  userName,
  todayLabel,
}: {
  userElo: number;
  userName: string;
  todayLabel: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
      <div className="flex items-center gap-4">
        <div className="size-12 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary rounded-none font-bold text-lg">
          {userName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{userName}</h1>
          <p className="text-2xs text-muted-foreground mt-0.5 font-mono">
            Usuário Local Padrão • Cadastro: {todayLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card border border-border p-3 px-6 rounded-none">
        <Trophy className="size-5 text-amber-500 shrink-0" />
        <div>
          <div className="text-2xs uppercase tracking-wider text-muted-foreground font-semibold">
            Seu Rating Atual
          </div>
          <div className="text-xl font-mono font-bold text-foreground mt-0.5">
            {userElo} ELO
          </div>
        </div>
      </div>
    </div>
  );
}

function EloTrendCard({
  loading,
  showChart,
  chartPoints,
}: {
  loading: boolean;
  showChart: boolean;
  chartPoints: ChartPoint[];
}) {
  return (
    <Card className="lg:col-span-2 border-border rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="size-4 text-primary" />
          Gráfico de Tendência ELO
        </CardTitle>
        <CardDescription className="text-3xs">
          Sua evolução técnica baseada nas últimas tentativas corrigidas.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-48 flex items-center justify-center">
        {loading ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : showChart ? (
          <EloTrendSvg chartPoints={chartPoints} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 gap-2 border border-dashed border-border/80 w-full h-full bg-muted/5">
            <TrendingUp className="size-6 text-muted-foreground/60 stroke-dasharray-[2_2]" />
            <p className="text-2xs font-semibold text-foreground">
              Progresso indisponível
            </p>
            <p className="text-3xs text-muted-foreground max-w-xs">
              Realize pelo menos 2 tentativas em desafios para visualizar seu
              gráfico de tendência ELO.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EloTrendSvg({ chartPoints }: { chartPoints: ChartPoint[] }) {
  const width = 600;
  const height = 180;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 20;

  const elos = chartPoints.map(p => p.elo);
  const maxElo = Math.max(...elos, 1250);
  const minElo = Math.max(100, Math.min(...elos, 1150));
  const eloRange = maxElo - minElo || 100;
  const pointsCount = chartPoints.length;

  const coordinates = chartPoints.map((point, index) => {
    const x =
      paddingLeft +
      (index / (pointsCount - 1)) * (width - paddingLeft - paddingRight);
    const y =
      height -
      paddingBottom -
      ((point.elo - minElo) / eloRange) * (height - paddingTop - paddingBottom);
    return { x, y, elo: point.elo, change: point.change };
  });

  let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;
  for (let i = 1; i < coordinates.length; i++) {
    pathD += ` L ${coordinates[i].x} ${coordinates[i].y}`;
  }

  const areaD = `${pathD} L ${coordinates[coordinates.length - 1].x} ${
    height - paddingBottom
  } L ${coordinates[0].x} ${height - paddingBottom} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full font-mono text-[9px] text-muted-foreground select-none"
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(var(--primary))"
            stopOpacity="0.25"
          />
          <stop
            offset="100%"
            stopColor="oklch(var(--primary))"
            stopOpacity="0.0"
          />
        </linearGradient>
      </defs>

      {[0, 0.5, 1].map((val, idx) => {
        const eloVal = Math.round(minElo + val * eloRange);
        const y = height - paddingBottom - val * (height - paddingTop - paddingBottom);
        return (
          <g key={idx} className="opacity-40">
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="oklch(var(--border))"
              strokeDasharray="3 3"
            />
            <text x={10} y={y + 3} fill="currentColor" className="font-bold">
              {eloVal}
            </text>
          </g>
        );
      })}

      <path d={areaD} fill="url(#chartGrad)" />
      <path
        d={pathD}
        fill="none"
        stroke="oklch(var(--primary))"
        strokeWidth="2"
        className="animate-in fade-in duration-300"
      />

      {coordinates.map((coord, idx) => (
        <g key={idx} className="group/node">
          <circle
            cx={coord.x}
            cy={coord.y}
            r={3.5}
            fill="oklch(var(--background))"
            stroke="oklch(var(--primary))"
            strokeWidth={2}
          />
          <g className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-150 pointer-events-none">
            <rect
              x={Math.max(5, coord.x - 60)}
              y={coord.y - 32}
              width={120}
              height={24}
              fill="oklch(var(--card))"
              stroke="oklch(var(--border))"
              strokeWidth={1}
            />
            <text
              x={coord.x}
              y={coord.y - 18}
              textAnchor="middle"
              className="fill-foreground font-bold text-[8px]"
            >
              ELO: {coord.elo} ({coord.change >= 0 ? `+${coord.change}` : coord.change})
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}

function TrainingCtaCard() {
  return (
    <Card className="border-border rounded-none flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Brain className="size-4 text-primary" />
          Comece a Treinar
        </CardTitle>
        <CardDescription className="text-3xs">
          Pratique interpretação técnica e suba de nível na leitura de código
          React.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex-1 flex flex-col justify-end">
        <div className="text-2xs flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-1.5 bg-emerald-500 rounded-full" />
            <span>Excelente (&gt;=8): ganha +10 a +20 de ELO</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-1.5 bg-blue-500 rounded-full" />
            <span>Parcial (5 a 7): ganha +2 a +5 de ELO</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="size-1.5 bg-rose-500 rounded-full" />
            <span>Crítico (&lt;5): perde -5 a -15 de ELO</span>
          </div>
        </div>

        <Link href="/dashboard/challenges" className="w-full pt-4 block">
          <Button className="w-full h-9 rounded-none font-mono uppercase text-xs">
            <Code className="size-3.5 mr-2" />
            Explorar Desafios
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function RecentActivitiesCard({
  loading,
  attempts,
}: {
  loading: boolean;
  attempts: Attempt[];
}) {
  return (
    <Card className="border-border rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
        <div>
          <CardTitle className="text-xs uppercase tracking-wider flex items-center gap-1.5">
            <History className="size-4 text-primary" />
            Atividades Recentes
          </CardTitle>
          <CardDescription className="text-3xs">
            Log das últimas tentativas enviadas e seus respectivos feedbacks de
            IA.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-12 text-2xs text-muted-foreground">
            Você ainda não realizou nenhuma tentativa. Vá para a página de
            desafios para iniciar!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-2xs">
              <thead>
                <tr className="bg-muted/30 border-b border-border font-semibold text-muted-foreground">
                  <th className="p-3">Desafio</th>
                  <th className="p-3">Dificuldade</th>
                  <th className="p-3 text-right">Nota IA</th>
                  <th className="p-3 text-right">Variação ELO</th>
                  <th className="p-3 text-right">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {attempts.map(attempt => (
                  <tr key={attempt.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-3 font-medium text-foreground">
                      {attempt.challenge.title}
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-mono">
                        {getDifficultyLabel(attempt.challenge.difficulty)}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-foreground">
                      {attempt.score.toFixed(1)}/10
                    </td>
                    <td className="p-3 text-right font-mono">
                      {attempt.eloChange >= 0 ? (
                        <span className="text-emerald-500 font-bold inline-flex items-center gap-0.5">
                          <ArrowUpRight className="size-3" />+{attempt.eloChange}
                        </span>
                      ) : (
                        <span className="text-rose-500 font-bold inline-flex items-center gap-0.5">
                          <ArrowDownRight className="size-3" />
                          {attempt.eloChange}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground">
                      {attempt.createdAt.toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function buildChartPoints(attempts: Attempt[]): ChartPoint[] {
  if (attempts.length === 0) {
    return [];
  }

  const chronological = attempts.toSorted(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
  );
  let current = INITIAL_ELO;

  const eloPoints = chronological.map(attempt => {
    current = Math.max(100, current + attempt.eloChange);
    return {
      elo: current,
      title: attempt.challenge.title,
      date: attempt.createdAt.toLocaleDateString("pt-BR"),
      change: attempt.eloChange,
    };
  });

  return [
    { elo: INITIAL_ELO, title: "Cadastro", date: "Início", change: 0 },
    ...eloPoints,
  ];
}

function getDifficultyLabel(diff: string) {
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
