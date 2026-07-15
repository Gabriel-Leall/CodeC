"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Home, PanelLeftClose, PanelLeftOpen, Settings, Target, User } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

const NAVIGATION = [
  { href: "/", label: "Início", icon: Home },
  { href: "/challenges", label: "Desafios", icon: Target },
  { href: "/profile", label: "Perfil", icon: User },
  { href: "/profile#historico", label: "Histórico", icon: BookOpen },
  { href: "/profile#configuracoes", label: "Configurações", icon: Settings },
] as const;

const USER_STATUS_LABEL = "Disponível";

type SidebarUser = {
  name: string;
  image: string | null;
};

export function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: SidebarUser | null;
}) {
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
            return <Link key={label} href={href} title={sidebarCollapsed ? label : undefined} aria-label={sidebarCollapsed ? label : undefined} aria-current={active ? "page" : undefined} className={cn("relative flex items-center border border-transparent px-3 py-2.5 text-sm transition-colors", sidebarCollapsed ? "justify-center px-0" : "gap-3", active ? "bg-[color:var(--app-sidebar-active-surface)] text-[color:var(--app-sidebar-active-accent)] before:absolute before:inset-y-0 before:-left-3 before:w-0.5 before:bg-[color:var(--app-sidebar-active-accent)]" : "text-sidebar-foreground/70 hover:border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}><Icon className="size-4 shrink-0" /><span className={cn(sidebarCollapsed && "sr-only")}>{label}</span></Link>;
          })}
        </nav>
        <Link href="/profile" title={sidebarCollapsed ? "Perfil" : undefined} aria-label={sidebarCollapsed ? "Perfil" : undefined} className={cn("group flex items-center text-sm text-sidebar-foreground transition-colors hover:text-sidebar-accent-foreground", sidebarCollapsed ? "m-3 justify-center" : "m-5 gap-3")}>
          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-foreground">
            {user?.image ? <Image src={user.image} alt="" width={36} height={36} unoptimized className="size-full object-cover" /> : user?.name.slice(0, 1).toLocaleUpperCase()}
          </span>
          <span className={cn("min-w-0", sidebarCollapsed && "sr-only")}>
            <span className="block truncate font-medium">{user?.name ?? "Kodan"}</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-xs text-sidebar-foreground/60"><span className="size-1.5 rounded-full bg-[color:var(--app-sidebar-active-accent)]" aria-hidden="true" />{USER_STATUS_LABEL}</span>
          </span>
        </Link>
      </aside>
      <div className="min-w-0">
        <main className="min-h-svh">{children}</main>
      </div>
    </div>
  );
}
