---
id: react-memo-004-memoized-callback-identity-trap
title: Armadilha de identidade em callback memoizado
language: react
theme: derived-state-and-memoization
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1440
estimatedTime: 9
tags:
  - react
  - useCallback
  - identity
---

## Main Prompt
Explique por que memoizar callback nem sempre gera ganho real.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```tsx
const handleSave = useCallback(() => save(form), [form]);
return <Toolbar onSave={handleSave} />;
```

## Expected Answer Summary
A resposta deve mostrar que estabilidade de referencia so importa quando algum consumidor realmente compara ou depende dessa identidade.

## Expansion Notes
Pode crescer para arquitetura de components.
