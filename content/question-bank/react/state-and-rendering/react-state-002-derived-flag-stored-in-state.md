---
id: react-state-002-derived-flag-stored-in-state
title: Flag derivada armazenada
language: react
theme: state-and-rendering
challengeType: explain-code
difficulty: EASY
recommendedElo: 1280
estimatedTime: 7
tags:
  - react
  - derived-state
  - state
---

## Main Prompt
Explique por que guardar essa flag no state adiciona acoplamento desnecessario.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```tsx
const [items, setItems] = useState<string[]>([]);
const [isEmpty, setIsEmpty] = useState(true);
```

## Expected Answer Summary
A resposta deve mostrar que isEmpty e derivavel de items.length. Duplicar a verdade aumenta risco de drift.

## Expansion Notes
Pode crescer para badges e contadores.
