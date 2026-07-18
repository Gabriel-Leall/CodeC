import Link from "next/link";
import { BookOpen, CircleHelp, MessageCircleQuestion, Swords } from "lucide-react";

const helpTopics = [
  { title: "Como iniciar um treino?", description: "Abra Todos os Desafios, escolha um exercício e continue para a arena de treino.", icon: Swords },
  { title: "Como funciona o ELO?", description: "Seu ELO evolui conforme a qualidade das respostas avaliadas nos desafios.", icon: BookOpen },
  { title: "Precisa de suporte?", description: "Use o perfil para conferir seus dados e o histórico disponível no momento.", icon: MessageCircleQuestion },
] as const;

export default function HelpPage() {
  return <main className="min-h-full bg-[#f8f6f1] px-6 py-12 text-[#18212c] sm:px-10"><div className="mx-auto max-w-4xl"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1c56b5]"><CircleHelp className="size-4" />Suporte</p><h1 className="mt-3 font-[Georgia] text-4xl font-bold text-[#151c26]">Ajuda do Kodan</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#687282]">Orientações rápidas para continuar sua jornada no Dojo.</p><div className="mt-10 grid gap-4 md:grid-cols-3">{helpTopics.map(({ title, description, icon: Icon }) => <article key={title} className="rounded-2xl border border-[#e3ded4] p-6"><Icon className="size-5 text-[#1c56b5]" /><h2 className="mt-5 font-[Georgia] text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-[#687282]">{description}</p></article>)}</div><Link href="/dashboard" className="mt-8 inline-flex rounded-xl bg-[#1c56b5] px-5 py-3 text-sm font-semibold text-white">Voltar ao Dojo</Link></div></main>;
}
