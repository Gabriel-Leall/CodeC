# KODAN User Profile Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the new central user profile screen for KODAN as a calm study dossier, matching the light and dark references while leaving sidebar work out of scope.

**Architecture:** Replace the current `/profile` route's reused dashboard component with a split profile feature under `apps/web/src/app/profile/`. Keep tokens scoped with `data-profile-screen="true"`, create reusable profile primitives in `@kodan/ui`, and assemble the page from typed view-model data so the screen can start with static contract data and later accept real analytics.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, CSS custom properties, ECharts via `echarts-for-react`, `next-themes`, Bun test, `@kodan/ui`.

---

## Scope Decisions

- Implement only the main user profile content area: identity hero, stats row, ELO chart, topic mastery, recent sessions, recommended challenges, and achievements.
- Do not implement or modify the profile sidebar from the spec in this task.
- Do not modify `apps/web/src/components/header.tsx`, `apps/web/src/app/dashboard/challenges/challenges-docs-sidebar.tsx`, or any global navigation behavior in this task.
- Keep the existing app shell/header behavior around `/profile`; this plan treats the screenshot's sidebar/header as visual context only.
- Use `docs/ui/profile-docs-trainer-spec.md` as the UI contract and the two provided images as the light/dark visual references.
- Use typed static profile data first, as required by the spec, then leave clean seams for real data integration without putting data logic inside visual components.

## File Structure

Create or modify these files:

- Modify: `apps/web/src/app/profile/page.tsx`
- Create: `apps/web/src/app/profile/profile-content.tsx`
- Create: `apps/web/src/app/profile/profile-data.ts`
- Create: `apps/web/src/app/profile/profile-data.test.ts`
- Create: `apps/web/src/app/profile/profile-types.ts`
- Create: `apps/web/src/app/profile/profile-formatters.ts`
- Create: `apps/web/src/app/profile/profile-hero.tsx`
- Create: `apps/web/src/app/profile/profile-stats-row.tsx`
- Create: `apps/web/src/app/profile/profile-elo-chart-card.tsx`
- Create: `apps/web/src/app/profile/profile-topic-mastery-card.tsx`
- Create: `apps/web/src/app/profile/profile-recent-sessions-card.tsx`
- Create: `apps/web/src/app/profile/profile-recommendations-card.tsx`
- Create: `apps/web/src/app/profile/profile-achievements-card.tsx`
- Create: `apps/web/src/app/profile/profile-state-panel.tsx`
- Create: `apps/web/src/app/profile/loading.tsx`
- Modify: `apps/web/src/index.css`
- Create: `packages/ui/src/components/profile/section-card.tsx`
- Create: `packages/ui/src/components/profile/progress-bar.tsx`
- Create: `packages/ui/src/components/profile/data-table.tsx`
- Create: `packages/ui/src/components/profile/achievement-badge.tsx`
- Create: `packages/ui/src/components/profile/index.ts`
- Modify: `packages/ui/package.json`
- Modify: `packages/ui/src/index.ts`

Keep file responsibilities narrow:

- `profile-data.ts`: static view model and small pure helpers only.
- `profile-types.ts`: shared profile contracts only.
- `profile-content.tsx`: page assembly and responsive grid only.
- Card files: one feature card each.
- `packages/ui/src/components/profile/*`: reusable low-level primitives with no KODAN-specific data.
- `apps/web/src/index.css`: scoped profile theme tokens and state classes only.

---

### Task 1: Profile Contracts And Static View Model

**Files:**
- Create: `apps/web/src/app/profile/profile-types.ts`
- Create: `apps/web/src/app/profile/profile-formatters.ts`
- Create: `apps/web/src/app/profile/profile-data.ts`
- Create: `apps/web/src/app/profile/profile-data.test.ts`

- [ ] **Step 1: Write the failing data tests**

Create `apps/web/src/app/profile/profile-data.test.ts`:

```ts
import { describe, expect, it } from "bun:test";

import {
  buildStaticProfileViewModel,
  clampProficiency,
  getProfileRankLabel,
} from "./profile-data";

describe("profile-data", () => {
  it("builds the study dossier contract from the visual spec", () => {
    const viewModel = buildStaticProfileViewModel();

    expect(viewModel.user.name).toBe("Nakamura");
    expect(viewModel.user.rank).toBe("RONIN");
    expect(viewModel.user.elo).toBe(1687);
    expect(viewModel.stats).toHaveLength(5);
    expect(viewModel.topicMastery).toHaveLength(5);
    expect(viewModel.recentSessions).toHaveLength(5);
    expect(viewModel.recommendations).toHaveLength(5);
    expect(viewModel.achievements).toHaveLength(4);
  });

  it("keeps proficiency values inside progress bar bounds", () => {
    expect(clampProficiency(-12)).toBe(0);
    expect(clampProficiency(74)).toBe(74);
    expect(clampProficiency(200)).toBe(100);
  });

  it("maps ELO into profile rank labels", () => {
    expect(getProfileRankLabel(900)).toBe("KYU");
    expect(getProfileRankLabel(1687)).toBe("RONIN");
    expect(getProfileRankLabel(1900)).toBe("SENSEI");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
bun test apps/web/src/app/profile/profile-data.test.ts
```

Expected: FAIL because `profile-data.ts` does not exist yet.

- [ ] **Step 3: Add the profile type contracts**

Create `apps/web/src/app/profile/profile-types.ts`:

