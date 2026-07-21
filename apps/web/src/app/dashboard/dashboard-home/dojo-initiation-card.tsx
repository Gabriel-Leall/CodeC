import Image, { type StaticImageData } from "next/image";
import { Target } from "lucide-react";

export function DojoInitiationCard({ icon }: { icon: StaticImageData }) {
  return (
    <article className="relative flex min-h-56 flex-col gap-6 overflow-hidden rounded-2xl border border-[color:var(--dojo-border)] bg-transparent p-6 sm:flex-row sm:items-center sm:p-8">
      <div className="relative z-10 grid size-48 shrink-0 place-items-center rounded-full sm:size-56">
        <Image src={icon} alt="" fill sizes="224px" className="scale-110 rounded-full object-contain" />
      </div>
      <div className="relative z-10">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--dojo-accent)]">
          <Target className="size-4" aria-hidden="true" />Sua primeira missão
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold">Iniciação do Dojo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--dojo-muted)]">Complete os passos abaixo para dar os primeiros passos na sua jornada de evolução.</p>
        <div className="mt-4 grid gap-2 text-sm text-[var(--dojo-ink-soft)] sm:grid-cols-2">
          <span className="flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-[var(--dojo-accent)]" />Explore o desafio recomendado</span>
          <span className="flex items-center gap-2"><span aria-hidden="true" className="size-2 rounded-full bg-[var(--dojo-accent)]" />Conheça sua conta</span>
        </div>
      </div>
    </article>
  );
}
