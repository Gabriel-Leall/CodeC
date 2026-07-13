---
sidebar_position: 2
title: Mapa de arquitetura
---

# Mapa de arquitetura

O Kodan é um monorepo Bun. A aplicação Next.js fica em `apps/web`; bibliotecas reutilizáveis ficam em `packages`; e o conteúdo editorial fica fora do runtime da aplicação.

```text
apps/web              interface Next.js e Route Handlers HTTP
apps/docs             site Docusaurus e referência OpenAPI
packages/ui           primitives e estilos compartilhados
packages/auth         configuração do Better Auth
packages/db           Prisma, schema e acesso a dados
packages/env          validação tipada das variáveis de ambiente
content/challenges    desafios jogáveis consumidos pelo runtime
content/question-bank seeds editoriais para curadoria e promoção futura
scripts               geração, validação e OpenAPI
```

## Regra de localização

- Mude **`apps/web`** quando a regra ou interface for específica do produto web.
- Mude **`packages/ui`** quando um componente visual for reutilizável entre aplicações.
- Mude **`packages/db`** quando o contrato persistido, Prisma ou consultas precisarem mudar.
- Mude **`packages/auth`** quando a configuração de sessão/autorização for alterada.
- Mude **`content/challenges`** para alterar um desafio que já pode ser treinado.
- Mude **`content/question-bank`** e os scripts relacionados para trabalho editorial ainda não promovido ao runtime.

## Fluxo principal de produto

```text
Catálogo (/challenges)
  -> Arena (/train/[id])
  -> Route Handler / serviço da aplicação
  -> Prisma e PostgreSQL
  -> feedback e atualização de ELO
  -> Perfil (/profile)
```

As páginas de interface e suas rotas canônicas estão detalhadas em [Aplicação e rotas](../application).

## Compatibilidade de rotas

`/dashboard/challenges` e `/dashboard/train/[id]` ainda existem por compatibilidade. Novas navegações devem usar `/challenges` e `/train/[id]`. `/dashboard` redireciona para `/profile`.

## Interfaces HTTP

Os Route Handlers vivem sob `/api/*`. A especificação OpenAPI é gerada a partir de contratos Zod; depois de alterar contratos ou handlers, rode:

```bash
bun run openapi:generate
bun run docs:build
```

Consulte a [referência de API](/api-reference) para os contratos públicos.