```ts
export type ProfileDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ProfileSessionStatus = "resolved" | "in_progress" | "not_started";
export type AchievementTone = "blue" | "green" | "orange" | "indigo";

export interface ProfileUserSummary {
  id: string;
  name: string;
  image: string | null;
  planLabel: string;
  tagline: string;
  memberSinceLabel: string;
  countryLabel: string;
  timezoneLabel: string;
  rank: string;
  elo: number;
  topPercentLabel: string;
}

export interface ProfileStatItem {
  id: string;
  label: string;
  value: string;
  accent?: "warning";
}

export interface EloPoint {
  dateLabel: string;
  elo: number;
}

export interface TopicMasteryItem {
  topicId: string;
  label: string;
  proficiency: number;
}

export interface RecentSessionItem {
  id: string;
  dateLabel: string;
  challenge: string;
  difficulty: ProfileDifficulty;
  result: ProfileSessionStatus;
  eloChange: number | null;
}

export interface RecommendedChallengeItem {
  id: string;
  challenge: string;
  topic: string;
  difficulty: ProfileDifficulty;
  possibleElo: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  unlockedAtLabel: string;
  tone: AchievementTone;
}

export interface ProfileViewModel {
  user: ProfileUserSummary;
  stats: ProfileStatItem[];
  eloSeries: EloPoint[];
  topicMastery: TopicMasteryItem[];
  recentSessions: RecentSessionItem[];
  recommendations: RecommendedChallengeItem[];
  achievements: AchievementItem[];
}
```

- [ ] **Step 4: Add small formatters**

Create `apps/web/src/app/profile/profile-formatters.ts`:

```ts
const PT_BR_INTEGER = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

export function formatInteger(value: number) {
  return PT_BR_INTEGER.format(value);
}

export function formatSignedElo(value: number | null) {
  if (value === null) {
    return "—";
  }

  return value > 0 ? `+${value}` : `${value}`;
}

export function formatDifficultyLabel(difficulty: string) {
  if (difficulty === "EASY") {
    return "Fácil";
  }

  if (difficulty === "MEDIUM") {
    return "Média";
  }

  if (difficulty === "HARD") {
    return "Difícil";
  }

  return difficulty;
}

export function formatSessionStatusLabel(status: string) {
  if (status === "resolved") {
    return "Resolvido";
  }

  if (status === "in_progress") {
    return "Em progresso";
  }

  return "Não iniciado";
}
```

- [ ] **Step 5: Add the static view model**

Create `apps/web/src/app/profile/profile-data.ts`:

```ts
import type { ProfileViewModel } from "./profile-types";

export function clampProficiency(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getProfileRankLabel(elo: number) {
  if (elo >= 1850) {
    return "SENSEI";
  }

  if (elo >= 1550) {
    return "RONIN";
  }

  return "KYU";
}

export function buildStaticProfileViewModel(): ProfileViewModel {
  return {
    user: {
      id: "local-nakamura",
      name: "Nakamura",
      image: "/avatar-nakamura.png",
      planLabel: "PRO",
      tagline: "Código com clareza. Diagnose com precisão. Ascenda.",
      memberSinceLabel: "Membro desde 12/2023",
      countryLabel: "Brasil",
      timezoneLabel: "Fuso horário: BRT",
      rank: getProfileRankLabel(1687),
      elo: 1687,
      topPercentLabel: "Top 12%",
    },
    stats: [
      { id: "resolved", label: "Desafios resolvidos", value: "142" },
      { id: "streak", label: "Sequência atual", value: "27 dias", accent: "warning" },
      { id: "accuracy", label: "Taxa de acerto", value: "87%" },
      { id: "study-hours", label: "Horas de estudo", value: "86 h" },
      { id: "attempts", label: "Tentativas de desafios", value: "312" },
    ],
    eloSeries: [
      { dateLabel: "5 Mai", elo: 1298 },
      { dateLabel: "7 Mai", elo: 1342 },
      { dateLabel: "9 Mai", elo: 1328 },
      { dateLabel: "12 Mai", elo: 1518 },
      { dateLabel: "14 Mai", elo: 1472 },
      { dateLabel: "16 Mai", elo: 1510 },
      { dateLabel: "19 Mai", elo: 1624 },
      { dateLabel: "21 Mai", elo: 1582 },
      { dateLabel: "23 Mai", elo: 1610 },
      { dateLabel: "26 Mai", elo: 1704 },
      { dateLabel: "28 Mai", elo: 1648 },
      { dateLabel: "30 Mai", elo: 1686 },
      { dateLabel: "2 Jun", elo: 1687 },
    ],
    topicMastery: [
      { topicId: "effects-lifecycle", label: "Effects & Lifecycle", proficiency: clampProficiency(92) },
      { topicId: "state-rendering", label: "State & Rendering", proficiency: clampProficiency(85) },
      { topicId: "async-races", label: "Async UI & Races", proficiency: clampProficiency(78) },
      { topicId: "forms-validation", label: "Forms & Validation", proficiency: clampProficiency(74) },
      { topicId: "component-patterns", label: "Component Patterns", proficiency: clampProficiency(70) },
    ],
    recentSessions: [
      { id: "s1", dateLabel: "02 Jun, 2024", challenge: "Dependências do useEffect", difficulty: "MEDIUM", result: "resolved", eloChange: 20 },
      { id: "s2", dateLabel: "01 Jun, 2024", challenge: "Cleanup Functions", difficulty: "MEDIUM", result: "resolved", eloChange: 18 },
      { id: "s3", dateLabel: "31 Mai, 2024", challenge: "Stale Closures", difficulty: "HARD", result: "resolved", eloChange: 22 },
      { id: "s4", dateLabel: "30 Mai, 2024", challenge: "Race conditions em fetch", difficulty: "HARD", result: "in_progress", eloChange: null },
      { id: "s5", dateLabel: "29 Mai, 2024", challenge: "Composição de Handlers", difficulty: "MEDIUM", result: "not_started", eloChange: null },
    ],
    recommendations: [
      { id: "r1", challenge: "AbortController em Fetch", topic: "Async UI & Races", difficulty: "MEDIUM", possibleElo: 18 },
      { id: "r2", challenge: "useTransition na prática", topic: "State & Rendering", difficulty: "MEDIUM", possibleElo: 18 },
      { id: "r3", challenge: "Validação assíncrona", topic: "Forms & Validation", difficulty: "MEDIUM", possibleElo: 16 },
      { id: "r4", challenge: "Debounce e Cancelamento", topic: "Async UI & Races", difficulty: "HARD", possibleElo: 22 },
      { id: "r5", challenge: "Tipagem de eventos", topic: "Type System", difficulty: "MEDIUM", possibleElo: 16 },
    ],
    achievements: [
      { id: "a1", title: "Foco Sustentado", description: "Estude por 20 dias consecutivos", unlockedAtLabel: "Desbloqueado em 02 Jun", tone: "blue" },
      { id: "a2", title: "Diagnóstico Afiado", description: "Resolva 100 desafios", unlockedAtLabel: "Desbloqueado em 28 Mai", tone: "green" },
      { id: "a3", title: "React Avançado", description: "Complete 10 desafios difíceis", unlockedAtLabel: "Desbloqueado em 21 Mai", tone: "orange" },
      { id: "a4", title: "Mestre em Effects", description: "Resolva 25 desafios de Effects", unlockedAtLabel: "Desbloqueado em 15 Mai", tone: "indigo" },
    ],
  };
}
```

