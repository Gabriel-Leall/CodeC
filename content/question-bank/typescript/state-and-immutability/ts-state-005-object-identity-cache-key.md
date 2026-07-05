---
id: ts-state-005-object-identity-cache-key
title: Cache baseado em identidade de objeto
language: typescript
theme: state-and-immutability
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1520
estimatedTime: 9
tags:
  - typescript
  - cache
  - identity
---

## Main Prompt
Explique por que essa estrategia de cache falha para objetos equivalentes de dominio.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```ts
const cache = new Map<object, string>();

function memoizeUser(query: { id: string }) {
  return cache.get(query) ?? "miss";
}
```

## Expected Answer Summary
A resposta deve mostrar que igualdade por referencia nao coincide com igualdade de dominio. Chave estrutural ou normalizada evita misses artificiais.

## Expansion Notes
Pode crescer para query keys e memoizacao.
