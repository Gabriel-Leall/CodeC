"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Loader2,
  History,
  Layers3,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { ZenToast } from "@kodan/ui/components/zen";



import { getAttemptsHistory, getLocalUser, updateLocalUserProfile } from "./actions";

interface Attempt {
  id: string;
  createdAt: Date;
  score: number;
  eloChange: number;
  challenge: {
    title: string;
    difficulty: string;
    tags: string;
  };
}

interface ChartPoint {
  elo: number;
  title: string;
  date: string;
  change: number;
}

interface TechRating {
  technology: string;
  elo: number;
  level: string;
  attempts: number;
}

const INITIAL_ELO = 1200;
const INITIAL_TECH_ELO = 1000;
type ZenToastTone = "success" | "error" | "warning" | "info";
type ZenToastState = {
  open: boolean;
  tone: ZenToastTone;
  title: string;
  message: string;
};

function zenToastReducer(state: ZenToastState, action: { type: "show"; tone: ZenToastTone; title: string; message: string } | { type: "hide" }): ZenToastState {
  if (action.type === "hide") {
    return { ...state, open: false };
  }
  return {
    open: true,
    tone: action.tone,
    title: action.title,
    message: action.message,
  };
}

// react-doctor-disable-next-line react-doctor/prefer-useReducer
export default function Profile() {
  const { refresh } = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [userElo, setUserElo] = useState(INITIAL_ELO);
  const [userName, setUserName] = useState("Estudante");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("Estudante");
  const [editingName, setEditingName] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [zenToast, dispatchZenToast] = useReducer(zenToastReducer, {
    open: false,
    tone: "info",
    title: "Aviso",
    message: "",
  });

  const showZenToast = (tone: ZenToastTone, title: string, message: string) => {
    dispatchZenToast({ type: "hide" });
    window.setTimeout(() => dispatchZenToast({ type: "show", tone, title, message }), 20);
    window.setTimeout(() => dispatchZenToast({ type: "hide" }), 3200);
  };

  useEffect(() => {
    void Promise.all([getLocalUser(), getAttemptsHistory()])
      .then(([userRes, historyRes]) => {
        if (userRes.success && userRes.data) {
          setUserElo(userRes.data.elo);
          setUserName(userRes.data.name);
          setNameInput(userRes.data.name);
          setUserImage(userRes.data.image);
        }

        if (historyRes.success && historyRes.data) {
          setAttempts(
            historyRes.data.map(item => ({
              ...item,
              createdAt: new Date(item.createdAt),
            }))
          );
          return;
        }

        showZenToast("error", "Falha ao carregar", historyRes.error || "Erro ao buscar histórico");
      })
      .catch(() => {
        showZenToast("error", "Falha ao carregar", "Erro ao carregar dados do painel");
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  const chartPoints = useMemo(() => buildChartPoints(attempts), [attempts]);
  const techRatings = useMemo(() => buildTechRatings(attempts), [attempts]);
  const showChart = attempts.length >= 2 && chartPoints.length >= 3;

  const saveName = async () => {
    setSavingName(true);
    await updateLocalUserProfile({
        name: nameInput,
      })
      .then(res => {
        if (!res.success || !res.data) {
          showZenToast("error", "Falha ao atualizar", res.error || "Erro ao atualizar perfil");
          return;
        }

        setUserName(res.data.name);
        setNameInput(res.data.name);
        setEditingName(false);
        showZenToast("success", "Perfil atualizado", "Nome atualizado com sucesso.");
        refresh();
      })
      .catch(() => {
        showZenToast("error", "Falha ao atualizar", "Erro ao atualizar nome");
      })
      .then(() => {
        setSavingName(false);
      });
  };

  const onSelectProfileImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showZenToast("warning", "Arquivo inválido", "Selecione um arquivo de imagem");
      return;
    }

    if (file.size > 1_500_000) {
      showZenToast("warning", "Arquivo muito grande", "A imagem deve ter no máximo 1.5MB");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Erro ao ler imagem"));
      reader.readAsDataURL(file);
    });

    const previousImage = userImage;
    setUserImage(dataUrl);
    setUploadingPhoto(true);

    await updateLocalUserProfile({
        name: userName,
        image: dataUrl,
      })
      .then(res => {
        if (!res.success || !res.data) {
          setUserImage(previousImage);
          showZenToast("error", "Falha ao atualizar", res.error || "Erro ao atualizar foto");
          return;
        }

        setUserImage(res.data.image);
        showZenToast("success", "Perfil atualizado", "Foto atualizada com sucesso.");
        refresh();
      })
      .catch(() => {
        setUserImage(previousImage);
        showZenToast("error", "Falha ao atualizar", "Erro ao atualizar foto");
      })
      .then(() => {
        setUploadingPhoto(false);
      });
  };

  return (
    <div className="flex-1 w-full bg-transparent px-4 py-8 md:px-8 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="hidden"
        aria-label="Selecionar foto de perfil"
        onChange={event => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          void onSelectProfileImage(file);
          event.target.value = "";
        }}
      />

      <DashboardHeader
        userElo={userElo}
        userName={userName}
        userImage={userImage}
        nameInput={nameInput}
        editingName={editingName}
        savingName={savingName}
        uploadingPhoto={uploadingPhoto}
        onNameChange={setNameInput}
        onStartNameEdit={() => setEditingName(true)}
        onCancelNameEdit={() => {
          setNameInput(userName);
          setEditingName(false);
        }}
        onSaveName={() => void saveName()}
        onAvatarClick={() => fileInputRef.current?.click()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-border/20">
        <EloTrendCard
          loading={loading}
          showChart={showChart}
          chartPoints={chartPoints}
        />
        <TechStackRatingsCard loading={loading} ratings={techRatings} />
      </div>

      <RecentActivitiesCard loading={loading} attempts={attempts} />
      <div className="fixed bottom-4 right-4 z-[80]">
        <ZenToast open={zenToast.open} tone={zenToast.tone} title={zenToast.title}>
          {zenToast.message}
        </ZenToast>
      </div>
    </div>
  );
}

function DashboardHeader({
  userElo,
  userName,
  userImage,
  nameInput,
  editingName,
  savingName,
  uploadingPhoto,
  onNameChange,
  onStartNameEdit,
  onCancelNameEdit,
  onSaveName,
  onAvatarClick,
}: {
  userElo: number;
  userName: string;
  userImage: string | null;
  nameInput: string;
  editingName: boolean;
  savingName: boolean;
  uploadingPhoto: boolean;
  onNameChange: (value: string) => void;
  onStartNameEdit: () => void;
  onCancelNameEdit: () => void;
  onSaveName: () => void;
  onAvatarClick: () => void;
}) {
  const initials = userName
    .split(" ")
    .flatMap(part => {
      const initial = part.trim()[0];
      return initial ? [initial] : [];
    })
    .slice(0, 2)
    .join("")
    .toUpperCase() || "TC";
  const rankBadgeLabel = getKanjiRankLabel(userElo);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-6">
      <div className="flex items-center gap-4">
        {userImage ? (
          <button
            type="button"
            onClick={onAvatarClick}
            className="relative group size-16 rounded-full p-0.5 border border-foreground/20 hover:border-foreground/45 transition-colors flex items-center justify-center overflow-hidden shrink-0"
            style={{ borderRadius: "48.5% 51.5% 49.5% 50.5% / 50.5% 49.5% 51.5% 48.5%" }}
            aria-label="Trocar foto de perfil"
            title="Clique para trocar a foto"
          >
            <Image
              src={userImage}
              alt={`Foto de ${userName}`}
              width={64}
              height={64}
              unoptimized
              className="size-full object-cover rounded-full"
            />
            <span className="absolute inset-0 rounded-full bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center text-[10px] font-mono text-foreground font-semibold">
              {uploadingPhoto ? "..." : "Trocar"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onAvatarClick}
            className="relative group size-16 rounded-full p-0.5 border border-foreground/20 hover:border-foreground/45 transition-colors flex items-center justify-center bg-transparent shrink-0"
            style={{ borderRadius: "51.5% 48.5% 50.5% 49.5% / 49.5% 50.5% 48.5% 51.5%" }}
            aria-label="Adicionar foto de perfil"
            title="Clique para adicionar foto"
          >
            <div className="size-full rounded-full bg-foreground/[0.03] flex items-center justify-center text-foreground font-serif text-lg border border-dashed border-foreground/10 hover:bg-foreground/[0.06] transition-colors">
              {initials}
            </div>
          </button>
        )}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-mono font-semibold">
            Perfil
          </div>
          {editingName ? (
            <div className="mt-0.5 flex items-center gap-1.5">
              <input
                value={nameInput}
                onChange={event => onNameChange(event.target.value)}
                maxLength={60}
                className="h-8 w-[230px] bg-background border border-border px-2.5 text-xs outline-none focus:border-primary font-mono"
                aria-label="Editar nome de exibição"
              />
              <button
                type="button"
                onClick={onSaveName}
                disabled={savingName}
                className="size-8 border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary inline-flex items-center justify-center disabled:opacity-70 transition-colors"
                aria-label="Salvar nome"
              >
                {savingName ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              </button>
              <button
                type="button"
                onClick={onCancelNameEdit}
                className="size-8 border border-border hover:bg-muted/40 inline-flex items-center justify-center transition-colors"
                aria-label="Cancelar edição de nome"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold tracking-tight text-foreground">{userName}</h1>
              <button
                type="button"
                onClick={onStartNameEdit}
                className="size-7 border border-border/40 hover:bg-foreground/[0.03] inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-full"
                aria-label="Editar nome"
                title="Editar nome"
              >
                <Pencil className="size-3.5" />
              </button>
            </div>
          )}
          <p className="mt-0.5 font-serif text-sm tracking-wide text-muted-foreground/90">
            {rankBadgeLabel}
          </p>
          <p className="text-[10px] text-muted-foreground/80 mt-1 font-mono">
            Clique na foto para trocar.
          </p>
        </div>
      </div>

      <div className="text-left md:text-right shrink-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-mono font-semibold">
          Seu Rating Atual
        </div>
        <div className="text-3xl font-serif font-bold text-foreground mt-1 tracking-tight">
          {userElo} ELO
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
    <div className="lg:col-span-2 space-y-4">
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <TrendingUp className="size-4 text-primary" />
          Gráfico de Tendência ELO
        </h2>
        <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
          Sua evolução técnica baseada nas últimas tentativas corrigidas.
        </p>
      </div>
      <div className="h-48 flex items-center justify-center pt-2">
        {loading ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : showChart ? (
          <EloTrendSvg chartPoints={chartPoints} />
        ) : (
          <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-full">
            <p className="text-xs font-mono font-semibold text-foreground">
              Progresso indisponível
            </p>
            <p className="text-[10px] text-muted-foreground/80 font-mono max-w-xs">
              Realize pelo menos 2 tentativas em desafios para visualizar seu gráfico de tendência ELO.
            </p>
          </div>
        )}
      </div>
    </div>
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

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full font-mono text-[9px] text-muted-foreground select-none"
    >
      {[0, 0.5, 1].map((val, idx) => {
        const eloVal = Math.round(minElo + val * eloRange);
        const y = height - paddingBottom - val * (height - paddingTop - paddingBottom);
        return (
          <g key={idx} className="opacity-30">
            <line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="oklch(var(--border))"
              strokeWidth="0.75"
            />
            <text x={10} y={y + 3} fill="currentColor" className="font-mono">
              {eloVal}
            </text>
          </g>
        );
      })}

      <path
        d={pathD}
        fill="none"
        stroke="oklch(var(--foreground))"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-in fade-in duration-300"
      />

      {coordinates.map((coord, idx) => (
        <g key={idx} className="group/node">
          <circle
            cx={coord.x}
            cy={coord.y}
            r={2.5}
            fill="oklch(var(--foreground))"
          />
          <circle
            cx={coord.x}
            cy={coord.y}
            r={10}
            fill="transparent"
            className="cursor-pointer"
          />
          <g className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-150 pointer-events-none">
            <rect
              x={Math.max(5, coord.x - 60)}
              y={coord.y - 32}
              width={120}
              height={24}
              fill="oklch(var(--background))"
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

function TechStackRatingsCard({
  loading,
  ratings,
}: {
  loading: boolean;
  ratings: TechRating[];
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <Layers3 className="size-4 text-primary" />
          Tech Stack Ratings
        </h2>
        <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
          Rating específico por tecnologia com base no histórico de tentativas.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/20 text-muted-foreground/80 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2 text-left font-mono">Tecnologia</th>
                <th className="pb-2 text-center font-mono">Tentativas</th>
                <th className="pb-2 text-right font-mono">Nível/ELO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {ratings.map(rating => (
                <tr key={rating.technology} className="hover:bg-foreground/[0.01] transition-colors">
                  <td className="py-2.5 text-left font-semibold text-foreground">
                    {rating.technology}
                  </td>
                  <td className="py-2.5 text-center text-muted-foreground">
                    {rating.attempts}
                  </td>
                  <td className="py-2.5 text-right font-mono text-xs">
                    <span className="font-semibold text-foreground">{rating.level}</span>
                    <span className="ml-1.5 text-muted-foreground/80">({rating.elo} ELO)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
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
    <div className="space-y-4">
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <History className="size-4 text-primary" />
          Atividades Recentes
        </h2>
        <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
          Log das últimas tentativas enviadas e seus feedbacks de IA.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : attempts.length === 0 ? (
        <div className="py-6 text-xs text-muted-foreground/80 font-mono">
          Nenhuma atividade recente encontrada. Inicie um desafio para comecar.
        </div>
      ) : (
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-border/25 text-muted-foreground/80 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-2">Desafio</th>
                <th className="py-2.5 px-2">Dificuldade</th>
                <th className="py-2.5 px-2 text-right">Nota IA</th>
                <th className="py-2.5 px-2 text-right">Variação ELO</th>
                <th className="py-2.5 px-2 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {attempts.map(attempt => (
                <tr key={attempt.id} className="hover:bg-foreground/[0.01] transition-colors">
                  <td className="py-2.5 px-2 font-medium text-foreground">
                    {attempt.challenge.title}
                  </td>
                  <td className="py-2.5 px-2 text-muted-foreground text-[10px]">
                    {getDifficultyLabel(attempt.challenge.difficulty)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-bold text-foreground">
                    {attempt.score.toFixed(1)}/10
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    {attempt.eloChange >= 0 ? (
                      <span className="text-primary font-bold">
                        +{attempt.eloChange}
                      </span>
                    ) : (
                      <span className="text-destructive font-bold">
                        {attempt.eloChange}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right text-muted-foreground">
                    {attempt.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
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

function buildTechRatings(attempts: Attempt[]): TechRating[] {
  const ratings = new Map<string, { elo: number; attempts: number }>();

  for (const technology of ["React", "TypeScript"]) {
    ratings.set(technology, { elo: INITIAL_TECH_ELO, attempts: 0 });
  }

  for (const attempt of attempts) {
    for (const technology of inferTechnologies(attempt.challenge.tags)) {
      const current = ratings.get(technology) ?? {
        elo: INITIAL_TECH_ELO,
        attempts: 0,
      };
      ratings.set(technology, {
        elo: Math.max(100, current.elo + attempt.eloChange),
        attempts: current.attempts + 1,
      });
    }
  }

  return [...ratings.entries()]
    .map(([technology, rating]) => ({
      technology,
      elo: rating.elo,
      level: getTechLevel(rating.elo),
      attempts: rating.attempts,
    }))
    .sort((a, b) => b.elo - a.elo || a.technology.localeCompare(b.technology));
}

function inferTechnologies(tags: string): string[] {
  const normalizedTags = tags
    .split(",")
    .flatMap(tag => {
      const normalizedTag = tag.trim().toLowerCase();
      return normalizedTag ? [normalizedTag] : [];
    });

  const technologies = new Set<string>(["React"]);

  if (
    normalizedTags.some(tag =>
      ["typescript", "ts", "tsx", "types", "generic"].includes(tag)
    )
  ) {
    technologies.add("TypeScript");
  }

  if (
    normalizedTags.some(tag =>
      ["async", "race-condition", "promise", "fetch"].includes(tag)
    )
  ) {
    technologies.add("Async State");
  }

  if (
    normalizedTags.some(tag =>
      ["useeffect", "react-hooks", "hooks", "stale-closure"].includes(tag)
    )
  ) {
    technologies.add("React Hooks");
  }

  return [...technologies];
}

function getTechLevel(elo: number) {
  if (elo >= 1400) {
    return "L4 Senior";
  }
  if (elo >= 1150) {
    return "L3 Mid";
  }
  if (elo >= 950) {
    return "L2 Junior";
  }
  return "L1 Trainee";
}

function getKanjiRankLabel(elo: number) {
  if (elo >= 1800) return "三段 · 3rd Dan";
  if (elo >= 1700) return "二段 · 2nd Dan";
  if (elo >= 1600) return "初段 · 1st Dan";
  if (elo >= 1500) return "一級 · 1st Kyu";
  if (elo >= 1400) return "二級 · 2nd Kyu";
  if (elo >= 1300) return "三級 · 3rd Kyu";
  if (elo >= 1200) return "四級 · 4th Kyu";
  if (elo >= 1100) return "五級 · 5th Kyu";
  if (elo >= 1000) return "六級 · 6th Kyu";
  return "七級 · 7th Kyu";
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