- [ ] **Step 6: Run the test and commit**

Run:

```bash
bun test apps/web/src/app/profile/profile-data.test.ts
```

Expected: PASS.

Commit:

```bash
git add apps/web/src/app/profile/profile-types.ts apps/web/src/app/profile/profile-formatters.ts apps/web/src/app/profile/profile-data.ts apps/web/src/app/profile/profile-data.test.ts
git commit -m "feat(profile): add profile view model contract"
```

---

### Task 2: Scoped Profile Theme Tokens

**Files:**
- Modify: `apps/web/src/index.css`

- [ ] **Step 1: Add light and dark tokens scoped to the profile screen**

Append this block after the existing challengers token block in `apps/web/src/index.css`:

```css
[data-profile-screen="true"] {
  --profile-bg: #f8f7f3;
  --profile-surface: #fcfbf8;
  --profile-surface-elevated: #fefefc;
  --profile-border: #e7e2d8;
  --profile-border-strong: #d9d3c7;
  --profile-text-primary: #1b2230;
  --profile-text-secondary: #5f6b7d;
  --profile-text-muted: #8691a3;
  --profile-accent-blue: #2563eb;
  --profile-accent-blue-soft: #e9f1ff;
  --profile-success: #2e8b57;
  --profile-warning: #e08a1e;
  --profile-danger: #d04848;
  --profile-shadow-sm: 0 6px 18px rgba(16, 24, 40, 0.04);
  --profile-shadow-md: 0 10px 28px rgba(16, 24, 40, 0.05);
}

.dark [data-profile-screen="true"] {
  --profile-bg: #111111;
  --profile-surface: #161616;
  --profile-surface-elevated: #1b1b1b;
  --profile-border: #222222;
  --profile-border-strong: #2b2b2b;
  --profile-text-primary: #f6f3ed;
  --profile-text-secondary: rgba(246, 243, 237, 0.74);
  --profile-text-muted: rgba(246, 243, 237, 0.56);
  --profile-accent-blue: #5a8dbf;
  --profile-accent-blue-soft: rgba(90, 141, 191, 0.16);
  --profile-success: #6fbf73;
  --profile-warning: #f1a64b;
  --profile-danger: #e36b6b;
  --profile-shadow-sm: none;
  --profile-shadow-md: none;
}

[data-profile-screen="true"] .profile-panel {
  background: var(--profile-surface);
  border-color: var(--profile-border);
  box-shadow: var(--profile-shadow-sm);
}

.dark [data-profile-screen="true"] .profile-panel {
  box-shadow: none;
}

[data-profile-screen="true"] .profile-control:focus-visible,
[data-profile-screen="true"] a:focus-visible,
[data-profile-screen="true"] button:focus-visible {
  outline: 2px solid var(--profile-accent-blue);
  outline-offset: 2px;
}

[data-profile-screen="true"] .profile-table-row:hover {
  background: color-mix(in srgb, var(--profile-accent-blue-soft) 55%, transparent);
}
```

The elevated light surface uses `#fefefc` instead of pure `#ffffff` to keep the visual close to the spec while respecting the existing project rule against pure white.

- [ ] **Step 2: Run type/build checks for CSS integration**

Run:

```bash
bun run --filter web build
```

Expected: PASS. If the build fails because unrelated database or environment state is missing, run:

```bash
bun run --filter web check-types
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/index.css
git commit -m "feat(profile): add scoped profile theme tokens"
```

---

### Task 3: Shared Profile UI Primitives

