# Kodan

Kodan e uma plataforma de treino para leitura de codigo, diagnostico e explicacao tecnica em TypeScript e React.
O repositorio ainda nasceu sobre [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), mas ja tem fluxo proprio de conteudo, banco de desafios e question bank editorial.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Prisma** - TypeScript-first ORM
- **Neon Postgres** - Serverless PostgreSQL database
- **Authentication** - Better-Auth
- **Question bank editorial** - Seeds curadas para futuras perguntas e desafios do Kodan

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses Neon Postgres with Prisma.

1. Update `apps/web/.env` with your Neon connection strings:

```bash
DATABASE_URL=...   # app/runtime connection
DIRECT_URL=...     # Prisma CLI connection
```

2. Apply the schema to Neon:

```bash
bun run db:push
```

3. If you're migrating the old local SQLite data, run:

```bash
bun run db:migrate:sqlite-to-neon
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@kodan/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Question Bank Workflow

O Kodan separa duas camadas de conteudo:

- `content/question-bank/`: seeds editoriais, pensadas para curadoria, revisao em PR e futura promocao.
- `content/challenges/`: desafios jogaveis usados pelo runtime.

Fonte de verdade do question bank:

- `scripts/question-bank/bank-data.ts`

Comandos:

```bash
bun run question-bank:generate
bun run question-bank:validate
```

Documentacao de autoria:

- `docs/question-bank/authoring-guide.md`
- `docs/question-bank/seed-template.md`

## Project Structure

```
Kodan/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── content/
│   ├── challenges/  # Desafios jogaveis do runtime
│   └── question-bank/ # Seeds editoriais geradas
├── docs/
│   └── question-bank/ # Guias de autoria e auditoria do banco de perguntas
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run db:migrate:sqlite-to-neon`: Copy data from the legacy SQLite file into Neon
- `bun run question-bank:generate`: Regenerate the editorial question bank and its docs
- `bun run question-bank:validate`: Validate question-bank counts, shape, and generated files
