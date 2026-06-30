---
id: ts-arch-006-parser-return-type-ambiguity
title: Parser com retorno ambiguo
language: typescript
theme: architecture-and-api-design
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1490
estimatedTime: 9
tags:
  - typescript
  - parser
  - return-type
---

## Main Prompt
Explique por que este parser joga ambiguidade demais para quem chama.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function parseRating(input: string): number | null | Error {
  return Number(input);
}
```

## Expected Answer Summary
A resposta deve mostrar que misturar null e Error como canais de falha cria contrato confuso. Union discriminada e mais clara.

## Expansion Notes
Pode crescer para parsing de ELO e importadores.
