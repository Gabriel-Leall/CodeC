---
id: ts-async-009-fire-and-forget-audit
title: Fire-and-forget em auditoria
language: typescript
theme: async-and-concurrency
challengeType: explain-code
difficulty: EASY
recommendedElo: 1260
estimatedTime: 7
tags:
  - typescript
  - fire-and-forget
  - observability
---

## Main Prompt
Explique o que esta funcao esta assumindo ao ignorar a promise de auditoria.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
export function saveAndAudit(record: string) {
  void auditAsync(record);
  return persist(record);
}
```

## Expected Answer Summary
A resposta deve explicar que o efeito colateral pode falhar silenciosamente ou morrer no shutdown. void comunica intencao, mas nao cria confiabilidade.

## Expansion Notes
Pode crescer para fila de auditoria.
