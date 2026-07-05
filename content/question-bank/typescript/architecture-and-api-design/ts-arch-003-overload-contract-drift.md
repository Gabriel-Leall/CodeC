---
id: ts-arch-003-overload-contract-drift
title: Overload incoerente com implementacao
language: typescript
theme: architecture-and-api-design
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1480
estimatedTime: 9
tags:
  - typescript
  - overload
  - contract
---

## Main Prompt
Explique por que estes overloads prometem algo que o corpo nao entrega.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function parse(value: string): number;
function parse(value: number): string;
function parse(value: string | number) {
  return value;
}
```

## Expected Answer Summary
A resposta deve mostrar que overload serve como contrato publico e precisa refletir comportamento real. Aqui o corpo contradiz o anuncio.

## Expansion Notes
Pode crescer para adapters e parsers.
