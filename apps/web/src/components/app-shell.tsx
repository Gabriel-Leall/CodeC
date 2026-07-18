"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  CircleHelp,
  Home,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Swords,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

import sidebarBackground from "@/assets/sidebar_background.png";
import { eloToDanRank } from "@/lib/rating";

const APP_ROUTE_PREFIXES = [
  "/dashboard",
  "/challenges",
  "/train",
  "/profile",
  "/reviews",
  "/simulator",
  "/help",
  "/settings",
] as const;

const CHALLENGE_LINKS = [
  { href: "/challenges", label: "Todos os Desafios", dot: "bg-[#1c56b5]" },
  { href: "/challenges?status=in_progress", label: "Em andamento", dot: "bg-[#6d83a0]" },
  { href: "/reviews", label: "Revisões", dot: "bg-[#b27a96]" },
  { href: "/simulator", label: "Simulados", dot: "bg-[#d38a55]" },
] as const;

type SidebarUser = {
  name: string;
  image: string | null;
  elo: number;
};

function formatRank(elo: number) {
  const rank = eloToDanRank(elo).kyuDan;
  return rank.replace(/(\d+)(?:st|nd|rd|th)\s(Kyu|Dan)/, "$1º $2");
}

function KodanMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center", compact ? "justify-center" : "gap-4")}>
      <span className="grid size-10 shrink-0 place-items-center text-3xl text-[#1d2938]" aria-hidden="true">⛩</span>
      <span className={cn("font-serif text-xl font-semibold tracking-[0.22em] text-[#1d2938]", compact && "sr-only")}>KODAN</span>
    </div>
  );
}

