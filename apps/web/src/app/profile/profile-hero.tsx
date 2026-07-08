import type { ReactNode } from "react";

import { CalendarDays, Globe2, MapPin, ShieldCheck } from "lucide-react";

import type { ProfileUserSummary } from "./profile-types";

export function ProfileHero({ user }: { user: ProfileUserSummary }) {
  return (
    <section className="grid gap-6 rounded-[8px] border border-transparent py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
        <ProfileAvatar name={user.name} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-4xl font-semibold leading-tight text-[var(--profile-text-primary)] sm:text-5xl">
              {user.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--profile-accent-blue)] bg-[var(--profile-accent-blue-soft)] px-3 py-1 text-xs font-semibold text-[var(--profile-accent-blue)]">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              {user.planLabel}
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--profile-text-secondary)]">
            {user.tagline}
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--profile-text-muted)]">
            <ProfileMetaItem
              icon={<CalendarDays className="size-4" aria-hidden="true" />}
              value={user.memberSinceLabel}
            />
            <ProfileMetaItem
              icon={<MapPin className="size-4" aria-hidden="true" />}
              value={user.countryLabel}
            />
            <ProfileMetaItem
              icon={<Globe2 className="size-4" aria-hidden="true" />}
              value={user.timezoneLabel}
            />
          </ul>
        </div>
      </div>

      <div className="grid max-w-md grid-cols-[1fr_auto_1fr] items-center gap-5 rounded-[8px] border border-[color:var(--profile-border)] bg-[var(--profile-surface)] px-5 py-4 lg:justify-self-end">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-14 items-center justify-center rounded-[14px] border border-[color:var(--profile-border-strong)] bg-[var(--profile-surface-elevated)] font-serif text-2xl font-semibold">
            R
          </span>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--profile-text-muted)]">
              Rank
            </p>
            <p className="font-serif text-xl font-semibold text-[var(--profile-text-primary)]">
              {user.rank}
            </p>
          </div>
        </div>
        <div className="h-16 w-px bg-[var(--profile-border-strong)]" />
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--profile-text-muted)]">
            ELO atual
          </p>
          <p className="font-serif text-3xl font-semibold leading-tight text-[var(--profile-accent-blue)]">
            {user.elo}
          </p>
          <p className="mt-1 text-sm text-[var(--profile-text-secondary)]">
            {user.topPercentLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfileAvatar({ name }: { name: string }) {
  const initials =
    name
      .split(" ")
      .flatMap((part) => (part.trim()[0] ? [part.trim()[0]!] : []))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "K";

  return (
    <div className="grid size-24 shrink-0 place-items-center rounded-full border border-[color:var(--profile-border-strong)] bg-[var(--profile-surface-elevated)] font-serif text-2xl font-semibold text-[var(--profile-text-primary)]">
      {initials}
    </div>
  );
}

function ProfileMetaItem({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <li className="flex items-center gap-1.5">
      {icon}
      <span>{value}</span>
    </li>
  );
}
