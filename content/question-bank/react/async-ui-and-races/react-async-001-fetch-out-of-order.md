---
id: react-async-001-fetch-out-of-order
title: Fetch fora de ordem sobrescreve tela
language: react
theme: async-ui-and-races
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1490
estimatedTime: 9
tags:
  - react
  - async
  - race-condition
---

## Main Prompt
Explique como respostas fora de ordem podem mostrar o usuario errado na tela.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);
```

## Expected Answer Summary
A resposta deve mostrar que uma request antiga pode resolver depois da nova e ainda assim escrever no state. Token ou cancelamento evitam isso.

## Expansion Notes
Pode crescer para profile e detalhes.
