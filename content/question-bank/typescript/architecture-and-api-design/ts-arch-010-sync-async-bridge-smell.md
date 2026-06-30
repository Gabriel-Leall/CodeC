---
id: ts-arch-010-sync-async-bridge-smell
title: Ponte sincrona-asincrona suspeita
language: typescript
theme: architecture-and-api-design
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1540
estimatedTime: 9
tags:
  - typescript
  - sync-async
  - architecture
---

## Main Prompt
Explique por que esta API parece sincrona, mas empurra comportamento e falha para outro modelo de execucao.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
function runLater(task: () => void) {
  Promise.resolve().then(task);
}
```

## Expected Answer Summary
A resposta deve mostrar que a API engana o chamador sobre ordem e tratamento de erro. Tornar a borda explicitamente async costuma ser mais honesto.

## Expansion Notes
Pode crescer para filas de UI e instrumentation.
