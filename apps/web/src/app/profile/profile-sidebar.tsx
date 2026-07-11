import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Home,
  Lightbulb,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";

const PROFILE_ITEMS = [
  { label: "Visão geral", icon: Home, active: true },
  { label: "Progresso", icon: BarChart3, active: false },
  { label: "Histórico", icon: BookOpen, active: false },
  { label: "Conquistas", icon: Award, active: false },
  { label: "Recomendações", icon: Lightbulb, active: false },
  { label: "Configurações", icon: Settings, active: false },
] as const;

const REACT_TOPICS = [
  "Effects & Lifecycle",
  "State & Rendering",
  "Async UI & Races",
  "Forms & Validation",
  "Component Patterns",
] as const;

const TS_TOPICS = [
  "Type System",
  "Generics & Advanced Types",
  "Utility Types",
  "Narrowing & Inference",
  "Modules & Tooling",
] as const;

export function ProfileSidebar() {
  return (
    <aside className="row-span-2 hidden h-full min-h-0 flex-col border-r border-[color:var(--profile-border)] bg-[var(--profile-surface)] lg:flex">
      <div className="flex h-[72px] shrink-0 items-center gap-4 border-b border-[color:var(--profile-border)] px-6">
        <span className="inline-flex size-9 items-center justify-center rounded-[6px] border border-[color:var(--profile-accent-blue)] text-xl font-semibold text-[var(--profile-accent-blue)]">
          K
        </span>
        <span className="text-2xl font-semibold tracking-wide text-[var(--profile-text-primary)]">
          KODAN
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-5 py-5">
        <SidebarLabel>Perfil</SidebarLabel>
        <nav className="space-y-1">
          {PROFILE_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                aria-current={item.active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm ${
                  item.active
                    ? "bg-[var(--profile-accent-blue-soft)] text-[var(--profile-accent-blue)]"
                    : "text-[var(--profile-text-primary)]"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </div>
            );
          })}
        </nav>

        <div className="mt-8">
          <SidebarLabel>Tecnologias</SidebarLabel>
          <TechnologyBlock label="React" open topics={REACT_TOPICS} accent="⚛" />
          <TechnologyBlock label="TypeScript" topics={TS_TOPICS} accent="TS" />
        </div>
      </div>

      <div className="shrink-0 p-5">
        <div className="flex h-12 items-center justify-center gap-2 rounded-[7px] border border-[color:var(--profile-border)] text-sm text-[var(--profile-text-primary)]">
          <Download className="size-4" aria-hidden="true" />
          Exportar dados
        </div>
      </div>
    </aside>
  );
}

function SidebarLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 px-3 text-[0.68rem] uppercase tracking-[0.14em] text-[var(--profile-text-secondary)]">
      {children}
    </p>
  );
}

function TechnologyBlock({
  label,
  topics,
  accent,
  open = false,
}: {
  label: string;
  topics: readonly string[];
  accent: string;
  open?: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-3 py-2 text-sm text-[var(--profile-text-primary)]">
        <span className="flex items-center gap-3">
          <span className="inline-flex size-5 items-center justify-center rounded-[5px] bg-[var(--profile-accent-blue-soft)] text-[0.68rem] font-semibold text-[var(--profile-accent-blue)]">
            {accent}
          </span>
          {label}
        </span>
        <ChevronDown className="size-4" aria-hidden="true" />
      </div>

      <div className="ml-7 border-l border-[color:var(--profile-border)] pl-4">
        {topics.map((topic, index) => (
          <div
            key={topic}
            className="flex items-center gap-2 py-2 text-sm text-[var(--profile-text-primary)]"
          >
            {open && index === 0 ? (
              <ChevronDown className="size-3.5 text-[var(--profile-text-secondary)]" />
            ) : (
              <ChevronRight className="size-3.5 text-[var(--profile-text-secondary)]" />
            )}
            <span>{topic}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
