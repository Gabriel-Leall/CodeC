---
id: react-async-003-loading-flag-shared-between-requests
title: Loading compartilhado entre requests
language: react
theme: async-ui-and-races
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1510
estimatedTime: 9
tags:
  - react
  - loading-state
  - async
---

## Main Prompt
Explique por que uma flag booleana unica pode mentir quando ha requisicoes concorrentes.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
const [loading, setLoading] = useState(false);

async function refresh(id: string) {
  setLoading(true);
  await fetchUser(id);
  setLoading(false);
}
```

## Expected Answer Summary
A resposta deve mostrar que a primeira request que termina pode desligar a flag enquanto outra ainda esta em voo. Contador ou chave por request resolvem melhor.

## Expansion Notes
Pode crescer para painel multi-fonte.