**Files:**
- Create: `packages/ui/src/components/profile/section-card.tsx`
- Create: `packages/ui/src/components/profile/progress-bar.tsx`
- Create: `packages/ui/src/components/profile/data-table.tsx`
- Create: `packages/ui/src/components/profile/achievement-badge.tsx`
- Create: `packages/ui/src/components/profile/index.ts`
- Modify: `packages/ui/package.json`
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Create `SectionCard`**

Create `packages/ui/src/components/profile/section-card.tsx`:

```tsx
import type { ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

export function SectionCard({
  title,
  action,
  footer,
  className,
  children,
}: {
  title?: string;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "profile-panel overflow-hidden rounded-[8px] border text-[var(--profile-text-primary)]",
        className,
      )}
    >
      {title || action ? (
        <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-4">
          {title ? (
            <h2 className="font-serif text-[1.05rem] font-semibold leading-tight">
              {title}
            </h2>
          ) : (
            <span aria-hidden="true" />
          )}
          {action}
        </div>
      ) : null}
      <div className="px-5 pb-5">{children}</div>
      {footer ? (
        <div className="border-t border-[color:var(--profile-border)] px-5 py-3">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 2: Create `ProgressBar`**

Create `packages/ui/src/components/profile/progress-bar.tsx`:

```tsx
import { cn } from "@kodan/ui/lib/utils";

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div
      className={cn(
        "h-1.5 overflow-hidden rounded-full bg-[color:var(--profile-border)]",
        className,
      )}
      aria-label={label}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
    >
      <div
        className="h-full rounded-full bg-[var(--profile-accent-blue)]"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Create `DataTable`**

Create `packages/ui/src/components/profile/data-table.tsx`:

```tsx
import type { ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";

export interface DataTableColumn<TItem> {
  key: string;
  header: string;
  className?: string;
  render: (item: TItem) => ReactNode;
}

export function DataTable<TItem extends { id: string }>({
  columns,
  items,
  emptyMessage,
}: {
  columns: DataTableColumn<TItem>[];
  items: TItem[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-[color:var(--profile-border)] px-4 py-5 text-sm text-[var(--profile-text-secondary)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-[color:var(--profile-border)] text-[0.68rem] uppercase tracking-[0.12em] text-[var(--profile-text-muted)]">
            {columns.map((column) => (
              <th key={column.key} className={cn("pb-2 font-medium", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--profile-border)]">
          {items.map((item) => (
            <tr key={item.id} className="profile-table-row transition-colors">
              {columns.map((column) => (
                <td key={column.key} className={cn("py-2.5", column.className)}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Create `AchievementBadge`**

Create `packages/ui/src/components/profile/achievement-badge.tsx`:

```tsx
import type { ReactNode } from "react";

const TONE_CLASS_NAMES = {
  blue: "border-[var(--profile-accent-blue)] text-[var(--profile-accent-blue)]",
  green: "border-[var(--profile-success)] text-[var(--profile-success)]",
  orange: "border-[var(--profile-warning)] text-[var(--profile-warning)]",
  indigo: "border-[var(--profile-accent-blue)] text-[var(--profile-accent-blue)]",
} as const;

