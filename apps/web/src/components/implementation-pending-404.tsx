import Link from "next/link";
import { Construction, Home, Swords } from "lucide-react";

export function ImplementationPending404({ title, description }: { title: string; description: string }) {
  return (
    <main className="grid min-h-full place-items-center bg-[var(--dojo-page)] px-6 py-12 text-[var(--dojo-ink)]">
      <section className="w-full max-w-xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--dojo-accent-soft)] text-[var(--dojo-accent)]"><Construction className="size-7" aria-hidden="true" /></span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-[var(--dojo-accent)]">Erro 404</p>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--dojo-muted)]">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--dojo-accent)] px-5 py-3 text-sm font-semibold text-[var(--dojo-surface)] transition-colors duration-200 hover:bg-[var(--dojo-accent-strong)]"><Home className="size-4" aria-hidden="true" />Voltar ao Dojo</Link>
          <Link href="/challenges" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[color:var(--dojo-border-strong)] px-5 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-[var(--dojo-accent-soft)]"><Swords className="size-4" aria-hidden="true" />Ver desafios</Link>
        </div>
      </section>
    </main>
  );
}
