---
id: ts-types-009-readonly-tuple-indexing
title: Tuple readonly como contrato
language: typescript
theme: types-and-narrowing
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1400
estimatedTime: 9
tags:
  - typescript
  - tuple
  - readonly
---

## Main Prompt
Explique o que este tipo comunica melhor do que um array comum.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
type Range = readonly [start: number, end: number];

function renderRange(range: Range) {
  return String(range[0]) + "-" + String(range[1]);
}
```

## Expected Answer Summary
A resposta deve mostrar que tuple readonly comunica aridade fixa, semantica posicional e fronteira imutavel. Isso melhora legibilidade e manutencao.

## Expansion Notes
Pode crescer para coordenadas e intervalos.
