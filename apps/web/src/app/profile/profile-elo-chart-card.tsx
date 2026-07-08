"use client";

import type { EChartsOption } from "echarts";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

import { SectionCard } from "@kodan/ui/components/profile";
import type { EloPoint } from "./profile-types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function ProfileEloChartCard({ points }: { points: EloPoint[] }) {
  const { resolvedTheme } = useTheme();
  const option = createEloChartOption(points, resolvedTheme === "dark");

  return (
    <SectionCard
      title="Evolução do ELO"
      action={
        <span
          className="rounded-[7px] border border-[color:var(--profile-border)] bg-[var(--profile-surface-elevated)] px-3 py-1.5 text-xs text-[var(--profile-text-primary)]"
          aria-label="Período exibido: últimos 30 dias"
        >
          Últimos 30 dias
        </span>
      }
    >
      <div className="h-[250px]">
        <ReactECharts
          option={option}
          style={{ width: "100%", height: "100%" }}
          opts={{ renderer: "svg" }}
          notMerge
        />
      </div>
    </SectionCard>
  );
}

function createEloChartOption(points: EloPoint[], isDark: boolean): EChartsOption {
  const values = points.map((point) => point.elo);
  const min = Math.min(...values, 1000);
  const max = Math.max(...values, 2000);
  const accent = isDark ? "#5a8dbf" : "#2563eb";

  return {
    animationDuration: 420,
    animationEasing: "cubicOut",
    grid: { left: 44, right: 20, top: 18, bottom: 30 },
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#1b1b1b" : "#fefefc",
      borderColor: isDark ? "#2b2b2b" : "#d9d3c7",
      borderWidth: 1,
      textStyle: {
        color: isDark ? "#f6f3ed" : "#1b2230",
        fontSize: 12,
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: points.map((point) => point.dateLabel),
      axisLine: { lineStyle: { color: isDark ? "#2b2b2b" : "#e7e2d8" } },
      axisTick: { show: false },
      axisLabel: {
        color: isDark ? "rgba(246,243,237,.56)" : "#5f6b7d",
        fontSize: 11,
      },
    },
    yAxis: {
      type: "value",
      min: Math.max(0, Math.floor((min - 120) / 100) * 100),
      max: Math.ceil((max + 120) / 100) * 100,
      splitNumber: 4,
      axisLabel: {
        color: isDark ? "rgba(246,243,237,.56)" : "#5f6b7d",
        fontSize: 11,
      },
      splitLine: { lineStyle: { color: isDark ? "#222222" : "#e7e2d8" } },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: 0.28,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { color: accent, width: 3 },
        itemStyle: { color: accent },
      },
    ],
  };
}