export function AchievementBadge({
  tone,
  children,
}: {
  tone: keyof typeof TONE_CLASS_NAMES;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex size-12 shrink-0 items-center justify-center rounded-[14px] border bg-[var(--profile-surface-elevated)] ${TONE_CLASS_NAMES[tone]}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 5: Export profile primitives**

Create `packages/ui/src/components/profile/index.ts`:

```ts
export { AchievementBadge } from "./achievement-badge";
export { DataTable, type DataTableColumn } from "./data-table";
export { ProgressBar } from "./progress-bar";
export { SectionCard } from "./section-card";
```

Modify `packages/ui/package.json` exports:

```json
"./components/profile": "./src/components/profile/index.ts",
"./components/profile/*": "./src/components/profile/*.tsx",
```

Modify `packages/ui/src/index.ts`:

```ts
export * from "./components/profile";
```

- [ ] **Step 6: Check package types and commit**

Run:

```bash
bun run --filter @kodan/ui check-types
```

Expected: PASS.

Commit:

```bash
git add packages/ui/src/components/profile packages/ui/package.json packages/ui/src/index.ts
git commit -m "feat(ui): add profile dossier primitives"
```

---

### Task 4: Route And Content Composition

**Files:**
- Modify: `apps/web/src/app/profile/page.tsx`
- Create: `apps/web/src/app/profile/profile-content.tsx`
- Create: `apps/web/src/app/profile/profile-state-panel.tsx`
- Create: `apps/web/src/app/profile/loading.tsx`

- [ ] **Step 1: Replace the reused dashboard route**

Modify `apps/web/src/app/profile/page.tsx`:

```tsx
import { buildStaticProfileViewModel } from "./profile-data";
import { ProfileContent } from "./profile-content";

export default async function ProfilePage() {
  const profile = buildStaticProfileViewModel();

  return (
    <main
      data-profile-screen="true"
      className="min-h-full overflow-auto bg-[var(--profile-bg)] text-[var(--profile-text-primary)]"
    >
      <ProfileContent profile={profile} />
    </main>
  );
}
```

- [ ] **Step 2: Create the composed content layout**

Create `apps/web/src/app/profile/profile-content.tsx`:

```tsx
import type { ProfileViewModel } from "./profile-types";
import { ProfileAchievementsCard } from "./profile-achievements-card";
import { ProfileEloChartCard } from "./profile-elo-chart-card";
import { ProfileHero } from "./profile-hero";
import { ProfileRecentSessionsCard } from "./profile-recent-sessions-card";
import { ProfileRecommendationsCard } from "./profile-recommendations-card";
import { ProfileStatsRow } from "./profile-stats-row";
import { ProfileTopicMasteryCard } from "./profile-topic-mastery-card";

export function ProfileContent({ profile }: { profile: ProfileViewModel }) {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <ProfileHero user={profile.user} />
      <ProfileStatsRow stats={profile.stats} />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <ProfileEloChartCard points={profile.eloSeries} />
        <ProfileTopicMasteryCard topics={profile.topicMastery} />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <ProfileRecentSessionsCard sessions={profile.recentSessions} />
        <ProfileRecommendationsCard recommendations={profile.recommendations} />
      </section>
      <ProfileAchievementsCard achievements={profile.achievements} />
    </div>
  );
}
```

- [ ] **Step 3: Add route loading skeleton**

Create `apps/web/src/app/profile/loading.tsx`:

```tsx
export default function ProfileLoading() {
  return (
    <main
      data-profile-screen="true"
      className="min-h-full bg-[var(--profile-bg)] px-4 py-5 sm:px-6 lg:px-8 lg:py-7"
    >
      <div className="mx-auto flex w-full max-w-[1280px] animate-pulse flex-col gap-4">
        <div className="h-28 rounded-[8px] border border-[color:var(--profile-border)] bg-[var(--profile-surface)]" />
        <div className="h-20 rounded-[8px] border border-[color:var(--profile-border)] bg-[var(--profile-surface)]" />
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="h-64 rounded-[8px] border border-[color:var(--profile-border)] bg-[var(--profile-surface)]" />
          <div className="h-64 rounded-[8px] border border-[color:var(--profile-border)] bg-[var(--profile-surface)]" />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Add reusable state panel**

Create `apps/web/src/app/profile/profile-state-panel.tsx`:

```tsx
export function ProfileStatePanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[8px] border border-dashed border-[color:var(--profile-border)] bg-[var(--profile-surface-elevated)] px-5 py-6">
      <h3 className="font-serif text-lg font-semibold text-[var(--profile-text-primary)]">
        {title}
      </h3>
      <p className="mt-2 max-w-[56ch] text-sm leading-6 text-[var(--profile-text-secondary)]">
        {description}
      </p>
    </div>
  );
}
```

- [ ] **Step 5: Run type checks and commit**

Run:

```bash
bun run --filter web check-types
```

Expected: FAIL until the referenced card components are created in the next tasks. Do not commit until Task 7 completes and type checks pass.

---

### Task 5: Hero And Stats Row

**Files:**
- Create: `apps/web/src/app/profile/profile-hero.tsx`
- Create: `apps/web/src/app/profile/profile-stats-row.tsx`

- [ ] **Step 1: Create the identity hero**

Create `apps/web/src/app/profile/profile-hero.tsx`:

```tsx
import { CalendarDays, Clock, MapPin } from "lucide-react";

import type { ProfileUserSummary } from "./profile-types";

export function ProfileHero({ user }: { user: ProfileUserSummary }) {
  return (
    <section className="grid gap-5 py-2 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-center">
      <div className="flex min-w-0 items-center gap-5">
        <ProfileAvatar name={user.name} image={user.image} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-[2rem] font-semibold leading-tight text-[var(--profile-text-primary)]">
              {user.name}
            </h1>
            <span className="rounded-[5px] bg-[var(--profile-accent-blue)] px-2 py-0.5 text-[0.68rem] font-semibold text-white">
              {user.planLabel}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--profile-text-secondary)]">
            {user.tagline}
          </p>
          <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--profile-text-secondary)]">
            <ProfileMetaItem icon={<CalendarDays className="size-3.5" />} value={user.memberSinceLabel} />
            <ProfileMetaItem icon={<MapPin className="size-3.5" />} value={user.countryLabel} />
            <ProfileMetaItem icon={<Clock className="size-3.5" />} value={user.timezoneLabel} />
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 rounded-[8px] border border-transparent px-2 py-2 lg:justify-self-end">
        <div className="flex items-center gap-4">
          <span className="inline-flex size-14 items-center justify-center rounded-[14px] border border-[color:var(--profile-border-strong)] bg-[var(--profile-surface-elevated)] font-serif text-2xl font-semibold">
            龍
          </span>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--profile-text-muted)]">
              Rank
            </p>
            <p className="font-serif text-xl font-semibold text-[var(--profile-text-primary)]">
              {user.rank}
            </p>
          </div>
        </div>
        <div className="h-16 w-px bg-[var(--profile-border-strong)]" />
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--profile-text-muted)]">
            Elo atual
          </p>
          <p className="font-serif text-3xl font-semibold leading-tight text-[var(--profile-accent-blue)]">
            {user.elo}
          </p>
          <p className="mt-1 text-sm text-[var(--profile-text-secondary)]">
            {user.topPercentLabel}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfileAvatar({ name, image }: { name: string; image: string | null }) {
  const initials =
    name
      .split(" ")
      .flatMap((part) => (part.trim()[0] ? [part.trim()[0]!] : []))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "K";

  if (image) {
    return (
      <img
        src={image}
        alt={`Avatar de ${name}`}
        className="size-24 shrink-0 rounded-full border border-[color:var(--profile-border-strong)] object-cover"
      />
    );
  }

  return (
    <div className="grid size-24 shrink-0 place-items-center rounded-full border border-[color:var(--profile-border-strong)] bg-[var(--profile-surface-elevated)] font-serif text-2xl font-semibold">
      {initials}
    </div>
  );
}

