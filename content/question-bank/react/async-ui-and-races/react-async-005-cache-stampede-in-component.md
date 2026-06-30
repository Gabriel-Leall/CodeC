---
id: react-async-005-cache-stampede-in-component
title: Cache stampede na UI
language: react
theme: async-ui-and-races
challengeType: explain-concept
difficulty: HARD
recommendedElo: 1600
estimatedTime: 12
tags:
  - react
  - cache
  - stampede
---

## Main Prompt
Explique o conceito de cache stampede em componentes montando ao mesmo tempo.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```tsx
useEffect(() => {
  fetchStats(teamId).then(setStats);
}, [teamId]);
```

## Expected Answer Summary
A resposta deve ligar montagens simultaneas com requests identicas, desperdicio de rede e reconciliacao visual pior. Deduplicacao ou cache compartilhado ajudam.

## Expansion Notes
Pode crescer para widgets do dashboard.
