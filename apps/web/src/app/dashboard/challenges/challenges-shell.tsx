"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Filter,
  Home,
  Moon,
  Search,
  Sun,
  Target,
  Trophy,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@kodan/ui/lib/utils";

const BOTTOM_TABS = [
  { href: "/", label: "Início", icon: Home, active: false },
  { href: "/challenges", label: "Desafios", icon: Target, active: true },
  { href: "/profile", label: "Rank", icon: Trophy, active: false },
  { href: "/profile", label: "Progresso", icon: BarChart3, active: false },
  { href: "/profile", label: "Perfil", icon: User, active: false },
] as const;

const TOP_LINKS = [
  { href: "/", label: "Início", active: false },
  { href: "/challenges", label: "Desafios", active: true },
  { href: "/profile", label: "Perfil", active: false },
] as const;

export function ChallengesDesktopShell({
  userElo,
  searchQuery,
  children,
  onSearchChange,
}: {
  userElo: number;
  searchQuery: string;
  children: ReactNode;
  onSearchChange: (query: string) => void;
}) {
  return (
    <section className="challengers-shell hidden h-full min-h-0 overflow-hidden lg:flex lg:flex-col">
      <header className="flex min-w-0 items-center justify-between gap-4 border-b border-[color:var(--challengers-border)] px-5 xl:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <ChallengeSearchInput
            value={searchQuery}
            className="min-w-[220px] max-w-[520px] flex-1"
            onChange={onSearchChange}
          />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <RankBadge userElo={userElo} />
          <ThemeToggleButton />
          <ProfileLink />
        </div>
      </header>
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}

export function ChallengesMobileShell({
  userElo,
  searchQuery,
  children,
  onSearchChange,
  onOpenNavigation,
}: {
  userElo: number;
  searchQuery: string;
  children: ReactNode;
  onSearchChange: (query: string) => void;
  onOpenNavigation: () => void;
}) {
  return (
    <section className="min-h-svh bg-[var(--challengers-surface)] pb-20 lg:hidden">
      <header className="sticky top-0 z-20 border-b border-[color:var(--challengers-border)] bg-[var(--challengers-surface)] px-4 py-3 pl-16">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Abrir filtros de desafios"
            className="challengers-icon-button inline-flex size-9 items-center justify-center rounded-[9px] border"
            onClick={onOpenNavigation}
          >
            <Filter className="size-4" />
          </button>
          <KodanLogo compact />
          <div className="flex items-center gap-2">
            <CompactRankBadge userElo={userElo} />
            <ThemeToggleButton />
          </div>
        </div>
        <div className="mt-3">
          <ChallengeSearchInput
            value={searchQuery}
            compact
            withFilterIcon
            onChange={onSearchChange}
          />
        </div>
      </header>
      {children}
      <BottomTabBar />
    </section>
  );
}

function KodanLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-3 text-[var(--challengers-ink)]",
        compact && "gap-2",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] border border-[color:var(--challengers-blue-border)] bg-[var(--challengers-blue-soft)] font-mono font-semibold text-[var(--challengers-blue)]",
          compact ? "size-7 text-sm" : "size-9 text-xl",
        )}
      >
        K
      </span>
      <span
        className={cn(
          "font-serif font-bold tracking-[0.2em]",
          compact ? "text-sm" : "text-xl",
        )}
      >
        KODAN
      </span>
    </Link>
  );
}

function DesktopRouteNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="hidden shrink-0 items-center gap-1 min-[1100px]:flex"
    >
      {TOP_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "rounded-[8px] border px-3 py-2 text-[0.76rem] font-medium transition-colors",
            item.active
              ? "border-[color:var(--challengers-blue-border)] bg-[var(--challengers-blue-soft)] text-[var(--challengers-blue)]"
              : "border-transparent text-[var(--challengers-muted)] hover:border-[color:var(--challengers-border)] hover:bg-[var(--challengers-panel)] hover:text-[var(--challengers-ink)]",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Alternar tema"
      className="challengers-icon-button relative inline-flex size-9 items-center justify-center rounded-[9px] border"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}