function ProfileMetaItem({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span>{value}</span>
    </div>
  );
}
```

If `next lint` or React Doctor flags raw `<img>`, switch to `next/image` with `unoptimized` for data URLs and keep the same visual sizing.

- [ ] **Step 2: Create the single stats band**

Create `apps/web/src/app/profile/profile-stats-row.tsx`:

```tsx
import { Flame } from "lucide-react";

import { SectionCard } from "@kodan/ui/components/profile";
import type { ProfileStatItem } from "./profile-types";

export function ProfileStatsRow({ stats }: { stats: ProfileStatItem[] }) {
  return (
    <SectionCard className="rounded-[8px]">
      <dl className="grid gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="px-3 lg:border-r lg:border-[color:var(--profile-border)] lg:last:border-r-0"
          >
            <dt className="text-xs text-[var(--profile-text-secondary)]">
              {stat.label}
            </dt>
            <dd className="mt-2 flex items-center gap-2 font-serif text-2xl font-medium text-[var(--profile-text-primary)]">
              {stat.accent === "warning" ? (
                <Flame className="size-4 text-[var(--profile-warning)]" aria-hidden="true" />
              ) : null}
              <span>{stat.value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}
```

- [ ] **Step 3: Keep the hero and stats visually restrained**

Check these rules while implementing:

- The hero itself should not be a heavy card.
- The stats row is one band with internal dividers, not five separate cards.
- `font-serif` is used for `Nakamura`, rank, section headings, and large numbers.
- Labels and table metadata remain compact and subdued.

---

### Task 6: ELO Chart And Topic Mastery Cards

**Files:**
- Create: `apps/web/src/app/profile/profile-elo-chart-card.tsx`
- Create: `apps/web/src/app/profile/profile-topic-mastery-card.tsx`

- [ ] **Step 1: Create the ELO chart card**

Create `apps/web/src/app/profile/profile-elo-chart-card.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";
import { useTheme } from "next-themes";

import { SectionCard } from "@kodan/ui/components/profile";
import type { EloPoint } from "./profile-types";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function ProfileEloChartCard({ points }: { points: EloPoint[] }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const option = createEloChartOption(points, isDark);

  return (
    <SectionCard
      title="Evolução do ELO"
      action={
        <button
          type="button"
          className="profile-control rounded-[7px] border border-[color:var(--profile-border)] bg-[var(--profile-surface-elevated)] px-3 py-1.5 text-xs text-[var(--profile-text-primary)]"
        >
          Últimos 30 dias
        </button>
      }
    >
      <div className="h-[250px]">
        <ReactECharts
          option={option}
          style={{ width: "100%", height: "100%" }}
          opts={{ renderer: "svg" }}
          notMerge
        />
      </div>
    </SectionCard>
  );
}

function createEloChartOption(points: EloPoint[], isDark: boolean): EChartsOption {
  const values = points.map((point) => point.elo);
  const min = Math.min(...values, 1000);
  const max = Math.max(...values, 2000);

  return {
    animationDuration: 420,
    animationEasing: "cubicOut",
    grid: { left: 44, right: 20, top: 18, bottom: 30 },
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#1b1b1b" : "#fefefc",
      borderColor: isDark ? "#2b2b2b" : "#d9d3c7",
      borderWidth: 1,
      textStyle: {
        color: isDark ? "#f6f3ed" : "#1b2230",
        fontSize: 12,
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: points.map((point) => point.dateLabel),
      axisLine: { lineStyle: { color: isDark ? "#2b2b2b" : "#e7e2d8" } },
      axisTick: { show: false },
      axisLabel: { color: isDark ? "rgba(246,243,237,.56)" : "#5f6b7d", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      min: Math.max(0, Math.floor((min - 120) / 100) * 100),
      max: Math.ceil((max + 120) / 100) * 100,
      splitNumber: 4,
      axisLabel: { color: isDark ? "rgba(246,243,237,.56)" : "#5f6b7d", fontSize: 11 },
      splitLine: { lineStyle: { color: isDark ? "#222222" : "#e7e2d8" } },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: 0.28,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { color: isDark ? "#5a8dbf" : "#2563eb", width: 3 },
        itemStyle: { color: isDark ? "#5a8dbf" : "#2563eb" },
      },
    ],
  };
}
```

- [ ] **Step 2: Create topic mastery card**

Create `apps/web/src/app/profile/profile-topic-mastery-card.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProgressBar, SectionCard } from "@kodan/ui/components/profile";
import type { TopicMasteryItem } from "./profile-types";

export function ProfileTopicMasteryCard({
  topics,
}: {
  topics: TopicMasteryItem[];
}) {
  return (
    <SectionCard
      title="Domínio por tópico"
      footer={
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--profile-accent-blue)]"
        >
          Ver todos os tópicos
          <ArrowRight className="size-4" />
        </Link>
      }
    >
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3">
        <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--profile-text-muted)]">
          Tópico
        </div>
        <div className="text-right text-[0.68rem] uppercase tracking-[0.12em] text-[var(--profile-text-muted)]">
          Proficiência
        </div>
        {topics.map((topic) => (
          <TopicRow key={topic.topicId} topic={topic} />
        ))}
      </div>
    </SectionCard>
  );
}

