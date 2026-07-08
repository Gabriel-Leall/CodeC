import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

export function ProfileTopHeader({ userElo }: { userElo: number }) {
  return (
    <header className="flex h-[72px] min-w-0 items-center justify-between gap-4 border-b border-[color:var(--profile-border)] bg-[var(--profile-surface)] px-4 sm:px-6 lg:px-7">
      <Link
        href="/"
        className="profile-focusable inline-flex shrink-0 items-center gap-2 rounded-[5px] lg:hidden"
      >
        <span className="inline-flex size-9 items-center justify-center rounded-[6px] border border-[color:var(--profile-accent-blue)] text-xl font-semibold text-[var(--profile-accent-blue)]">
          K
        </span>
        <span className="text-xl font-semibold tracking-wide text-[var(--profile-text-primary)]">
          KODAN
        </span>
      </Link>

      <div className="relative hidden w-full max-w-[520px] md:block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--profile-text-secondary)]"
          aria-hidden="true"
        />
        <input
          aria-label="Buscar desafios, tópicos, conceitos"
          className="profile-control h-10 w-full rounded-[7px] border border-[color:var(--profile-border)] bg-[var(--profile-surface-elevated)] pl-11 pr-12 text-sm text-[var(--profile-text-primary)] outline-none placeholder:text-[var(--profile-text-secondary)]"
          placeholder="Buscar desafios, tópicos, conceitos..."
        />
        <span className="pointer-events-none absolute right-3 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-[5px] border border-[color:var(--profile-border)] text-sm text-[var(--profile-text-secondary)]">
          /
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-5">
        <div className="hidden items-center gap-4 sm:flex">
          <RankSeal compact />
          <div className="border-r border-[color:var(--profile-border-strong)] pr-5">
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--profile-text-secondary)]">
              Rank
            </p>
            <p className="text-base font-medium leading-tight text-[var(--profile-text-primary)]">
              Ronin
            </p>
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--profile-text-secondary)]">
              Elo
            </p>
            <p className="text-base font-medium leading-tight text-[var(--profile-accent-blue)]">
              {userElo}
            </p>
          </div>
        </div>

        <div
          className="inline-flex items-center gap-2 rounded-full text-[var(--profile-text-primary)]"
          aria-label="Usuário atual: Nakamura"
        >
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--profile-text-primary)] text-sm font-semibold text-[var(--profile-surface)]">
            N
          </span>
          <ChevronDown className="hidden size-4 sm:block" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}

export function RankSeal({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[10px] border border-[color:var(--profile-border-strong)] bg-[var(--profile-surface-elevated)] font-semibold text-[var(--profile-text-primary)] ${
        compact ? "size-10 text-xl" : "size-14 text-3xl"
      }`}
      aria-hidden="true"
    >
      龍
    </span>
  );
}