function ProfileLink() {
  return (
    <Link
      href="/profile"
      aria-label="Perfil"
      className="challengers-icon-button inline-flex size-9 items-center justify-center rounded-[9px] border"
    >
      <User className="size-4" />
    </Link>
  );
}

function ChallengeSearchInput({
  value,
  compact = false,
  withFilterIcon = false,
  className,
  onChange,
}: {
  value: string;
  compact?: boolean;
  withFilterIcon?: boolean;
  className?: string;
  onChange: (query: string) => void;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--challengers-muted)]" />
      <input
        aria-label="Buscar desafios, tópicos ou conceitos"
        value={value}
        placeholder={
          compact
            ? "Buscar desafios, tópicos..."
            : "Buscar desafios, tópicos, conceitos..."
        }
        className={cn(
          "challengers-control h-11 w-full rounded-[8px] border pl-11 text-[0.84rem] outline-none",
          withFilterIcon ? "pr-11" : "pr-14",
          compact && "h-9 text-[0.76rem]",
        )}
        onChange={(event) => onChange(event.target.value)}
      />
      {withFilterIcon ? (
        <Filter className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-[var(--challengers-muted)]" />
      ) : (
        <span className="pointer-events-none absolute right-4 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-[5px] border border-[color:var(--challengers-border)] text-[0.72rem] text-[var(--challengers-muted)]">
          /
        </span>
      )}
    </div>
  );
}

function RankBadge({ userElo }: { userElo: number }) {
  return (
    <div className="flex shrink-0 items-center gap-4">
      <RankSeal />
      <div className="border-r border-[color:var(--challengers-border)] pr-5">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--challengers-muted)]">
          Rank
        </p>
        <p className="font-serif text-lg font-bold leading-tight text-[var(--challengers-ink)]">
          RONIN
        </p>
      </div>
      <div>
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--challengers-muted)]">
          Elo
        </p>
        <p className="text-lg font-semibold leading-tight text-[var(--challengers-blue)]">
          {userElo}
        </p>
      </div>
    </div>
  );
}

function CompactRankBadge({ userElo }: { userElo: number }) {
  return (
    <div className="flex items-center gap-2">
      <RankSeal compact />
      <span className="text-[0.76rem] font-semibold text-[var(--challengers-blue)]">
        {userElo}
      </span>
    </div>
  );
}

function RankSeal({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] border border-[color:var(--challengers-blue-border)] bg-[var(--challengers-blue-soft)] font-serif font-bold text-[var(--challengers-blue)]",
        compact ? "size-7 text-sm" : "size-11 text-xl",
      )}
      aria-hidden="true"
    >
      徳
    </span>
  );
}

function BottomTabBar() {
  return (
    <nav className="challengers-panel fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t px-2 py-1.5 lg:hidden">
      {BOTTOM_TABS.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-[8px] px-1 py-1 text-[0.64rem] transition-colors",
              item.active
                ? "text-[var(--challengers-blue)]"
                : "text-[var(--challengers-muted)]",
            )}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function ChallengesStatePanel({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-4">
      <div className="challengers-panel max-w-md rounded-[14px] border px-8 py-9 text-center">
        <h2 className="font-serif text-xl font-bold text-[var(--challengers-ink)]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--challengers-muted)]">
          {description}
        </p>
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}

export function ChallengesLoadingState() {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-4">
      <div className="challengers-subtle-panel rounded-[999px] border px-5 py-3 text-sm text-[var(--challengers-muted)]">
        Carregando catálogo...
      </div>
    </div>
  );
}

export function ChallengesRouteLoadingState() {
  return (
    <div
      data-challengers-screen="true"
      className="h-full min-h-0 bg-[var(--challengers-page)] text-[var(--challengers-ink)]"
    >
      <div className="challengers-shell h-full animate-pulse" />
    </div>
  );
}