function TopicRow({ topic }: { topic: TopicMasteryItem }) {
  return (
    <>
      <div className="grid min-w-0 grid-cols-[minmax(120px,1fr)_minmax(150px,0.95fr)] items-center gap-4">
        <span className="truncate text-sm text-[var(--profile-text-primary)]">
          {topic.label}
        </span>
        <ProgressBar value={topic.proficiency} label={`${topic.label}: ${topic.proficiency}%`} />
      </div>
      <div className="text-right text-sm tabular-nums text-[var(--profile-text-primary)]">
        {topic.proficiency}%
      </div>
    </>
  );
}
```

- [ ] **Step 3: Check visual rules**

Verify:

- The chart has one line only.
- The final point is visible enough without a glow.
- Topic bars use blue fill and a neutral track.
- The card does not look like a financial analytics widget.

---

### Task 7: Operational Cards And Achievements

**Files:**
- Create: `apps/web/src/app/profile/profile-recent-sessions-card.tsx`
- Create: `apps/web/src/app/profile/profile-recommendations-card.tsx`
- Create: `apps/web/src/app/profile/profile-achievements-card.tsx`

- [ ] **Step 1: Create recent sessions card**

Create `apps/web/src/app/profile/profile-recent-sessions-card.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DataTable, SectionCard, type DataTableColumn } from "@kodan/ui/components/profile";
import { formatDifficultyLabel, formatSessionStatusLabel, formatSignedElo } from "./profile-formatters";
import type { RecentSessionItem } from "./profile-types";

const COLUMNS: DataTableColumn<RecentSessionItem>[] = [
  { key: "date", header: "Data", render: (item) => item.dateLabel },
  { key: "challenge", header: "Desafio", render: (item) => item.challenge },
  { key: "difficulty", header: "Dificuldade", render: (item) => formatDifficultyLabel(item.difficulty) },
  {
    key: "result",
    header: "Resultado",
    render: (item) => (
      <span className={getStatusClassName(item.result)}>
        {formatSessionStatusLabel(item.result)}
      </span>
    ),
  },
  {
    key: "elo",
    header: "ELO",
    className: "text-right",
    render: (item) => formatSignedElo(item.eloChange),
  },
];

export function ProfileRecentSessionsCard({
  sessions,
}: {
  sessions: RecentSessionItem[];
}) {
  return (
    <SectionCard
      title="Sessões de diagnóstico recentes"
      footer={
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--profile-accent-blue)]">
          Ver histórico completo
          <ArrowRight className="size-4" />
        </Link>
      }
    >
      <DataTable columns={COLUMNS} items={sessions} emptyMessage="Nenhuma sessão recente registrada." />
    </SectionCard>
  );
}

function getStatusClassName(status: RecentSessionItem["result"]) {
  if (status === "resolved") {
    return "font-medium text-[var(--profile-success)]";
  }

  if (status === "in_progress") {
    return "font-medium text-[var(--profile-accent-blue)]";
  }

  return "text-[var(--profile-text-secondary)]";
}
```

- [ ] **Step 2: Create recommendations card**

Create `apps/web/src/app/profile/profile-recommendations-card.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DataTable, SectionCard, type DataTableColumn } from "@kodan/ui/components/profile";
import { formatDifficultyLabel } from "./profile-formatters";
import type { RecommendedChallengeItem } from "./profile-types";

const COLUMNS: DataTableColumn<RecommendedChallengeItem>[] = [
  { key: "challenge", header: "Desafio", render: (item) => item.challenge },
  { key: "topic", header: "Tópico", render: (item) => item.topic },
  { key: "difficulty", header: "Dificuldade", render: (item) => formatDifficultyLabel(item.difficulty) },
  {
    key: "possible-elo",
    header: "ELO possível",
    className: "text-right",
    render: (item) => `+${item.possibleElo}`,
  },
];

export function ProfileRecommendationsCard({
  recommendations,
}: {
  recommendations: RecommendedChallengeItem[];
}) {
  return (
    <SectionCard
      title="Próximos desafios recomendados"
      footer={
        <Link href="/challenges" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--profile-accent-blue)]">
          Explorar todos os desafios
          <ArrowRight className="size-4" />
        </Link>
      }
    >
      <DataTable columns={COLUMNS} items={recommendations} emptyMessage="Nenhuma recomendação disponível agora." />
    </SectionCard>
  );
}
```

- [ ] **Step 3: Create achievements card**

Create `apps/web/src/app/profile/profile-achievements-card.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight, Check, Star, Zap } from "lucide-react";

import { AchievementBadge, SectionCard } from "@kodan/ui/components/profile";
import type { AchievementItem } from "./profile-types";

