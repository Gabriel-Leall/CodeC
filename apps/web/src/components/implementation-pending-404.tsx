import Link from "next/link";
import { Construction, Home, Swords } from "lucide-react";

export function ImplementationPending404({ title, description }: { title: string; description: string }) {
  return (
    <main className="grid min-h-full place-items-center bg-[#f8f6f1] px-6 py-12 text-[#18212c]">
      <section className="w-full max-w-xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#edf3fb] text-[#1c56b5]"><Construction className="size-7" /></span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-[#1c56b5]">Erro 404</p>
        <h1 className="mt-3 font-[Georgia] text-4xl font-bold text-[#151c26] sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#687282]">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-[#1c56b5] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#154797]"><Home className="size-4" />Voltar ao Dojo</Link>
          <Link href="/challenges" className="inline-flex items-center gap-2 rounded-xl border border-[#d9d4cb] px-5 py-3 text-sm font-semibold text-[#293342] transition-colors hover:bg-[#edf3fb]"><Swords className="size-4" />Ver desafios</Link>
        </div>
      </section>
    </main>
  );
}