function DojoSidebar({
  collapsed,
  mobileOpen,
  pathname,
  user,
  onCloseMobile,
  onToggle,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  pathname: string;
  user: SidebarUser | null;
  onCloseMobile: () => void;
  onToggle: () => void;
}) {
  const challengeSectionActive = pathname.startsWith("/challenges") || pathname.startsWith("/train") || pathname === "/reviews" || pathname === "/simulator";
  const [challengesOpen, setChallengesOpen] = useState(challengeSectionActive);
  const compact = collapsed && !mobileOpen;
  const displayName = user?.name ?? "Kodan";
  const initials = displayName
    .split(" ")
    .flatMap((part) => (part[0] ? [part[0]] : []))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const rank = formatRank(user?.elo ?? 1200);

  return (
    <aside className={cn("relative flex h-svh min-h-0 shrink-0 flex-col overflow-hidden border-r border-[#e3ded4] bg-[#f8f6f1] transition-[width] duration-300", compact ? "w-[84px]" : "w-[256px]")}>
      <Image src={sidebarBackground} alt="" width={433} height={577} priority className={cn("pointer-events-none absolute bottom-0 z-0 max-w-none object-contain object-bottom transition-opacity duration-300", compact ? "-left-36 h-[360px] w-[270px] opacity-0" : "-left-14 h-[520px] w-[390px] opacity-70")} />
      <div className={cn("relative z-10 flex h-28 shrink-0 items-center", compact ? "justify-center px-3" : "justify-between px-7")}>
        <Link href="/dashboard" aria-label="Abrir o Dojo" onClick={onCloseMobile}><KodanMark compact={compact} /></Link>
        <button type="button" onClick={mobileOpen ? onCloseMobile : onToggle} aria-label={mobileOpen ? "Fechar sidebar" : compact ? "Expandir sidebar" : "Recolher sidebar"} className="grid size-8 place-items-center rounded-lg text-[#687282] transition-colors hover:bg-[#e9edf4] hover:text-[#1c56b5]">
          {mobileOpen ? <X className="size-4" /> : compact ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      <nav className="relative z-10 min-h-0 flex-1 space-y-7 overflow-y-auto px-4 py-5" aria-label="Navegação principal">
        <div>
          <p className={cn("mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8f96]", compact && "sr-only")}>Dojo</p>
          <Link href="/dashboard" onClick={onCloseMobile} title={compact ? "Visão Geral" : undefined} aria-current={pathname === "/dashboard" ? "page" : undefined} className={cn("group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 hover:bg-[#e9edf4] hover:text-[#1c56b5]", pathname === "/dashboard" ? "bg-[#e9edf4] text-[#1654b2]" : "text-[#293342]")}><Home className="size-5 shrink-0 transition-transform group-hover:scale-110" /><span className={cn("whitespace-nowrap", compact && "sr-only")}>Visão Geral</span></Link>
          <button type="button" onClick={() => setChallengesOpen((value) => !value)} aria-expanded={challengesOpen} title={compact ? "Desafios" : undefined} className={cn("group mt-2 flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 hover:translate-x-1 hover:bg-[#e9edf4] hover:text-[#1c56b5]", challengeSectionActive ? "text-[#1654b2]" : "text-[#293342]")}><Swords className="size-5 shrink-0 transition-transform group-hover:scale-110" /><span className={cn("flex-1 whitespace-nowrap", compact && "sr-only")}>Desafios</span><ChevronDown className={cn("size-4 transition-transform duration-200", challengesOpen && "rotate-180", compact && "hidden")} /></button>
          {challengesOpen && !compact ? <div className="ml-9 mt-1 space-y-1 border-l border-[#d9dfe8] pl-3">{CHALLENGE_LINKS.map((item) => <Link key={item.href} href={item.href as Route} onClick={onCloseMobile} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#4e5968] transition-colors hover:bg-[#edf1f6] hover:text-[#1c56b5]"><span className={cn("size-1.5 rounded-full", item.dot)} />{item.label}</Link>)}</div> : null}
        </div>

        <div>
          <p className={cn("mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a8f96]", compact && "sr-only")}>Suporte</p>
          <Link href={"/help" as Route} onClick={onCloseMobile} title={compact ? "Ajuda" : undefined} aria-current={pathname === "/help" ? "page" : undefined} className="group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-[#293342] transition-all duration-200 hover:translate-x-1 hover:bg-[#e9edf4] hover:text-[#1c56b5]"><CircleHelp className="size-5 shrink-0 transition-transform group-hover:scale-110" /><span className={cn("whitespace-nowrap", compact && "sr-only")}>Ajuda</span></Link>
          <Link href={"/settings" as Route} onClick={onCloseMobile} title={compact ? "Configurações" : undefined} aria-current={pathname === "/settings" ? "page" : undefined} className="group mt-2 flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium text-[#293342] transition-all duration-200 hover:translate-x-1 hover:bg-[#e9edf4] hover:text-[#1c56b5]"><Settings className="size-5 shrink-0 transition-transform duration-300 group-hover:rotate-45" /><span className={cn("whitespace-nowrap", compact && "sr-only")}>Configurações</span></Link>
        </div>
      </nav>

      <div className="relative z-10 mt-auto shrink-0 px-4 pb-5 pt-2">
        <Link href="/profile" onClick={onCloseMobile} title={compact ? `${displayName}, ${rank}` : undefined} className="group flex items-center gap-3 rounded-2xl border border-[#dfe4eb] bg-[#f8f6f1]/90 p-3 transition-colors hover:border-[#b7c9e0] hover:bg-[#edf3fb]">
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[#d5d9dd] text-xs font-bold text-[#293342]">{user?.image ? <Image src={user.image} alt="" width={36} height={36} unoptimized className="size-full object-cover" /> : initials}</span>
          <span className={cn("min-w-0", compact && "sr-only")}><span className="block truncate text-xs font-semibold text-[#293342]">{displayName}</span><span className="mt-0.5 block text-[10px] uppercase tracking-[0.12em] text-[#1c56b5]">{rank} · {user?.elo ?? 1200} ELO</span></span>
        </Link>
      </div>
    </aside>
  );
}

export function AppShell({ children, user }: { children: ReactNode; user: SidebarUser | null }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isAppRoute = APP_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (!isAppRoute) return <>{children}</>;

  return (
    <div className="flex h-svh overflow-hidden bg-[#f8f6f1] text-[#18212c]">
      <div className={cn("fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0", mobileSidebarOpen ? "translate-x-0" : "-translate-x-full")}><DojoSidebar collapsed={sidebarCollapsed} mobileOpen={mobileSidebarOpen} pathname={pathname} user={user} onCloseMobile={() => setMobileSidebarOpen(false)} onToggle={() => setSidebarCollapsed((value) => !value)} /></div>
      {mobileSidebarOpen ? <button type="button" onClick={() => setMobileSidebarOpen(false)} aria-label="Fechar navegação" className="fixed inset-0 z-40 bg-[#18212c]/20 lg:hidden" /> : null}
      {!mobileSidebarOpen ? <button type="button" onClick={() => setMobileSidebarOpen(true)} aria-label="Abrir navegação" className="fixed left-3 top-3 z-30 grid size-10 place-items-center rounded-xl border border-[#e3ded4] bg-[#f8f6f1]/95 text-[#566171] shadow-sm lg:hidden"><Menu className="size-5" /></button> : null}
      <main className="h-svh min-w-0 flex-1 overflow-y-auto overscroll-contain">{children}</main>
    </div>
  );
}