export function ProfileAchievementsCard({
  achievements,
}: {
  achievements: AchievementItem[];
}) {
  return (
    <SectionCard
      title="Conquistas recentes"
      footer={
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--profile-accent-blue)]">
          Ver todas as conquistas
          <ArrowRight className="size-4" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-4">
        {achievements.slice(0, 4).map((achievement) => (
          <AchievementRow key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </SectionCard>
  );
}

function AchievementRow({ achievement }: { achievement: AchievementItem }) {
  return (
    <article className="flex min-w-0 items-start gap-4">
      <AchievementBadge tone={achievement.tone}>
        {achievement.tone === "green" ? (
          <Check className="size-5" />
        ) : achievement.tone === "orange" ? (
          <Zap className="size-5" />
        ) : (
          <Star className="size-5" />
        )}
      </AchievementBadge>
      <div className="min-w-0">
        <h3 className="font-serif text-sm font-semibold text-[var(--profile-text-primary)]">
          {achievement.title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-[var(--profile-text-secondary)]">
          {achievement.description}
        </p>
        <p className="mt-0.5 text-xs text-[var(--profile-text-muted)]">
          {achievement.unlockedAtLabel}
        </p>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run checks and commit Tasks 4-7 together**

Run:

```bash
bun run --filter web check-types
bun test apps/web/src/app/profile/profile-data.test.ts
```

Expected: PASS.

Commit:

```bash
git add apps/web/src/app/profile
git commit -m "feat(profile): assemble profile study dossier"
```

---

### Task 8: Responsive And Empty-State Hardening

**Files:**
- Modify: `apps/web/src/app/profile/profile-content.tsx`
- Modify: `apps/web/src/app/profile/profile-recent-sessions-card.tsx`
- Modify: `apps/web/src/app/profile/profile-recommendations-card.tsx`
- Modify: `apps/web/src/app/profile/profile-achievements-card.tsx`
- Modify: `packages/ui/src/components/profile/data-table.tsx`

- [ ] **Step 1: Check desktop layout**

Run:

```bash
bun run dev:web
```

Open:

```txt
http://localhost:3001/profile
```

Expected at desktop width:

- Hero spans full content width.
- Stats row remains one horizontal band.
- ELO and topic cards sit side by side at `xl`.
- Sessions and recommendations sit side by side at `xl`.
- Achievements span the full width.
- No sidebar changes appear from this task.

- [ ] **Step 2: Check tablet/mobile reflow**

Use browser responsive widths:

- `1280px`: analytics cards should still fit.
- `1024px`: middle and operational rows may stack.
- `768px`: stats become two columns or one column without clipping.
- `390px`: tables scroll horizontally inside their cards, not the whole page.

If the table causes page overflow, keep `DataTable`'s `overflow-x-auto` wrapper and reduce `min-w-[560px]` to `min-w-[520px]`.

- [ ] **Step 3: Verify empty states**

Temporarily change `buildStaticProfileViewModel()` arrays to empty arrays one at a time during local verification:

```ts
recentSessions: [],
recommendations: [],
achievements: [],
```

Expected:

- Recent sessions card says `Nenhuma sessão recente registrada.`
- Recommendations card says `Nenhuma recomendação disponível agora.`
- Achievements card keeps layout stable with no broken borders.

Revert those temporary local changes before committing.

- [ ] **Step 4: Commit responsive fixes**

Run:

```bash
bun run --filter web check-types
```

Expected: PASS.

Commit:

```bash
git add apps/web/src/app/profile packages/ui/src/components/profile
git commit -m "fix(profile): harden responsive dossier layout"
```

---

### Task 9: Visual QA Against Light And Dark References

**Files:**
- Modify only files already touched by Tasks 2-8 if visual QA exposes spacing, contrast, or clipping defects.

- [ ] **Step 1: Light mode visual pass**

At `http://localhost:3001/profile`, switch to light mode.

Expected:

- Canvas uses warm off-white, not sterile white.
- Cards have subtle borders and minimal shadow.
- Blue is reserved for ELO, links, chart line, and progress bars.
- The first viewport reads in this order: user identity, rank/ELO, stats, chart/mastery.
- Achievements are quiet and do not compete with ELO or topic mastery.

- [ ] **Step 2: Dark mode visual pass**

Switch to dark mode.

Expected:

- Background is warm near-black.
- Cards separate by surface elevation and border, not glow or heavy shadows.
- Text uses washi-like off-white.
- Blue is glacial and restrained.
- Grid lines in the chart are visible but low contrast.

- [ ] **Step 3: Accessibility pass**

Keyboard through the page.

Expected:

- Period button, footer links, and any interactive controls have visible focus rings.
- Links are understandable by their text.
- Progress bars expose `role="progressbar"` and `aria-valuenow`.
- Tables keep semantic `<table>`, `<thead>`, and `<tbody>`.

- [ ] **Step 4: Final verification**

Run:

```bash
bun test apps/web/src/app/profile/profile-data.test.ts
bun run --filter @kodan/ui check-types
bun run --filter web check-types
bun run --filter web build
```

Expected: all PASS. If `bun run --filter web build` fails due an external service, database, or environment requirement unrelated to the profile implementation, capture the exact failure and keep the three local checks above as required passing gates.

- [ ] **Step 5: Final commit**

```bash
git status --short
git add apps/web/src/app/profile apps/web/src/index.css packages/ui/src/components/profile packages/ui/package.json packages/ui/src/index.ts
git commit -m "feat(profile): finish user study dossier screen"
```

---

## Self-Review Checklist

- Spec coverage:
  - User identity header: Task 5.
  - Stats row as one band: Task 5.
  - ELO evolution: Task 6.
  - Topic mastery: Task 6.
  - Recent diagnosis sessions: Task 7.
  - Recommended challenges: Task 7.
  - Achievements row: Task 7.
  - Light/dark tokens: Task 2.
  - Loading and empty states: Tasks 4 and 8.
  - Responsiveness: Task 8.
- Out-of-scope coverage:
  - Sidebar changes are intentionally excluded.
  - Global header changes are intentionally excluded.
- Decomposition check:
  - No single profile component owns the full screen logic.
  - Visual primitives live in `@kodan/ui`.
  - Data contracts and static data stay separate from JSX.
- Visual constraints:
  - No heavy shadows.
  - No glow in dark mode.
  - No identical grid of inflated cards.
  - No heatmap.
  - No fake attention-points panel.
  - No sidebar work in this branch unless a later request explicitly asks for it.
