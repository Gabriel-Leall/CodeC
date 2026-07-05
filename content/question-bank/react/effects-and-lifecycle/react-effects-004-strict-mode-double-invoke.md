---
id: react-effects-004-strict-mode-double-invoke
title: Strict Mode e dupla invocacao
language: react
theme: effects-and-lifecycle
challengeType: explain-concept
difficulty: MEDIUM
recommendedElo: 1440
estimatedTime: 9
tags:
  - react
  - strict-mode
  - effects
---

## Main Prompt
Explique por que este effect pode rodar duas vezes em desenvolvimento.

## Coverage Checklist
1. Definir o conceito usando o snippet como base
2. Explicar por que esse conceito importa na pratica
3. Conectar o conceito a uma decisao de modelagem ou manutencao

## Mini Snippet
```tsx
useEffect(() => {
  analytics.track("page-open");
}, []);
```

## Expected Answer Summary
A resposta deve mostrar o papel pedagogico do Strict Mode para revelar side effects nao idempotentes e cleanups incompletos.

## Expansion Notes
Pode crescer para tracking e init de SDK.
