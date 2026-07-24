import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";

import { DashboardRankMenu } from "./dashboard-rank-menu";

type DashboardHomeHeaderProps = {
  userName: string;
  userImage: string | null;
  userElo: number;
  userStreak: number;
};

function getFirstName(userName: string) {
  return userName.trim().split(/\s+/)[0] || "Kodan";
}

function getInitials(userName: string) {
  return userName
    .split(" ")
    .flatMap((part) => (part[0] ? [part[0]] : []))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardHomeHeader({ userName, userImage, userElo, userStreak }: DashboardHomeHeaderProps) {
  const streakUnit = userStreak === 1 ? "dia" : "dias";

  return (
    <header className="sticky top-0 z-20 flex min-h-28 items-center justify-between gap-5 bg-[var(--dojo-page)] px-5 pl-16 sm:px-8 lg:px-12">
      <div className="flex items-center gap-4">
        <div className="hidden size-14 place-items-center rounded-full border border-[color:var(--dojo-border-strong)] font-serif text-2xl text-[var(--dojo-accent)] sm:grid">道</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dojo-accent)]">Seu dojo</p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-[var(--dojo-ink)] sm:text-3xl">Bem-vindo ao Dojo, {getFirstName(userName)}!</h1>
          <p className="mt-1 hidden text-sm text-[var(--dojo-muted)] sm:block">Sua jornada de excelência começa agora.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-7">
        <DashboardRankMenu userElo={userElo} />
        <div role="group" aria-label={`${userStreak} ${streakUnit} de streak`} className="flex items-center gap-3">
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-[var(--dojo-flame-soft)] text-[var(--dojo-flame)]">
            <Flame className="size-5 fill-current stroke-[1.8]" aria-hidden="true" />
          </span>
          <div className="hidden sm:block">
            <p className="font-serif text-xl font-bold">{userStreak}</p>
            <p className="text-xs text-[var(--dojo-muted)]">{streakUnit} de streak</p>
          </div>
        </div>
        <Link href="/perfil" aria-label="Abrir perfil" className="grid size-11 place-items-center overflow-hidden rounded-full bg-[var(--dojo-avatar)] text-xs font-bold text-[var(--dojo-ink)]">
          {userImage ? <Image src={userImage} alt="" width={44} height={44} unoptimized className="size-full object-cover" /> : getInitials(userName)}
        </Link>
      </div>
    </header>
  );
}
