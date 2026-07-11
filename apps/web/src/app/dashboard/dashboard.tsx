"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { EChartsOption } from "echarts";
import {
  TrendingUp,
  Loader2,
  History,
  TreePine,
  Atom,
  Flower2,
  Landmark,
  Waves,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { ZenToast } from "@kodan/ui/components/zen";



import { getAttemptsHistory, getLocalUser, updateLocalUserProfile } from "./actions";
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

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
const MIN_ELO = 100;
const ELO_FORMATTER = new Intl.NumberFormat("pt-BR");
const TECH_ELO_FORMATTER = new Intl.NumberFormat("pt-BR", { useGrouping: false });
const ATTEMPT_DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "America/Sao_Paulo",
  year: "numeric",
});
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

  const chartPoints = buildChartPoints(attempts);
  const techRatings = buildTechRatings(attempts);
  const showChart = chartPoints.length >= 2;

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
    <div className="flex-1 w-full bg-transparent px-4 py-10 md:px-8 md:py-12 max-w-5xl mx-auto space-y-16 animate-in fade-in duration-500">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pb-12 border-b border-border/20">
        <div className="min-w-0">
          <EloTrendCard
            loading={loading}
            showChart={showChart}
            chartPoints={chartPoints}
          />
        </div>
        <div className="min-w-0">
          <TechStackRatingsCard loading={loading} ratings={techRatings} />
        </div>
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border/20 pb-8">
      <div className="flex items-start gap-5">
        {userImage ? (
          <button
            type="button"
            onClick={onAvatarClick}
            className="relative group size-20 rounded-full p-0.5 border border-foreground/20 hover:border-foreground/45 transition-colors flex items-center justify-center overflow-hidden shrink-0"
            aria-label="Trocar foto de perfil"
            title="Clique para trocar a foto"
          >
            <Image
              src={userImage}
              alt={`Foto de ${userName}`}
              width={80}
              height={80}
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
            className="relative group size-20 rounded-full p-0.5 border border-foreground/20 hover:border-foreground/45 transition-colors flex items-center justify-center bg-transparent shrink-0"
            aria-label="Adicionar foto de perfil"
            title="Clique para adicionar foto"
          >
            <div className="size-full rounded-full bg-foreground/[0.03] flex items-center justify-center text-foreground font-serif text-xl border border-dashed border-foreground/10 hover:bg-foreground/[0.06] transition-colors">
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
              <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">{userName}</h1>
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
          <p className="mt-1 font-serif text-sm tracking-wide text-muted-foreground/90">
            {rankBadgeLabel}
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1 font-mono">
            Clique na foto para trocar.
          </p>
        </div>
      </div>

      <div className="text-left md:text-right shrink-0 pt-2 md:pt-0">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80 font-mono font-semibold">
          Seu Rating Atual
        </div>
        <div className="mt-1.5 flex items-end gap-2 md:justify-end font-mono font-bold tracking-tight text-foreground">
          <span className="text-4xl tabular-nums">{userElo}</span>
          <span className="text-xl">ELO</span>
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
    <div className="space-y-4">
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <TrendingUp className="size-4 text-primary" />
          Gráfico de Tendência ELO
        </h2>
        <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">
          Sua evolução técnica baseada nas últimas tentativas corrigidas.
        </p>
      </div>
      <div className="h-56 flex items-center justify-center pt-2">
        {loading ? (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        ) : showChart ? (
          <EloTrendChart chartPoints={chartPoints} />
        ) : (
          <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-full">
            <p className="text-xs font-mono font-semibold text-foreground">
              Progresso indisponível
            </p>
            <p className="text-[10px] text-muted-foreground/80 font-mono max-w-xs">
              Realize pelo menos 1 tentativa em desafios para visualizar seu gráfico de tendência ELO.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EloTrendChart({ chartPoints }: { chartPoints: ChartPoint[] }) {
  const safePoints = chartPoints.filter(
    point =>
      Number.isFinite(point.elo) &&
      Number.isFinite(point.change) &&
      point.title.trim().length > 0 &&
      point.date.trim().length > 0
  );
  const pointsCount = safePoints.length;

  if (pointsCount < 2) {
    return (
      <div className="w-full h-full flex items-center justify-start">
        <p className="text-[10px] text-muted-foreground/80 font-mono">
          Dados insuficientes para renderizar a tendência.
        </p>
      </div>
    );
  }

  const elos = safePoints.map(point => point.elo);
  const minRaw = Math.min(...elos);
  const maxRaw = Math.max(...elos);
  const dynamicPad = Math.max(25, Math.ceil((maxRaw - minRaw || 40) * 0.2));
  const minElo = Math.max(
    MIN_ELO,
    Math.floor((Math.min(minRaw, INITIAL_ELO) - dynamicPad) / 10) * 10
  );
  const maxElo = Math.ceil((Math.max(maxRaw, INITIAL_ELO) + dynamicPad) / 10) * 10;
  const option: EChartsOption = {
    animationDuration: 550,
    animationEasing: "cubicOut",
    grid: {
      left: 42,
      right: 14,
      top: 18,
      bottom: 28,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line", snap: true },
      backgroundColor: "#f5f2eb",
      borderColor: "#dcd7cb",
      borderWidth: 1,
      padding: [8, 10],
      textStyle: {
        color: "#1e1f1c",
        fontFamily: "JetBrains Mono, Fira Code, monospace",
        fontSize: 11,
      },
      formatter: params => {
        const data = Array.isArray(params) ? params[0] : params;
        if (!data || typeof data.dataIndex !== "number") {
          return "Sem dados";
        }
        const point = safePoints[data.dataIndex];
        if (!point) {
          return "Sem dados";
        }

        return [
          `<div style="font-weight:700;margin-bottom:4px;">${point.date}</div>`,
          `<div>ELO: ${ELO_FORMATTER.format(point.elo)} (${point.change >= 0 ? `+${point.change}` : point.change})</div>`,
          `<div style="opacity:.78;margin-top:2px;">${point.title}</div>`,
        ].join("");
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: safePoints.map(point => point.date),
      axisLine: { lineStyle: { color: "rgba(220,215,203,.8)" } },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(90,94,101,.8)",
        fontSize: 10,
        fontFamily: "JetBrains Mono, Fira Code, monospace",
        interval: index => pointsCount <= 6 || index % 2 === 0,
      },
    },
    yAxis: {
      type: "value",
      min: minElo,
      max: maxElo,
      splitNumber: 4,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "rgba(90,94,101,.8)",
        fontSize: 10,
        fontFamily: "JetBrains Mono, Fira Code, monospace",
        formatter: value => ELO_FORMATTER.format(Number(value)),
      },
      splitLine: {
        lineStyle: {
          color: "rgba(220,215,203,.45)",
          width: 1,
          type: "dashed",
        },
      },
    },
    series: [
      {
        type: "line",
        data: safePoints.map(point => point.elo),
        smooth: 0.25,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: {
          color: "#1e1f1c",
          width: 2.25,
        },
        itemStyle: {
          color: "#1e1f1c",
          borderColor: "#f5f2eb",
          borderWidth: 1.5,
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(31,61,47,.22)" },
              { offset: 1, color: "rgba(31,61,47,.02)" },
            ],
          },
        },
        markLine: {
          silent: true,
          symbol: "none",
          label: {
            formatter: "Base ELO",
            color: "rgba(90,94,101,.75)",
            fontSize: 9,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            position: "insideEndTop",
          },
          lineStyle: {
            color: "rgba(140,45,25,.65)",
            type: "dotted",
            width: 1,
          },
          data: [{ yAxis: INITIAL_ELO }],
        },
      },
    ],
  };

  return (
    <div className="h-full w-full rounded-sm border border-border/30 bg-[oklch(var(--background))] p-1">
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        opts={{ renderer: "svg" }}
        notMerge
      />
    </div>
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
    <div className="space-y-4 min-w-0">
      <div>
        <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          <TreePine className="size-4 text-primary" />
          Tech Stack Garden
        </h2>
        <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5 max-w-sm">
          Sua fundação técnica visualizada como pedras de progresso no jardim de treino.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="pt-1">
          <div className="grid grid-cols-1 gap-4">
            {ratings.map((rating, index) => (
              <article
                key={rating.technology}
                className="relative overflow-hidden border border-border/25 bg-foreground/[0.02] p-4"
                style={{ borderRadius: getTechStoneRadius(index) }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, oklch(var(--foreground) / 0.24) 1px, transparent 0)",
                    backgroundSize: "12px 12px",
                  }}
                />
                <div className="relative min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex flex-1 items-start gap-3">
                      <div className="mt-0.5 shrink-0 size-9 rounded-full border border-border/30 bg-background/55 flex items-center justify-center text-muted-foreground">
                        <TechGardenIcon technology={rating.technology} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-sm md:text-base leading-snug font-semibold tracking-tight text-foreground">
                          {rating.technology}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/75 font-mono">
                          {getTechGardenAlias(rating.technology)}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 border border-border/30 bg-background/40 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.14em] text-muted-foreground/80">
                      {getTechRankSuffix(rating.elo)}
                    </span>
                  </div>

                  <div className="mt-3 border-t border-border/20 pt-2.5 flex items-end justify-between gap-2">
                    <p className="text-xs font-mono font-semibold text-foreground">{rating.level}</p>
                    <p className="text-xs font-mono text-muted-foreground/85 tabular-nums">
                      {TECH_ELO_FORMATTER.format(rating.elo)} ELO
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
                    {ATTEMPT_DATE_FORMATTER.format(attempt.createdAt)}
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
    current = Math.max(MIN_ELO, current + attempt.eloChange);
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
        elo: Math.max(MIN_ELO, current.elo + attempt.eloChange),
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

function TechGardenIcon({ technology }: { technology: string }) {
  const normalized = technology.trim().toLowerCase();
  if (normalized.includes("react hooks")) {
    return <Flower2 className="size-[18px]" />;
  }
  if (normalized.includes("react")) {
    return <Atom className="size-[18px]" />;
  }
  if (normalized.includes("typescript")) {
    return <Landmark className="size-[18px]" />;
  }
  if (normalized.includes("async")) {
    return <Waves className="size-[18px]" />;
  }
  return <TreePine className="size-[18px]" />;
}

function getTechGardenAlias(technology: string) {
  const normalized = technology.trim().toLowerCase();
  if (normalized.includes("react hooks")) {
    return "Lotus Path";
  }
  if (normalized.includes("react")) {
    return "Bonsai State";
  }
  if (normalized.includes("typescript")) {
    return "Temple Order";
  }
  if (normalized.includes("async")) {
    return "Flow Current";
  }
  return "Silent Craft";
}

function getTechStoneRadius(index: number) {
  const patterns = [
    "2rem 2.6rem 2.2rem 2.8rem / 2.2rem 2.8rem 2.1rem 2.4rem",
    "2.6rem 2rem 2.8rem 2rem / 2.4rem 2.1rem 2.7rem 2.2rem",
    "1.9rem 2.7rem 2rem 2.5rem / 2.5rem 2rem 2.8rem 2rem",
    "2.5rem 2.1rem 2.6rem 2rem / 2rem 2.6rem 2.2rem 2.8rem",
  ];
  return patterns[index % patterns.length]!;
}

function getTechRankSuffix(elo: number) {
  const fullRank = getKanjiRankLabel(elo);
  const rankParts = fullRank.split("·");
  return (rankParts[1] ?? fullRank).trim();
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
