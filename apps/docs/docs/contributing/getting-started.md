---
sidebar_position: 1
title: Primeiros passos
---

# Primeiros passos

Este guia prepara uma contribuição local para o Kodan. O repositório usa **Bun**, um monorepo com workspaces e PostgreSQL via Prisma.

## Pré-requisitos

- Bun 1.3 ou superior;
- Node.js compatível com o Bun usado no projeto;
- uma instância PostgreSQL (Neon ou local) para os fluxos que acessam dados.

## Instalação

Na raiz do repositório:

```bash
bun install
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp apps/web/.env.example apps/web/.env
```

No PowerShell, use:

```powershell
Copy-Item apps/web/.env.example apps/web/.env
```

Preencha as variáveis de banco e autenticação. Os valores nunca devem ser enviados em commits.

## Banco de dados

Depois de configurar `DATABASE_URL` e `DIRECT_URL`, aplique o schema:

```bash
bun run db:push
```

## Servidores de desenvolvimento

Para trabalhar apenas na aplicação web:

```bash
bun run dev:web
```

Ela abre em [http://localhost:3001](http://localhost:3001).

Para trabalhar apenas na documentação:

```bash
bun run docs:dev
```

Ela abre em [http://localhost:3002](http://localhost:3002). Esse comando também atualiza a especificação OpenAPI usada pela referência de API.

`bun run dev` inicia todos os workspaces. Prefira os comandos isolados quando for alterar uma única área ou quando as portas já estiverem em uso.

## Variáveis de ambiente

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Conexão usada pela aplicação. |
| `DIRECT_URL` | Para comandos Prisma | Conexão direta para CLI/migrações. |
| `BETTER_AUTH_SECRET` | Sim | Segredo de autenticação, com ao menos 32 caracteres. |
| `BETTER_AUTH_URL` | Sim | URL pública/local da aplicação, por exemplo `http://localhost:3001`. |
| `CORS_ORIGIN` | Sim | Origem autorizada, normalmente a mesma URL local da aplicação. |
| `OPENROUTER_API_KEY` | Não | Habilita feedback por IA; sem ela o projeto usa feedback local de fallback. |
| `OPENROUTER_MODEL` | Não | Modelo do OpenRouter; o padrão atual é `openai/gpt-4o-mini`. |
| `LEGACY_SQLITE_URL` | Não | Caminho do banco SQLite legado, somente para migração. |

## Próximo passo

Leia o [mapa de arquitetura](./architecture) antes de mover código entre `apps`, `packages` ou `content`.
