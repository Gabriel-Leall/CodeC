import Link from "next/link";
import type { ReactNode } from "react";
import { Palette, Settings, UserRound } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";

function SettingsRow({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action: ReactNode }) {
  return (
    <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[color:var(--dojo-border)] p-6 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <span className="mt-1 text-[var(--dojo-accent)]" aria-hidden="true">{icon}</span>
        <div>
          <h2 className="font-serif text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-[var(--dojo-muted)]">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <main className="min-h-full bg-[var(--dojo-page)] px-6 py-12 text-[var(--dojo-ink)] sm:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--dojo-accent)]"><Settings className="size-4" aria-hidden="true" />Preferências</p>
        <h1 className="mt-3 font-serif text-4xl font-bold">Configurações</h1>
        <div className="mt-10 space-y-4">
          <SettingsRow icon={<Palette className="size-5" />} title="Aparência" description="Alterne o tema usado pela aplicação." action={<ModeToggle />} />
          <SettingsRow icon={<UserRound className="size-5" />} title="Perfil" description="Edite seu nome, foto e consulte sua evolução." action={<Link href="/profile" className="inline-flex min-h-11 items-center rounded-xl border border-[color:var(--dojo-border-strong)] px-4 py-2.5 text-sm font-semibold transition-colors duration-200 hover:bg-[var(--dojo-accent-soft)]">Abrir perfil</Link>} />
        </div>
      </div>
    </main>
  );
}
