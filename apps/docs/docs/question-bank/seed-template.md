import CodeBlock from "@theme/CodeBlock";

# Template de Seed

Template copiavel para IA ou curadoria humana criar novas seeds no formato oficial do Kodan.

## Como preencher

- Troque os placeholders entre `<...>`.
- `id` deve ser estavel, em kebab-case e unico no corpus.
- `title` fica em portugues e descreve o foco editorial do caso.
- `challengeType` decide o checklist minimo da resposta.
- `miniSnippet` deve ser curto o suficiente para caber em uma leitura rapida.

## Template Markdown

Use este bloco como arquivo `.md` dentro de `content/question-bank/<language>/<theme>/`.

<CodeBlock language="md" title="content/question-bank/typescript/<theme>/<id>.md">
{`---
id: <language-short>-<theme-short>-<nnn>-<slug>
title: <titulo em portugues>
language: typescript
theme: <theme-existente-ou-novo>
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1450
estimatedTime: 9
tags:
  - typescript
  - <tag-1>
  - <tag-2>
---

## Main Prompt
Explique <o problema, comportamento ou conceito> usando o snippet abaixo.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
\`\`\`ts
function example(value?: { id: string }) {
  if (!value) return;
  return value.id.toUpperCase();
}
\`\`\`

## Expected Answer Summary
A resposta deve explicar <o raciocinio esperado>, incluindo risco, limite ou trade-off relevante.

## Expansion Notes
Pode crescer para <um desafio maior, uma tela real ou um fluxo de dominio>.
`}
</CodeBlock>

## Variacoes por tipo

- `debug`: foco em causa raiz, impacto e correcao minima segura.
- `explain-code`: foco em intencao do codigo, contrato e limites.
- `explain-concept`: foco em conceito, importancia pratica e decisao de modelagem.
