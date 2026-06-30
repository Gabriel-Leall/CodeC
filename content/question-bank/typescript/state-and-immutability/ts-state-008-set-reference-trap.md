---
id: ts-state-008-set-reference-trap
title: Armadilha de referencia com Set
language: typescript
theme: state-and-immutability
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1390
estimatedTime: 9
tags:
  - typescript
  - set
  - reference
---

## Main Prompt
Explique o que este uso de Set esta assumindo sobre igualdade e por que isso diverge do dominio.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
const selected = new Set<{ id: string }>();
selected.add({ id: "a" });
selected.has({ id: "a" });
```

## Expected Answer Summary
A resposta deve mostrar que Set com objetos trabalha por identidade de referencia, nao por igualdade de negocio.

## Expansion Notes
Pode crescer para tags e selecao de itens.
