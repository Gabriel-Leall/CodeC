"use client";

import Link from "next/link";
import type { Route } from "next";
import Image, { type StaticImageData } from "next/image";
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
import { useState } from "react";

import type { ChallengeContentEntry } from "@kodan/db/challenge-content";

import reviewBackground from "@/assets/review_background.png";
import reviewIcon from "@/assets/review_icon.png";
import initiationBackground from "@/assets/initiation_background.png";
import initiationIcon from "@/assets/initiation_icon.png";
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
};

const rankLevels = [
  { label: "Kyu inicial", range: "800–1.099 ELO", detail: "Fundamentos", icon: CircleDot },
  { label: "Kyu avançado", range: "1.100–1.399 ELO", detail: "Diagnóstico", icon: Sparkles },
  { label: "Candidato a Dan", range: "1.400–1.699 ELO", detail: "Domínio técnico", icon: Award },
  { label: "Dan / Kensei", range: "1.700+ ELO", detail: "Maestria", icon: Crown },
] as const;

function CodePreview({ code }: { code: string }) {
  return (
      <div className="min-h-[480px] overflow-hidden rounded-xl border border-[#e3ded4] bg-transparent">
      <div className="flex h-12 items-center justify-between border-b border-[#e3ded4] px-4 text-xs text-[#6f7782]"><div className="flex items-center gap-3"><Code2 className="size-4" /><span className="font-mono">Counter.tsx</span></div><span className="rounded-full border border-[#d9d4cb] px-2 py-1 text-[10px] uppercase tracking-[0.16em]">read-only</span></div>
      <pre className="min-h-[370px] max-h-[410px] overflow-auto px-4 py-5 text-[11px] leading-6 text-[#3d4652] sm:px-6 sm:text-xs"><code>{code.split("\n").map((line, index) => <span key={`${index}-${line}`} className="grid grid-cols-[28px_minmax(0,1fr)]"><span className="select-none pr-3 text-right text-[#a1a6ad]">{index + 1}</span><span className={line.includes("useEffect") || line.includes("setInterval") ? "font-semibold text-[#1756ad]" : line.includes("count") ? "text-[#8e4772]" : ""}>{line || " "}</span></span>)}</code></pre>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e3ded4] px-4 py-3 text-[11px] text-[#596574]"><span>Linguagem <strong className="ml-1 text-[#1c56b5]">React</strong></span><span>Complexidade <strong className="ml-1 font-mono text-[#293342]">O(n)</strong></span></div>
    </div>
  );
}

function SideCard({ title, description, footer, href, background, icon, footerIcon: FooterIcon, muted = false }: { title: string; description: string; footer: string; href: Route; background: StaticImageData; icon: StaticImageData; footerIcon: typeof UsersRound; muted?: boolean }) {
  return <Link href={href} className={`group relative flex min-h-[220px] items-center overflow-hidden rounded-2xl border border-[#e3ded4] bg-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9d6e8] hover:shadow-[0_14px_30px_rgba(57,71,93,0.08)] ${muted ? "opacity-90" : ""}`}><Image src={background} alt="" fill sizes="420px" className="pointer-events-none object-fill transition-transform duration-500 group-hover:scale-[1.03]" /><Image src={icon} alt="" width={500} height={500} className="pointer-events-none absolute left-5 top-1/2 z-10 size-24 -translate-y-1/2 object-contain transition-transform duration-500 group-hover:scale-105" /><div className="relative z-10 flex min-h-[172px] flex-1 flex-col justify-center pl-28 pr-12"><h3 className="font-[Georgia] text-2xl font-bold text-[#151c26]">{title}</h3><p className="mt-3 max-w-[230px] text-sm leading-6 text-[#647080]">{description}</p><div className="mt-5 flex items-center gap-2 text-xs text-[#4e5968]"><FooterIcon className="size-4 shrink-0" /><span>{footer}</span></div></div><span className="absolute bottom-6 right-6 z-10 grid size-10 place-items-center rounded-full border border-[#d9d4cb] transition group-hover:bg-[#1c56b5] group-hover:text-white"><ArrowRight className="size-4" /></span></Link>;
}

