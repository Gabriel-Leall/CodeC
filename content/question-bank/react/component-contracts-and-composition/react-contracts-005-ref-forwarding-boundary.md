---
id: react-contracts-005-ref-forwarding-boundary
title: forwardRef como ampliacao de contrato
language: react
theme: component-contracts-and-composition
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1400
estimatedTime: 9
tags:
  - react
  - ref
  - forwardRef
---

## Main Prompt
Explique o que muda no contrato publico quando um componente passa a encaminhar ref.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```tsx
const Field = forwardRef<HTMLInputElement, { label: string }>((props, ref) => {
  return <input ref={ref} aria-label={props.label} />;
});
```

## Expected Answer Summary
A resposta deve mostrar que forwardRef expoe uma borda imperativa e acopla consumidores a uma estrutura interna. Isso deve ser intencional.

## Expansion Notes
Pode crescer para inputs e command menu.
