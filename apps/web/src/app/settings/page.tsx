import Link from "next/link";
import { Palette, Settings, UserRound } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";

export default function SettingsPage() {
  return <main className="min-h-full bg-[#f8f6f1] px-6 py-12 text-[#18212c] sm:px-10"><div className="mx-auto max-w-3xl"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1c56b5]"><Settings className="size-4" />Preferências</p><h1 className="mt-3 font-[Georgia] text-4xl font-bold text-[#151c26]">Configurações</h1><div className="mt-10 space-y-4"><section className="flex items-center justify-between gap-5 rounded-2xl border border-[#e3ded4] p-6"><div className="flex items-start gap-4"><Palette className="mt-1 size-5 text-[#1c56b5]" /><div><h2 className="font-[Georgia] text-xl font-bold">Aparência</h2><p className="mt-1 text-sm text-[#687282]">Alterne o tema usado pela aplicação.</p></div></div><ModeToggle /></section><section className="flex items-center justify-between gap-5 rounded-2xl border border-[#e3ded4] p-6"><div className="flex items-start gap-4"><UserRound className="mt-1 size-5 text-[#1c56b5]" /><div><h2 className="font-[Georgia] text-xl font-bold">Perfil</h2><p className="mt-1 text-sm text-[#687282]">Edite seu nome, foto e consulte sua evolução.</p></div></div><Link href="/profile" className="rounded-xl border border-[#d9d4cb] px-4 py-2 text-sm font-semibold hover:bg-[#edf3fb]">Abrir perfil</Link></section></div></div></main>;
}