function formatRank(elo: number) {
  return eloToDanRank(elo).kyuDan.replace(/(\d+)(?:st|nd|rd|th)\s(Kyu|Dan)/, "$1º $2");
}

export default function DashboardHome({ challenge, challengeCount, userName, userImage, userElo }: DashboardHomeProps) {
  const [rankTableOpen, setRankTableOpen] = useState(false);
  const firstName = userName.trim().split(/\s+/)[0] || "Kodan";
  const initials = userName.split(" ").flatMap((part) => part[0] ? [part[0]] : []).slice(0, 2).join("").toUpperCase();
  const rankLabel = formatRank(userElo);

  return (
    <div data-dashboard-home="true" className="min-h-full bg-[#f8f6f1] font-mono text-[#18212c]">
      <header className="sticky top-0 z-20 flex min-h-28 items-center justify-between gap-5 bg-[#f8f6f1]/95 px-5 pl-16 backdrop-blur-sm sm:px-8 lg:px-12">
        <div className="flex items-center gap-4">
          <div className="hidden size-14 place-items-center rounded-full border border-[#d9d4cb] font-serif text-2xl text-[#1c56b5] sm:grid">道</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1c56b5]">Seu dojo</p>
            <h1 className="mt-1 font-[Georgia] text-2xl font-bold text-[#151c26] sm:text-3xl">Bem-vindo ao Dojo, {firstName}!</h1>
            <p className="mt-1 hidden text-sm text-[#687282] sm:block">Sua jornada de excelência começa agora.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-7">
          <div className="relative hidden sm:block">
            <button type="button" onClick={() => setRankTableOpen((value) => !value)} aria-expanded={rankTableOpen} aria-controls="rank-level-table" className="flex items-center gap-3 rounded-xl px-2 py-1 text-left transition-colors hover:bg-[#edf3fb]">
              <span className="grid size-12 place-items-center rounded-xl border border-[#b7c9e0] bg-[#edf3fb] text-[#1c56b5]"><Award className="size-6" /></span>
              <span><span className="block text-[10px] uppercase tracking-[0.16em] text-[#7c8490]">Rank</span><span className="block font-[Georgia] text-lg font-bold">{rankLabel}</span><span className="block text-xs font-semibold text-[#1c56b5]">{userElo} ELO</span></span>
              <ChevronDown className={`size-4 text-[#687282] transition-transform ${rankTableOpen ? "rotate-180" : ""}`} />
            </button>
            {rankTableOpen ? <div id="rank-level-table" className="absolute right-0 top-[calc(100%+12px)] z-50 w-80 rounded-2xl border border-[#e3ded4] bg-[#fbfaf7] p-4 text-left shadow-[0_18px_40px_rgba(57,71,93,0.14)]"><div className="mb-3 flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1c56b5]">Evolução</p><h2 className="mt-1 font-[Georgia] text-lg font-bold text-[#151c26]">Escada de níveis</h2></div><button type="button" onClick={() => setRankTableOpen(false)} aria-label="Fechar tabela de níveis" className="grid size-7 place-items-center rounded-full text-[#687282] transition-colors hover:bg-[#edf3fb] hover:text-[#1c56b5]"><X className="size-4" /></button></div><div className="overflow-hidden rounded-xl border border-[#e3ded4]"><div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 bg-[#f3f6fb] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7c8490]"><span>Marca</span><span>Nível</span><span>ELO</span></div>{rankLevels.map(({ label, range, detail, icon: LevelIcon }) => <div key={label} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-[#eeeae2] px-3 py-3"><span className="grid size-8 place-items-center rounded-full bg-[#edf3fb] text-[#1c56b5]"><LevelIcon className="size-4" /></span><span><span className="block text-xs font-semibold text-[#293342]">{label}</span><span className="block text-[10px] text-[#7c8490]">{detail}</span></span><span className="text-right text-[10px] font-semibold text-[#1c56b5]">{range}</span></div>)}</div></div> : null}
          </div>
          <div className="hidden h-12 w-px bg-[#e3ded4] sm:block" />
          <div className="flex items-center gap-3"><span title="Sequência de treino" className="grid size-10 place-items-center rounded-full bg-[#fff0e6] text-[#e56d2f]"><Flame className="size-5 fill-[#f59a52] stroke-[1.8]" /></span><div className="hidden sm:block"><p className="font-[Georgia] text-xl font-bold">0</p><p className="text-xs text-[#687282]">dias de streak</p></div></div>
          <Link href="/profile" aria-label="Abrir perfil" className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#d5d9dd] text-xs font-bold text-[#293342]">{userImage ? <Image src={userImage} alt="" width={40} height={40} unoptimized className="size-full object-cover" /> : initials}</Link>
        </div>
      </header>

      <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,0.75fr)]">
        <section className="space-y-5">
          <article className="overflow-hidden rounded-2xl border border-[#e3ded4] bg-transparent shadow-[0_5px_18px_rgba(57,71,93,0.04)]"><div className="grid xl:grid-cols-[0.85fr_1.15fr]"><div className="flex flex-col p-6 sm:p-9"><div className="mb-9 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#1c56b5]"><Trophy className="size-4" />Recomendado para você</div><h2 className="max-w-md font-[Georgia] text-3xl font-bold leading-tight text-[#151c26] sm:text-4xl">{challenge.title}</h2><div className="mt-7 flex flex-wrap gap-6 py-4"><div><p className="text-[10px] uppercase tracking-[0.14em] text-[#7c8490]">Dificuldade</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#1c56b5]"><BarChart3 className="size-4" />{challenge.difficulty === "EASY" ? "Fácil" : challenge.difficulty === "HARD" ? "Difícil" : "Média"}</p></div><div className="h-10 w-px bg-[#e3ded4]" /><div><p className="text-[10px] uppercase tracking-[0.14em] text-[#7c8490]">Tempo estimado</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold"><Clock3 className="size-4" />12 min</p></div></div><p className="mt-6 text-sm leading-6 text-[#596574]">{challenge.question}</p><div className="mt-auto pt-7"><div className="mb-6 flex flex-wrap gap-2">{challenge.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-lg border border-[#d9d4cb] bg-[#fffdfa] px-3 py-2 text-xs text-[#394554]">{tag}</span>)}</div><Link href={`/train/${challenge.id}`} className="inline-flex items-center gap-4 rounded-xl bg-[#1c56b5] px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#154797]">Continuar treino <ArrowRight className="size-4" /></Link></div></div><div className="p-4 sm:p-6 xl:pl-8"><CodePreview code={challenge.code} /></div></div></article>
          <article className="relative flex min-h-[220px] flex-col gap-6 overflow-hidden rounded-2xl border border-[#e3ded4] bg-transparent p-6 sm:flex-row sm:items-center sm:p-8"><Image src={initiationBackground} alt="" fill sizes="900px" className="pointer-events-none object-contain object-right opacity-70" /><div className="relative z-10 grid size-48 shrink-0 place-items-center rounded-full sm:size-56"><Image src={initiationIcon} alt="" fill sizes="224px" className="scale-110 rounded-full object-contain" /></div><div className="relative z-10"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1c56b5]"><Target className="size-4" />Sua primeira missão</p><h2 className="mt-2 font-[Georgia] text-2xl font-bold">Iniciação do Dojo</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#687282]">Complete os passos abaixo para dar os primeiros passos na sua jornada de evolução.</p><div className="mt-4 grid gap-2 text-sm text-[#3f4a58] sm:grid-cols-2"><span className="flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-[#1c56b5]" />Explore o desafio recomendado</span><span className="flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-[#1c56b5]" />Conheça sua conta</span></div></div></article>
        </section>
        <aside className="space-y-5"><SideCard title="Treinos Avulsos" description="Desafios rápidos para manter sua mente afiada." footer={`${challengeCount} desafios disponíveis`} footerIcon={UsersRound} background={trainBackground} icon={trainingIcon} href="/challenges" /><SideCard title="Revisões" description="Acompanhe suas tentativas e os feedbacks do Tech Lead." footer="Ver seus registros" footerIcon={BookOpen} background={reviewBackground} icon={reviewIcon} href={"/reviews" as Route} muted /><SideCard title="Simulados" description="Simule uma sequência real e avalie seu desempenho." footer="Explorar desafios" footerIcon={UsersRound} background={simulationBackground} icon={simulationIcon} href={"/simulator" as Route} /></aside>
      </div>
    </div>
  );
}
