---
id: ts-async-003-abort-controller-leak
title: AbortController compartilhado
language: typescript
theme: async-and-concurrency
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1500
estimatedTime: 9
tags:
  - typescript
  - abort-controller
  - fetch
---

## Main Prompt
Explique por que este helper pode cancelar requisicoes novas por engano.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
const controller = new AbortController();

export async function loadReport(url: string) {
  return fetch(url, { signal: controller.signal });
}

export function cancelReport() {
  controller.abort();
}
```

## Expected Answer Summary
A resposta deve apontar que o controller global atravessa chamadas e pode permanecer abortado. Cada execucao ou cada instancia precisa do proprio signal.

## Expansion Notes
Pode crescer para client de API com timeout e retry.
