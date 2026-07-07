# Kodan Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renomear o monorepo de `CC` para `Kodan` em toda a superficie ativa do produto, incluindo branding visivel, nomes de workspace package, aliases TypeScript, imports, manifests e lockfile, sem quebrar o build.

**Architecture:** O rebrand deve separar marca de produto e identidade tecnica. A marca visivel vira `Kodan`, enquanto o namespace interno dos packages vira `@kodan/*` e o `name` raiz do workspace vira `kodan`, tudo em lowercase para evitar atrito com regras de nomes de pacote e tooling. O rollout deve acontecer em quatro fases: manifests/config, imports/codigo, branding/docs e regeneracao/verificacao.

**Tech Stack:** Bun workspaces, Next.js 16, TypeScript, React 19, Prisma, Better Auth, ripgrep

---

## Naming Contract

Antes de editar qualquer arquivo, fixe este contrato:

- **Marca visivel do produto:** `Kodan`
- **Workspace package scope:** `@kodan/*`
- **Nome raiz do workspace em `package.json`:** `kodan`
- **Pasta local do repositório (`.../CC`)**: nao e alterada por este plano; isso fica como passo manual fora do repo

## File Map

- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `bun.lock`
- Modify: `README.md`
- Modify: `bts.jsonc`
- Modify: `docs/superpowers/specs/2026-06-23-question-bank-design.md`
- Modify: `scripts/question-bank/question-bank.ts`
- Modify: `apps/web/package.json`
- Modify: `apps/web/tsconfig.json`
- Modify: `apps/web/components.json`
- Modify: `apps/web/next.config.ts`
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/api/auth/[...all]/route.ts`
- Modify: `apps/web/src/app/dashboard/actions.ts`
- Modify: `apps/web/src/app/dashboard/dashboard.tsx`
- Modify: `apps/web/src/app/dashboard/challenges/page.tsx`
- Modify: `apps/web/src/app/dashboard/challenges/ema-challenge-card.tsx`
- Modify: `apps/web/src/app/dashboard/train/[id]/train-arena-client.tsx`
- Modify: `apps/web/src/app/zen/ZenPlaygroundClient.tsx`
- Modify: `apps/web/src/components/mode-toggle.tsx`
- Modify: `apps/web/src/lib/local-user.ts`
- Modify: `packages/config/package.json`
- Modify: `packages/env/package.json`
- Modify: `packages/env/tsconfig.json`
- Modify: `packages/db/package.json`
- Modify: `packages/db/tsconfig.json`
- Modify: `packages/db/src/index.ts`
- Modify: `packages/db/src/migrate-sqlite-to-neon.ts`
- Modify: `packages/auth/package.json`
- Modify: `packages/auth/tsconfig.json`
- Modify: `packages/auth/src/index.ts`
- Modify: `packages/ui/package.json`
- Modify: `packages/ui/tsconfig.json`
- Modify: `packages/ui/components.json`
- Modify: `packages/ui/src/components/alert.tsx`
- Modify: `packages/ui/src/components/button.tsx`
- Modify: `packages/ui/src/components/card.tsx`
- Modify: `packages/ui/src/components/checkbox.tsx`
- Modify: `packages/ui/src/components/dropdown-menu.tsx`
- Modify: `packages/ui/src/components/input.tsx`
- Modify: `packages/ui/src/components/label.tsx`
- Modify: `packages/ui/src/components/skeleton.tsx`
- Modify: `packages/ui/src/components/zen/display/index.ts`
- Modify: `packages/ui/src/components/zen/display/ZenAvatar.tsx`
- Modify: `packages/ui/src/components/zen/display/ZenProfileCard.tsx`
- Modify: `packages/ui/src/components/zen/feedback/index.tsx`
- Modify: `packages/ui/src/components/zen/feedback/ZenAlert.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenCheckbox.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenInput.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenSelect.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenTextarea.tsx`
- Modify: `packages/ui/src/components/zen/layout/ZenCard.tsx`
- Modify: `packages/ui/src/components/zen/layout/ZenDivider.tsx`
- Modify: `packages/ui/src/components/zen/layout/ZenPaper.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenBreadcrumb.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenCommandMenu.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenSidebar.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenTabs.tsx`
- Modify: `packages/ui/src/components/zen/progression/DanProgress.tsx`
- Modify: `packages/ui/src/components/zen/progression/ZenAchievementSeal.tsx`
- Modify: `packages/ui/src/components/zen/progression/ZenRankBadge.tsx`
- Modify: `packages/ui/src/components/zen/zen-button.tsx`
- Modify: `packages/ui/src/components/zen/zen-seal.tsx`

## Task 1: Renomear manifests e aliases do workspace

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `apps/web/package.json`
- Modify: `apps/web/tsconfig.json`
- Modify: `apps/web/components.json`
- Modify: `packages/config/package.json`
- Modify: `packages/env/package.json`
- Modify: `packages/env/tsconfig.json`
- Modify: `packages/db/package.json`
- Modify: `packages/db/tsconfig.json`
- Modify: `packages/auth/package.json`
- Modify: `packages/auth/tsconfig.json`
- Modify: `packages/ui/package.json`
- Modify: `packages/ui/tsconfig.json`
- Modify: `packages/ui/components.json`

- [ ] **Step 1: Capturar o baseline de referencias atuais**

Run:

```powershell
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!.next/**' '@CC/|\bCC\b' apps packages docs scripts README.md package.json tsconfig.json bts.jsonc
```

Expected: matches em `package.json`, `tsconfig`, `components.json`, imports em `apps/` e `packages/`, README e docs.

- [ ] **Step 2: Renomear o manifesto raiz e os filtros Bun**

Atualize `package.json` para usar nome raiz lowercase e filtros no novo scope:

```json
{
  "name": "kodan",
  "scripts": {
    "db:push": "bun run --filter @kodan/db db:push",
    "db:studio": "bun run --filter @kodan/db db:studio",
    "db:generate": "bun run --filter @kodan/db db:generate",
    "db:generate:challenges": "bun run --filter @kodan/db db:generate:challenges",
    "db:sync:challenges:index": "bun run --filter @kodan/db db:sync:challenges:index",
    "db:migrate": "bun run --filter @kodan/db db:migrate",
    "db:migrate:sqlite-to-neon": "bun run --filter @kodan/db db:migrate:sqlite-to-neon",
    "db:seed:challenges": "bun run --filter @kodan/db db:seed:challenges"
  },
  "dependencies": {
    "@kodan/env": "workspace:*"
  },
  "devDependencies": {
    "@kodan/config": "workspace:*"
  }
}
```

- [ ] **Step 3: Renomear nomes dos packages e dependencias internas**

Atualize os `package.json` dos workspaces para o novo scope:

```json
// packages/config/package.json
{
  "name": "@kodan/config",
  "version": "0.0.0",
  "private": true
}
```

```json
// packages/env/package.json
{
  "name": "@kodan/env",
  "devDependencies": {
    "@kodan/config": "workspace:*"
  }
}
```

```json
// packages/db/package.json
{
  "name": "@kodan/db",
  "dependencies": {
    "@kodan/env": "workspace:*"
  },
  "devDependencies": {
    "@kodan/config": "workspace:*"
  }
}
```

```json
// packages/auth/package.json
{
  "name": "@kodan/auth",
  "dependencies": {
    "@kodan/db": "workspace:*",
    "@kodan/env": "workspace:*"
  },
  "devDependencies": {
    "@kodan/config": "workspace:*"
  }
}
```

```json
// packages/ui/package.json
{
  "name": "@kodan/ui",
  "devDependencies": {
    "@kodan/config": "workspace:*"
  }
}
```

```json
// apps/web/package.json
{
  "dependencies": {
    "@kodan/auth": "workspace:*",
    "@kodan/db": "workspace:*",
    "@kodan/env": "workspace:*",
    "@kodan/ui": "workspace:*"
  },
  "devDependencies": {
    "@kodan/config": "workspace:*"
  }
}
```

- [ ] **Step 4: Renomear `extends`, `paths` e aliases de shadcn**

Atualize os `tsconfig` e `components.json`:

```json
// tsconfig.json
{
  "extends": "@kodan/config/tsconfig.base.json"
}
```

```json
// packages/ui/tsconfig.json
{
  "extends": "@kodan/config/tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@kodan/ui/*": ["./src/*"]
    }
  }
}
```

```json
// apps/web/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@kodan/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

```json
// apps/web/components.json
{
  "aliases": {
    "utils": "@kodan/ui/lib/utils",
    "ui": "@kodan/ui/components"
  }
}
```

```json
// packages/ui/components.json
{
  "aliases": {
    "components": "@kodan/ui/components",
    "utils": "@kodan/ui/lib/utils",
    "hooks": "@kodan/ui/hooks",
    "lib": "@kodan/ui/lib",
    "ui": "@kodan/ui/components"
  }
}
```

- [ ] **Step 5: Rodar checagem de tipos e confirmar vermelho esperado**

Run:

```powershell
bun run check-types
```

Expected: FAIL com imports ainda apontando para `@CC/*` no código-fonte.

- [ ] **Step 6: Nao commitar ainda**

Expected: o workspace continua vermelho ate os imports de `@CC/*` serem migrados na Task 2. Os manifests e aliases devem ser commitados junto com os imports para manter a branch em estado valido.

## Task 2: Reescrever imports e entrypoints para `@kodan/*`

**Files:**
- Modify: `apps/web/next.config.ts`
- Modify: `apps/web/src/index.css`
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/app/api/auth/[...all]/route.ts`
- Modify: `apps/web/src/app/dashboard/actions.ts`
- Modify: `apps/web/src/app/dashboard/dashboard.tsx`
- Modify: `apps/web/src/app/dashboard/challenges/page.tsx`
- Modify: `apps/web/src/app/dashboard/challenges/ema-challenge-card.tsx`
- Modify: `apps/web/src/app/dashboard/train/[id]/train-arena-client.tsx`
- Modify: `apps/web/src/app/zen/ZenPlaygroundClient.tsx`
- Modify: `apps/web/src/components/mode-toggle.tsx`
- Modify: `apps/web/src/lib/local-user.ts`
- Modify: `packages/auth/src/index.ts`
- Modify: `packages/db/src/index.ts`
- Modify: `packages/db/src/migrate-sqlite-to-neon.ts`
- Modify: `packages/ui/src/components/alert.tsx`
- Modify: `packages/ui/src/components/button.tsx`
- Modify: `packages/ui/src/components/card.tsx`
- Modify: `packages/ui/src/components/checkbox.tsx`
- Modify: `packages/ui/src/components/dropdown-menu.tsx`
- Modify: `packages/ui/src/components/input.tsx`
- Modify: `packages/ui/src/components/label.tsx`
- Modify: `packages/ui/src/components/skeleton.tsx`
- Modify: `packages/ui/src/components/zen/display/index.ts`
- Modify: `packages/ui/src/components/zen/display/ZenAvatar.tsx`
- Modify: `packages/ui/src/components/zen/display/ZenProfileCard.tsx`
- Modify: `packages/ui/src/components/zen/feedback/index.tsx`
- Modify: `packages/ui/src/components/zen/feedback/ZenAlert.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenCheckbox.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenInput.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenSelect.tsx`
- Modify: `packages/ui/src/components/zen/forms/ZenTextarea.tsx`
- Modify: `packages/ui/src/components/zen/layout/ZenCard.tsx`
- Modify: `packages/ui/src/components/zen/layout/ZenDivider.tsx`
- Modify: `packages/ui/src/components/zen/layout/ZenPaper.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenBreadcrumb.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenCommandMenu.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenSidebar.tsx`
- Modify: `packages/ui/src/components/zen/navigation/ZenTabs.tsx`
- Modify: `packages/ui/src/components/zen/progression/DanProgress.tsx`
- Modify: `packages/ui/src/components/zen/progression/ZenAchievementSeal.tsx`
- Modify: `packages/ui/src/components/zen/progression/ZenRankBadge.tsx`
- Modify: `packages/ui/src/components/zen/zen-button.tsx`
- Modify: `packages/ui/src/components/zen/zen-seal.tsx`

- [ ] **Step 1: Substituir imports e imports CSS no app web**

Exemplos concretos:

```ts
// apps/web/next.config.ts
import "@kodan/env/web";
```

```ts
// apps/web/src/app/dashboard/actions.ts
import { auth } from "@kodan/auth";
import prisma from "@kodan/db";
import { env } from "@kodan/env/server";
```

```css
/* apps/web/src/index.css */
@import "@kodan/ui/globals.css";
```

- [ ] **Step 2: Substituir imports nos packages compartilhados**

Exemplos concretos:

```ts
// packages/auth/src/index.ts
import { createPrismaClient } from "@kodan/db";
import { env } from "@kodan/env/server";
```

```ts
// packages/db/src/index.ts
import { env } from "@kodan/env/server";
```

```ts
// packages/ui/src/components/button.tsx
import { cn } from "@kodan/ui/lib/utils";
```

```ts
// packages/ui/src/components/zen/feedback/index.tsx
import { EnsoCircle } from "@kodan/ui/assets/zen/vector/EnsoCircle";
import { HankoMarkSvg, SumiDividerSvg } from "@kodan/ui/assets/zen/sumi-strokes";
import { cn } from "@kodan/ui/lib/utils";
```

- [ ] **Step 3: Rodar busca focada e confirmar que `@CC/` sumiu do código ativo**

Run:

```powershell
rg -n "@CC/" apps packages README.md tsconfig.json package.json
```

Expected: sem resultados.

- [ ] **Step 4: Rodar checagem de tipos e confirmar verde**

Run:

```powershell
bun run check-types
```

Expected: PASS.

- [ ] **Step 5: Commit conjunto de manifests + imports**

```bash
git add package.json tsconfig.json apps/web/package.json apps/web/tsconfig.json apps/web/components.json apps/web packages/config/package.json packages/env/package.json packages/env/tsconfig.json packages/db/package.json packages/db/tsconfig.json packages/db/src packages/auth/package.json packages/auth/tsconfig.json packages/auth/src packages/ui/package.json packages/ui/tsconfig.json packages/ui/components.json packages/ui/src
git commit -m "refactor(rebrand): migrate workspace scope and imports to @kodan"
```

## Task 3: Rebrand de marca visivel e documentacao ativa

**Files:**
- Modify: `README.md`
- Modify: `bts.jsonc`
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `docs/superpowers/specs/2026-06-23-question-bank-design.md`
- Modify: `scripts/question-bank/question-bank.ts`

- [ ] **Step 1: Atualizar o branding publico principal**

Atualize `README.md` e metadata do app:

Atualize o topo do `README.md`:

```md
# Kodan
```

Atualize o exemplo de import no `README.md`:

```tsx
import { Button } from "@kodan/ui/components/button";
```

Atualize a arvore do projeto no `README.md`:

```text
Kodan/
├── apps/
├── packages/
```

```ts
// apps/web/src/app/layout.tsx
export const metadata: Metadata = {
  title: "Kodan - Code Comprehension Trainer",
  description:
    "Treine sua mente para ler, interpretar e diagnosticar problemas complexos em código React.",
};
```

- [ ] **Step 2: Atualizar bootstrap e docs editoriais**

Atualize `bts.jsonc`, a spec do banco de perguntas e o texto editorial do script:

```jsonc
// bts.jsonc
{
  "reproducibleCommand": "bun create better-t-stack@latest kodan --frontend next --backend self --runtime none --database sqlite --orm prisma --api none --auth better-auth --payments none --addons mcp skills --examples none --db-setup none --web-deploy none --server-deploy none --git --package-manager bun --install"
}
```

Atualize a spec para trocar as menções textuais a `CC` por `Kodan`, por exemplo:

```md
Criar um banco-base editorial dentro do repositorio `Kodan` ...
```

```ts
// scripts/question-bank/question-bank.ts
"Banco-base editorial para futura promocao de seeds a desafios reais do Kodan."
```

- [ ] **Step 3: Rodar busca focada do branding antigo**

Run:

```powershell
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!.next/**' '\bCC\b|# CC|CC - Code Comprehension Trainer' README.md apps docs scripts bts.jsonc package.json
```

Expected: zero resultados nos arquivos ativos alterados por esta tarefa.

- [ ] **Step 4: Commit do rebrand visivel**

```bash
git add README.md bts.jsonc apps/web/src/app/layout.tsx docs/superpowers/specs/2026-06-23-question-bank-design.md scripts/question-bank/question-bank.ts
git commit -m "chore(rebrand): rename visible product branding to Kodan"
```

## Task 4: Regenerar lockfile e verificar integridade do monorepo

**Files:**
- Modify: `bun.lock`

- [ ] **Step 1: Regenerar o lockfile com o novo scope**

Run:

```powershell
bun install
```

Expected: `bun.lock` atualizado com `@kodan/*` e sem novos erros de workspace resolution.

- [ ] **Step 2: Validar build e scripts centrais**

Run:

```powershell
bun run check-types
bun run build
bun run question-bank:validate
```

Expected:

- `check-types`: PASS
- `build`: PASS
- `question-bank:validate`: PASS

- [ ] **Step 3: Fazer auditoria final de leftovers**

Run:

```powershell
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' --glob '!.next/**' '@CC/|\bCC\b' .
```

Expected: nenhum leftover em código, manifests e docs ativos. Se restar algo, deve ser revisado manualmente e removido ou explicitamente aceito como histórico.

- [ ] **Step 4: Inspecionar diff final**

Run:

```powershell
git diff --check
git diff --stat
```

Expected:

- sem whitespace errors
- diff concentrado em manifests, imports, docs e `bun.lock`

- [ ] **Step 5: Commit da regeneracao e validacao**

```bash
git add bun.lock
git commit -m "chore(rebrand): regenerate lockfile for @kodan scope"
```

## Out-of-Repo Follow-Up

Esses itens nao sao executados dentro do repo, mas fazem parte do rebrand completo:

1. Renomear a pasta local `C:\Users\Gabriel\Documents\VsCode\GitHub\Projetos\CC` para `...\Kodan`
2. Se o repositório remoto tambem mudar de nome, atualizar `origin`:

```bash
git remote set-url origin <nova-url-do-repo-kodan>
```

3. Atualizar bookmarks, scripts externos, shortcuts do editor e qualquer automacao local que ainda aponte para `...\CC`

## Self-Review

- **Cobertura da spec/pedido:** o plano cobre branding visivel, scope tecnico, package manifests, imports, aliases, docs, `bun.lock` e verificacoes. Tambem separa o rename dentro do repo do rename da pasta/remote fora dele.
- **Sem placeholders:** todos os passos tem comandos concretos, arquivos nomeados e snippets exemplificando o cambio esperado.
- **Consistencia de tipos/nomes:** a marca visivel e sempre `Kodan`; o scope tecnico e sempre `@kodan/*`; o nome raiz do workspace e sempre `kodan`.

Plan complete and saved to `docs/superpowers/plans/2026-07-04-kodan-rebrand-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
