"use client";

import type { Route } from "next";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  CircleDot,
  Clock3,
  Code2,
  Crown,
  Flame,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { ChallengeContentEntry } from "@kodan/db/challenge-content";

import initiationBackground from "@/assets/initiation_background.png";
import initiationIcon from "@/assets/initiation_icon.png";
import reviewBackground from "@/assets/review_background.png";
import reviewIcon from "@/assets/review_icon.png";
import simulationBackground from "@/assets/simulation_background.png";
import simulationIcon from "@/assets/simulation_icon.png";
import trainBackground from "@/assets/train_background.png";
import trainingIcon from "@/assets/training_icon.png";
import { eloToDanRank } from "@/lib/rating";

type DashboardHomeProps = {
  challenge: ChallengeContentEntry;
  challengeCount: number;
  userName: string;
  userImage: string | null;
  userElo: number;
  userStreak: number;
};

type SideCardProps = {
  title: string;
  description: string;
  footer: string;
  href: Route;
  background: StaticImageData;
  icon: StaticImageData;
  footerIcon: typeof UsersRound;
};

const rankLevels = [
  { label: "Kyu inicial", range: "800–1.099 ELO", detail: "Fundamentos", icon: CircleDot },
  { label: "Kyu avançado", range: "1.100–1.399 ELO", detail: "Diagnóstico", icon: Sparkles },
  { label: "Candidato a Dan", range: "1.400–1.699 ELO", detail: "Domínio técnico", icon: Award },
  { label: "Dan / Kensei", range: "1.700+ ELO", detail: "Maestria", icon: Crown },
] as const;

function CodePreview({ code }: { code: string }) {
  return (
    <div className="min-h-120 overflow-hidden rounded-xl border border-[color:var(--dojo-border)] bg-transparent">
      <div className="flex h-12 items-center justify-between border-b border-[color:var(--dojo-border)] px-4 text-xs text-[var(--dojo-muted)]">
        <div className="flex items-center gap-3">
          <Code2 className="size-4" aria-hidden="true" />
          <span>Counter.tsx</span>
        </div>
        <span className="rounded-full border border-[color:var(--dojo-border-strong)] px-2 py-1 text-xs uppercase tracking-wide">
          read-only
        </span>
      </div>
      <pre className="min-h-96 max-h-96 overflow-auto px-4 py-5 text-xs leading-6 text-[var(--dojo-ink-soft)] sm:px-6">
        <code>
          {code.split("\n").map((line, index) => (
            <span key={`${index}-${line}`} className="grid grid-cols-[2rem_minmax(0,1fr)]">
              <span className="select-none pr-3 text-right text-[var(--dojo-muted)]">{index + 1}</span>
              <span
                className={
                  line.includes("useEffect") || line.includes("setInterval")
                    ? "font-semibold text-[var(--dojo-accent)]"
                    : line.includes("count")
                      ? "text-[var(--dojo-rose)]"
                      : ""
                }
              >
                {line || " "}
              </span>
            </span>
          ))}
        </code>
      </pre>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--dojo-border)] px-4 py-3 text-xs text-[var(--dojo-muted)]">
        <span>Linguagem <strong className="ml-1 text-[var(--dojo-accent)]">React</strong></span>
        <span>Complexidade <strong className="ml-1 text-[var(--dojo-ink)]">O(n)</strong></span>
      </div>
    </div>
  );
}

