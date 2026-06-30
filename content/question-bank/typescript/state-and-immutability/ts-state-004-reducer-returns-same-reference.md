---
id: ts-state-004-reducer-returns-same-reference
title: Reducer devolve a mesma referencia
language: typescript
theme: state-and-immutability
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1380
estimatedTime: 9
tags:
  - typescript
  - reducer
  - reference
---

## Main Prompt
Explique por que este reducer e semanticamente suspeito mesmo quando o valor final parece correto.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```ts
function reducer(state: { count: number }, delta: number) {
  state.count += delta;
  return state;
}
```

## Expected Answer Summary
A resposta deve mostrar que conteudo correto nao basta; identidade e parte do contrato de atualizacao em varios sistemas reativos.

## Expansion Notes
Pode crescer para reducers de UI e cache.
