import type { Metadata } from "next";
import ZenPlaygroundClient from "./ZenPlaygroundClient";

export const metadata: Metadata = {
  title: "Zen UI Playground",
  description: "Playground interno para testar componentes, tokens e microinteracoes do Zen UI Pack.",
};

export default function ZenPage() {
  return <ZenPlaygroundClient />;
}