function SideCard({
  title,
  description,
  footer,
  href,
  background,
  icon,
  footerIcon: FooterIcon,
}: SideCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-56 items-center overflow-hidden rounded-2xl border border-[color:var(--dojo-border)] bg-transparent p-6 transition-[transform,border-color] duration-200 motion-safe:hover:-translate-y-1 hover:border-[color:var(--dojo-accent-border)]"
    >
      <Image src={background} alt="" fill sizes="420px" className="pointer-events-none object-cover transition-transform duration-200 motion-safe:group-hover:scale-[1.02]" />
      <Image src={icon} alt="" width={500} height={500} className="pointer-events-none absolute left-5 top-1/2 z-10 size-24 -translate-y-1/2 object-contain transition-transform duration-200 motion-safe:group-hover:scale-105" />
      <div className="relative z-10 flex min-h-44 flex-1 flex-col justify-center pl-28 pr-12">
        <h2 className="font-serif text-2xl font-bold text-[var(--dojo-ink)]">{title}</h2>
        <p className="mt-3 min-h-12 max-w-60 text-sm leading-6 text-[var(--dojo-muted)]">{description}</p>
        <div className="mt-5 flex items-center gap-2 text-xs text-[var(--dojo-ink-soft)]">
          <FooterIcon className="size-4 shrink-0" aria-hidden="true" />
          <span>{footer}</span>
        </div>
      </div>
      <span className="absolute bottom-6 right-6 z-10 grid size-11 place-items-center rounded-full border border-[color:var(--dojo-border-strong)] text-[var(--dojo-ink)] transition-colors duration-200 group-hover:bg-[var(--dojo-accent)] group-hover:text-[var(--dojo-surface)]">
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

function formatRank(elo: number) {
  return eloToDanRank(elo).kyuDan.replace(/(\d+)(?:st|nd|rd|th)\s(Kyu|Dan)/, "$1º $2");
}

export default function DashboardHome({ challenge, challengeCount, userName, userImage, userElo, userStreak }: DashboardHomeProps) {
  const [rankTableOpen, setRankTableOpen] = useState(false);
  const rankTriggerRef = useRef<HTMLButtonElement>(null);
  const rankPanelRef = useRef<HTMLDivElement>(null);
  const firstName = userName.trim().split(/\s+/)[0] || "Kodan";
  const initials = userName
    .split(" ")
    .flatMap((part) => (part[0] ? [part[0]] : []))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const rankLabel = formatRank(userElo);

  useEffect(() => {
    if (!rankTableOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rankPanelRef.current?.contains(target) && !rankTriggerRef.current?.contains(target)) {
        setRankTableOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setRankTableOpen(false);
        rankTriggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => rankPanelRef.current?.querySelector<HTMLElement>("button")?.focus());

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [rankTableOpen]);

  return (
    <div data-dashboard-home="true" className="min-h-full bg-[var(--dojo-page)] font-mono text-[var(--dojo-ink)]">
      <header className="sticky top-0 z-20 flex min-h-28 items-center justify-between gap-5 bg-[var(--dojo-page)] px-5 pl-16 sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <div className="hidden size-14 place-items-center rounded-full border border-[color:var(--dojo-border-strong)] font-serif text-2xl text-[var(--dojo-accent)] sm:grid">道</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dojo-accent)]">Seu dojo</p>
            <h1 className="mt-1 font-serif text-2xl font-bold text-[var(--dojo-ink)] sm:text-3xl">Bem-vindo ao Dojo, {firstName}!</h1>
            <p className="mt-1 hidden text-sm text-[var(--dojo-muted)] sm:block">Sua jornada de excelência começa agora.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-7">
          <div className="relative">
            <button
              ref={rankTriggerRef}
              type="button"
              onClick={() => setRankTableOpen((value) => !value)}
              aria-label={`Abrir tabela de níveis: ${rankLabel}, ${userElo} ELO`}
              aria-expanded={rankTableOpen}
              aria-controls="rank-level-table"
              className="flex min-h-11 items-center gap-2 rounded-xl px-1 py-1 text-left transition-colors duration-200 hover:bg-[var(--dojo-accent-soft)] sm:gap-3 sm:px-2"
            >
              <span className="grid size-11 place-items-center rounded-xl border border-[color:var(--dojo-accent-border)] bg-[var(--dojo-accent-soft)] text-[var(--dojo-accent)] sm:size-12">
                <Award className="size-6" aria-hidden="true" />
              </span>
              <span className="hidden sm:block">
                <span className="block text-xs uppercase tracking-wider text-[var(--dojo-ink-soft)]">Rank</span>
                <span className="block font-serif text-lg font-bold">{rankLabel}</span>
                <span className="block text-xs font-semibold text-[var(--dojo-accent)]">{userElo} ELO</span>
              </span>
              <span className="text-xs font-semibold text-[var(--dojo-accent)] sm:hidden">{userElo}</span>
              <ChevronDown className={`size-4 text-[var(--dojo-muted)] transition-transform duration-200 ${rankTableOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {rankTableOpen ? (
              <div
                ref={rankPanelRef}
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
                  <button type="button" onClick={() => setRankTableOpen(false)} aria-label="Fechar tabela de níveis" className="grid size-11 place-items-center rounded-full text-[var(--dojo-muted)] transition-colors duration-200 hover:bg-[var(--dojo-accent-soft)] hover:text-[var(--dojo-accent)]">
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

          <div
            role="group"
            aria-label={`${userStreak} ${userStreak === 1 ? "dia" : "dias"} de streak`}
            className="flex items-center gap-3"
          >
            <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[var(--dojo-flame-soft)] text-[var(--dojo-flame)]">
              <Flame className="size-5 fill-current stroke-[1.8]" aria-hidden="true" />
            </span>
            <div className="hidden sm:block">
              <p className="font-serif text-xl font-bold">{userStreak}</p>
              <p className="text-xs text-[var(--dojo-muted)]">{userStreak === 1 ? "dia" : "dias"} de streak</p>
            </div>
          </div>
          <Link href="/profile" aria-label="Abrir perfil" className="grid size-11 place-items-center overflow-hidden rounded-full bg-[var(--dojo-avatar)] text-xs font-bold text-[var(--dojo-ink)]">
            {userImage ? <Image src={userImage} alt="" width={44} height={44} unoptimized className="size-full object-cover" /> : initials}
          </Link>
        </div>
      </header>

      <div className="grid gap-5 p-5 sm:p-8 2xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.75fr)]">
        <section className="space-y-5">
          <article className="overflow-hidden rounded-2xl border border-[color:var(--dojo-border)] bg-transparent">
            <div className="grid xl:grid-cols-[0.85fr_1.15fr]">
              <div className="flex flex-col p-6 sm:p-9">
                <div className="mb-9 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[var(--dojo-accent)]">
                  <Trophy className="size-4" aria-hidden="true" />Recomendado para você
                </div>
                <h2 className="max-w-md font-serif text-3xl font-bold leading-tight text-[var(--dojo-ink)] sm:text-4xl">{challenge.title}</h2>
                <div className="mt-7 flex flex-wrap gap-8 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--dojo-ink-soft)]">Dificuldade</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--dojo-accent)]">
                      <BarChart3 className="size-4" aria-hidden="true" />
                      {challenge.difficulty === "EASY" ? "Fácil" : challenge.difficulty === "HARD" ? "Difícil" : "Média"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[var(--dojo-ink-soft)]">Tempo estimado</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                      <Clock3 className="size-4" aria-hidden="true" />12 min
                    </p>
                  </div>
                </div>
                <p className="mt-6 max-w-[70ch] text-sm leading-6 text-[var(--dojo-muted)]">{challenge.question}</p>
                <div className="mt-auto pt-7">
                  <div className="mb-6 flex flex-wrap gap-2">
                    {challenge.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-lg border border-[color:var(--dojo-border-strong)] bg-[var(--dojo-surface)] px-3 py-2 text-xs text-[var(--dojo-ink-soft)]">{tag}</span>
                    ))}
                  </div>
                  <Link href={`/train/${challenge.id}`} className="inline-flex min-h-11 items-center gap-4 rounded-xl bg-[var(--dojo-accent)] px-5 py-3 text-sm font-semibold text-[var(--dojo-surface)] transition-colors duration-200 hover:bg-[var(--dojo-accent-strong)]">
                    Continuar treino <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="p-4 sm:p-6 xl:pl-8">
                <CodePreview code={challenge.code} />
              </div>
            </div>
          </article>

          <article className="relative flex min-h-56 flex-col gap-6 overflow-hidden rounded-2xl border border-[color:var(--dojo-border)] bg-transparent p-6 sm:flex-row sm:items-center sm:p-8">
            <Image src={initiationBackground} alt="" fill sizes="900px" className="pointer-events-none object-contain object-right opacity-70" />
            <div className="relative z-10 grid size-48 shrink-0 place-items-center rounded-full sm:size-56">
              <Image src={initiationIcon} alt="" fill sizes="224px" className="scale-110 rounded-full object-contain" />
            </div>
            <div className="relative z-10">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--dojo-accent)]"><Target className="size-4" aria-hidden="true" />Sua primeira missão</p>
              <h2 className="mt-2 font-serif text-2xl font-bold">Iniciação do Dojo</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--dojo-muted)]">Complete os passos abaixo para dar os primeiros passos na sua jornada de evolução.</p>
              <div className="mt-4 grid gap-2 text-sm text-[var(--dojo-ink-soft)] sm:grid-cols-2">
                <span className="flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-[var(--dojo-accent)]" />Explore o desafio recomendado</span>
                <span className="flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-[var(--dojo-accent)]" />Conheça sua conta</span>
              </div>
            </div>
          </article>
        </section>

        <aside className="grid gap-5 md:grid-cols-3 2xl:block 2xl:space-y-5">
          <SideCard title="Treinos Avulsos" description="Desafios rápidos para manter sua mente afiada." footer={`${challengeCount} desafios disponíveis`} footerIcon={UsersRound} background={trainBackground} icon={trainingIcon} href="/challenges" />
          <SideCard title="Revisões" description="Acompanhe suas tentativas e os feedbacks do Tech Lead." footer="Ver seus registros" footerIcon={BookOpen} background={reviewBackground} icon={reviewIcon} href="/reviews" />
          <SideCard title="Simulados" description="Simule uma sequência real e avalie seu desempenho." footer="Explorar desafios" footerIcon={UsersRound} background={simulationBackground} icon={simulationIcon} href="/simulator" />
        </aside>
      </div>
    </div>
  );
}
