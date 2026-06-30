# Question Bank Design

## Goal

Criar um banco-base editorial dentro do repositorio `CC` com pelo menos 50 seeds de TypeScript e 25 seeds de React. Esse material nao entra diretamente no runtime de `content/challenges/`; ele serve como fonte curada para futura promocao a challenges reais do produto.

## Constraints

- O banco deve viver dentro do repositorio.
- O formato precisa ser legivel para humanos e facil de revisar em PR.
- Cada seed precisa carregar contexto suficiente para futura promocao a `challenge.json` + `code.tsx` + `solution.md`.
- O corpus deve ser hibrido: inspirado no trabalho previo com Axis, mas complementado com padroes classicos de mercado.
- O conteudo deve priorizar `debug` e `explain-code`, com minoria de `explain-concept`.

## Content Model

Cada seed sera um arquivo Markdown independente, organizado em:

`content/question-bank/<language>/<theme>/<id>.md`

Frontmatter:

- `id`
- `title`
- `language`
- `theme`
- `challengeType`
- `difficulty`
- `recommendedElo`
- `estimatedTime`
- `tags`

Body obrigatorio:

- `## Main Prompt`
- `## Coverage Checklist`
- `## Mini Snippet`
- `## Expected Answer Summary`
- `## Expansion Notes`

## Editorial Rules

- Portugues como idioma padrao.
- Snippets curtos e cirurgicos, mas com potencial de expansao.
- Cada seed ja nasce com dificuldade, ELO e resposta esperada resumida.
- A pergunta e modelada editorialmente como `mainPrompt + coverageChecklist`, mesmo que o runtime atual do `CC` ainda persista `question` como `string`.
- O schema precisa acomodar tres tipos de raciocinio:
  - `debug`
  - `explain-code`
  - `explain-concept`

## Tooling

Adicionar um toolkit simples em `scripts/question-bank/` com tres responsabilidades:

1. Manifesto dos seeds
2. Renderer Markdown por seed
3. Validador do banco gerado

Esse toolkit deve conseguir:

- garantir contagem minima de 75 seeds
- garantir distribuicao de 50 TypeScript e 25 React
- garantir presenca das secoes obrigatorias
- gerar `README.md` do banco-base

## Initial Theme Layout

TypeScript:

- `async-and-concurrency`
- `types-and-narrowing`
- `generics-and-inference`
- `state-and-immutability`
- `architecture-and-api-design`

React:

- `effects-and-lifecycle`
- `state-and-rendering`
- `derived-state-and-memoization`
- `async-ui-and-races`
- `component-contracts-and-composition`

## Non-Goals

- Nao integrar esse banco a arena de treino neste momento.
- Nao gerar `challenge.json` reais nesta etapa.
- Nao mexer no schema Prisma atual.
