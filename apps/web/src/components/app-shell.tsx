"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronRight, Home, PanelLeftClose, PanelLeftOpen, Settings, Target, User } from "lucide-react";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isAppRoute = pathname === "/profile" || pathname.startsWith("/challenges") || pathname.startsWith("/train") || pathname.startsWith("/dashboard");

  if (!isAppRoute) return <>{children}</>;

  return (
    <div className={cn("min-h-svh bg-background text-foreground lg:grid", sidebarCollapsed ? "lg:grid-cols-[72px_minmax(0,1fr)]" : "lg:grid-cols-[244px_minmax(0,1fr)]")}>
      <aside className={cn("relative hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex", sidebarCollapsed ? "w-[72px]" : "w-[244px]") }>
        <div className={cn("flex h-16 items-center", sidebarCollapsed ? "justify-center px-2" : "justify-between px-5")}>
          <div className="flex items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center border border-sidebar-primary bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">K</span>
            <span className={cn("font-serif text-lg font-bold tracking-[0.16em]", sidebarCollapsed && "sr-only")}>KODAN</span>
          </div>
          {!sidebarCollapsed ? <button type="button" onClick={() => setSidebarCollapsed(true)} aria-label="Recolher sidebar" aria-pressed={false} className="inline-flex size-7 items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"><PanelLeftClose className="size-3.5" /></button> : null}
        </div>
        {sidebarCollapsed ? <div className="flex h-11 shrink-0 items-center justify-center"><button type="button" onClick={() => setSidebarCollapsed(false)} aria-label="Expandir sidebar" aria-pressed className="inline-flex size-7 items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-accent-foreground"><PanelLeftOpen className="size-3.5" /></button></div> : null}
        <nav className="flex-1 space-y-1 p-3" aria-label="Navegação principal">
          {NAVIGATION.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? false : pathname === href || pathname.startsWith(`${href}/`) || (href === "/challenges" && pathname.startsWith("/train"));
            return <Link key={label} href={href} title={sidebarCollapsed ? label : undefined} aria-label={sidebarCollapsed ? label : undefined} aria-current={active ? "page" : undefined} className={cn("relative flex items-center border px-3 py-2.5 text-sm transition-colors", sidebarCollapsed ? "justify-center px-0" : "gap-3", active ? "border-transparent bg-sidebar-accent text-sidebar-primary before:absolute before:inset-y-0 before:-left-3 before:w-0.5 before:bg-sidebar-primary" : "border-transparent text-sidebar-foreground/70 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}><Icon className="size-4 shrink-0" /><span className={cn(sidebarCollapsed && "sr-only")}>{label}</span></Link>;
          })}
        </nav>
        <Link href="/profile" title={sidebarCollapsed ? "Perfil e progresso" : undefined} aria-label={sidebarCollapsed ? "Perfil e progresso" : undefined} className={cn("flex items-center border border-sidebar-border text-sm hover:bg-sidebar-accent", sidebarCollapsed ? "m-2 justify-center p-2" : "m-3 justify-between p-3")}><span className={cn(sidebarCollapsed && "sr-only")}><span className="block font-medium">Treinador Kodan</span><span className="text-xs text-sidebar-foreground/60">Perfil e progresso</span></span>{sidebarCollapsed ? <User className="size-4" /> : <ChevronRight className="size-4" />}</Link>
      </aside>
      <div className="min-w-0">
        <main className="min-h-svh">{children}</main>
      </div>
    </div>
  );
}
