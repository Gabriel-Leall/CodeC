"use client";

import { Award, ChevronDown, CircleDot, Crown, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { eloToDanRank, formatRankLabel } from "@/lib/rating";

const rankLevels = [
  { label: "Kyu inicial", range: "800–1.099 ELO", detail: "Fundamentos", icon: CircleDot },
  { label: "Kyu avançado", range: "1.100–1.399 ELO", detail: "Diagnóstico", icon: Sparkles },
  { label: "Candidato a Dan", range: "1.400–1.699 ELO", detail: "Domínio técnico", icon: Award },
  { label: "Dan / Kensei", range: "1.700+ ELO", detail: "Maestria", icon: Crown },
] as const;

export function DashboardRankMenu({ userElo }: { userElo: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const rank = eloToDanRank(userElo);
  const rankLabel = formatRankLabel(userElo);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    const focusFrame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    });

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={`Abrir tabela de níveis: ${rankLabel}, ${userElo} ELO`}
        aria-expanded={isOpen}
        aria-controls="rank-level-table"
        className="flex min-h-11 items-center gap-2 rounded-xl px-1 py-1 text-left transition-colors duration-200 hover:bg-[var(--dojo-accent-soft)] sm:gap-3 sm:px-2"
      >
        <span className="grid size-11 place-items-center rounded-xl border border-[color:var(--dojo-accent-border)] bg-[var(--dojo-accent-soft)] text-[var(--dojo-accent)] sm:size-12">
          <span className="font-serif text-lg font-bold" aria-hidden="true">{rank.kanji}</span>
        </span>
        <span className="hidden sm:block">
          <span className="block text-xs uppercase tracking-wider text-[var(--dojo-ink-soft)]">Rank</span>
          <span className="block font-serif text-lg font-bold">{rankLabel}</span>
          <span className="block text-xs font-semibold text-[var(--dojo-accent)]">{userElo} ELO</span>
        </span>
        <span className="text-xs font-semibold text-[var(--dojo-accent)] sm:hidden">{userElo}</span>
        <ChevronDown className={`size-4 text-[var(--dojo-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div
          ref={panelRef}
          id="rank-level-table"
          role="region"
          aria-labelledby="rank-level-title"
          className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-[color:var(--dojo-border-strong)] bg-[var(--dojo-surface)] p-4 text-left"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dojo-accent)]">Evolução</p>
              <h2 id="rank-level-title" className="mt-1 font-serif text-lg font-bold text-[var(--dojo-ink)]">Escada de níveis</h2>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Fechar tabela de níveis" className="grid size-11 place-items-center rounded-full text-[var(--dojo-muted)] transition-colors duration-200 hover:bg-[var(--dojo-accent-soft)] hover:text-[var(--dojo-accent)]">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-[color:var(--dojo-border)]">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-[var(--dojo-accent-soft)] uppercase tracking-wide text-[var(--dojo-ink-soft)]">
                <tr>
                  <th scope="col" className="px-3 py-2">Marca</th>
                  <th scope="col" className="px-3 py-2">Nível</th>
                  <th scope="col" className="px-3 py-2 text-right">ELO</th>
                </tr>
              </thead>
              <tbody>
                {rankLevels.map(({ label, range, detail, icon: LevelIcon }) => (
                  <tr key={label} className="border-t border-[color:var(--dojo-border)]">
                    <td className="px-3 py-3">
                      <span className="grid size-8 place-items-center rounded-full bg-[var(--dojo-accent-soft)] text-[var(--dojo-accent)]">
                        <LevelIcon className="size-4" aria-hidden="true" />
                      </span>
                    </td>
                    <th scope="row" className="px-3 py-3 font-normal">
                      <span className="block font-semibold text-[var(--dojo-ink)]">{label}</span>
                      <span className="block text-[var(--dojo-muted)]">{detail}</span>
                    </th>
                    <td className="px-3 py-3 text-right font-semibold text-[var(--dojo-accent)]">{range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
