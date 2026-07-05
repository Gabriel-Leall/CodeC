---
id: ts-async-002-promise-all-partial-failure
title: Falha parcial em Promise.all
language: typescript
theme: async-and-concurrency
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1420
estimatedTime: 9
tags:
  - typescript
  - promise-all
  - error-handling
---

## Main Prompt
Explique o que essa funcao realmente garante quando uma das promessas falha.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
async function syncWidgets(ids: string[]) {
  return Promise.all(ids.map(id => syncWidget(id)));
}
```

## Expected Answer Summary
A resposta deve separar falha do chamador de cancelamento real das tarefas irmas. Promise.all rejeita cedo, mas nao desfaz side effects ja iniciados.

## Expansion Notes
Pode virar caso maior com compensacao e rollback.
