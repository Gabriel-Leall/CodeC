"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, ChevronRight, Home, Menu, Settings, Target, User } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

const NAVIGATION = [
  { href: "/", label: "Início", icon: Home },
  { href: "/challenges", label: "Desafios", icon: Target },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/profile#historico", label: "Histórico", icon: BookOpen },
  { href: "/profile#configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAppRoute = pathname === "/profile" || pathname.startsWith("/challenges") || pathname.startsWith("/train") || pathname.startsWith("/dashboard");

  if (!isAppRoute) return <>{children}</>;

  return (
    <div className="min-h-svh bg-background text-foreground lg:grid lg:grid-cols-[244px_minmax(0,1fr)]">
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[244px] flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center gap-3 border-b border-border px-5"><span className="grid size-8 place-items-center border border-primary bg-primary text-sm font-bold text-primary-foreground">K</span><span className="font-serif text-lg font-bold tracking-[0.16em]">KODAN</span></div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Navegação principal">
          {NAVIGATION.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? false : pathname === href || pathname.startsWith(`${href}/`) || (href === "/challenges" && pathname.startsWith("/train"));
            return <Link key={label} href={href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 border px-3 py-2.5 text-sm transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{label}</Link>;
          })}
        </nav>
        <Link href="/profile" className="m-3 flex items-center justify-between border border-border p-3 text-sm hover:bg-muted"><span><span className="block font-medium">Treinador Kodan</span><span className="text-xs text-muted-foreground">Perfil e progresso</span></span><ChevronRight className="size-4" /></Link>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:px-7"><button type="button" aria-label="Abrir navegação" className="inline-flex size-9 items-center justify-center border border-border lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="size-4" /></button><div><p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Kodan</p><p className="text-sm font-medium">{pathname.startsWith("/profile") ? "Perfil do jogador" : pathname.startsWith("/train") ? "Arena de treino" : "Catálogo de desafios"}</p></div><button type="button" aria-label="Notificações" className="inline-flex size-9 items-center justify-center border border-border text-muted-foreground hover:bg-muted hover:text-foreground"><Bell className="size-4" /></button></header>
        <main className="min-h-[calc(100svh-4rem)]">{children}</main>
      </div>
      {mobileOpen ? <button type="button" aria-label="Fechar navegação" className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
    </div>
  );
}
