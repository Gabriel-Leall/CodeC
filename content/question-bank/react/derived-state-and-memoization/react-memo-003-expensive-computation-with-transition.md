---
id: react-memo-003-expensive-computation-with-transition
title: Calculo caro e transicao
language: react
theme: derived-state-and-memoization
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1430
estimatedTime: 9
tags:
  - react
  - useTransition
  - memoization
---

## Main Prompt
Explique como transicao e memoizacao atacam camadas diferentes do problema.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```tsx
const [isPending, startTransition] = useTransition();
const rows = useMemo(() => heavyTransform(data), [data]);
```

## Expected Answer Summary
A resposta deve separar custo computacional puro de prioridade perceptiva de atualizacao. useTransition nao substitui memoizacao.

## Expansion Notes
Pode crescer para analytics e scoreboard.
