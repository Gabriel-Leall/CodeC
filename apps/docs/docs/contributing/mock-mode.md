---
sidebar_position: 2
title: Modo mock local
---

# Modo mock local

O modo mock permite desenvolver a interface do Kodan sem iniciar PostgreSQL, Prisma ou Better Auth. Ele existe para que contribuidores de frontend, design e conteúdo possam abrir as páginas e testar a jornada do produto logo após instalar as dependências.

## Como ativar

Abra `apps/web/src/lib/mock-mode.ts` e altere temporariamente a constante:

```ts
const MOCK_MODE_ENABLED = true;
```

Depois inicie apenas a aplicação web:

```bash
bun run dev:web
```

Abra [http://localhost:3001](http://localhost:3001). Não é necessário rodar `bun run db:push` nesse modo.

## O que funciona sem banco

- catálogo em `/challenges`, com desafios locais;
- arena em `/train/[id]`;
- envio de tentativa, feedback local e atualização de ELO;
- perfil, histórico de tentativas e edição de perfil;
- Route Handlers de jogador e desafios sob `/api/me` e `/api/challenges`.

Os dados vivem somente na memória do processo do Next.js. Ao reiniciar `bun run dev:web`, usuário, tentativas e alterações de ELO voltam ao estado inicial. Isso é esperado e não é um recurso de persistência.

## O que não funciona

O modo mock não representa a integração real. Ele não executa:

- login, registro, sessão ou os endpoints `/api/auth/*` do Better Auth;
- comandos Prisma, migrações ou consultas PostgreSQL;
- persistência de perfil, tentativas ou ELO;
- feedback por OpenRouter, mesmo que a chave esteja configurada.

Ao acessar `/api/auth/*` nesse modo, a aplicação responde `404` informando que a autenticação está indisponível. Isso evita uma conexão acidental ao banco durante o desenvolvimento de interface.

## Quando usar o modo integrado

O modo integrado é o padrão. Use ou volte a esse modo ao alterar autenticação, schema Prisma, Route Handlers com dados reais ou qualquer regra que dependa de persistência:

```ts
const MOCK_MODE_ENABLED = false;
```

Então configure o ambiente integrado:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
BETTER_AUTH_SECRET="um-segredo-com-pelo-menos-32-caracteres"
BETTER_AUTH_URL="http://localhost:3001"
CORS_ORIGIN="http://localhost:3001"
```

Em seguida, aplique o schema quando necessário:

```bash
bun run db:push
```

O modo mock é uma ferramenta de desenvolvimento. Antes de abrir um PR que altere comportamento persistido, valide também o fluxo integrado.
