---
id: react-async-002-abort-on-unmount
title: Abort no cleanup
language: react
theme: async-ui-and-races
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1400
estimatedTime: 9
tags:
  - react
  - abort-controller
  - cleanup
---

## Main Prompt
Explique o que este cleanup esta tentando evitar.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```tsx
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);
```

## Expected Answer Summary
A resposta deve mostrar que o cleanup reduz trabalho inutil e escrita tardia apos unmount, mas ainda exige tratar o caso de abort conscientemente.

## Expansion Notes
Pode crescer para loaders e navegacao rapida.
