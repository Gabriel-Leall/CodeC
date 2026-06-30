---
id: ts-state-010-snapshot-before-async-work
title: Snapshot antes de trabalho assincrono
language: typescript
theme: state-and-immutability
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1420
estimatedTime: 9
tags:
  - typescript
  - snapshot
  - async
---

## Main Prompt
Explique o que este snapshot local tenta proteger antes do await.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
async function ship(order: { id: string; lines: string[] }) {
  const lines = [...order.lines];
  await Promise.resolve();
  return lines.length;
}
```

## Expected Answer Summary
A resposta deve mostrar que o snapshot reduz impacto de mutacoes posteriores naquele pedaco do estado, mas nao resolve toda a coerencia do objeto.

## Expansion Notes
Pode crescer para pipelines de aprovacao.
