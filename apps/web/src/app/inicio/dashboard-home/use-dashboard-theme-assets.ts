"use client";

import { useSyncExternalStore } from "react";

import initiationIcon from "@/assets/initiation_icon.png";
import initiationIconDark from "@/assets/initiation_icon_dark.png";
import reviewIcon from "@/assets/review_icon.png";
import reviewIconDark from "@/assets/review_icon_dark.png";
import simulationIcon from "@/assets/simulation_icon.png";
import simulationIconDark from "@/assets/simulation_icon_dark.png";
import trainingIcon from "@/assets/training_icon.png";
import trainingIconDark from "@/assets/training_icon_dark.png";
import { useTheme } from "@/components/theme-provider";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function useDashboardThemeAssets() {
  const { resolvedTheme } = useTheme();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const isDark = isHydrated && resolvedTheme === "dark";

  return {
    initiation: isDark ? initiationIconDark : initiationIcon,
    review: isDark ? reviewIconDark : reviewIcon,
    simulation: isDark ? simulationIconDark : simulationIcon,
    training: isDark ? trainingIconDark : trainingIcon,
  };
}

export type DashboardThemeAssets = ReturnType<typeof useDashboardThemeAssets>;
