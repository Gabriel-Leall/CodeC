---
id: react-effects-005-event-listener-stale-prop
title: Listener preso em prop antiga
language: react
theme: effects-and-lifecycle
challengeType: debug
difficulty: MEDIUM
recommendedElo: 1470
estimatedTime: 9
tags:
  - react
  - event-listener
  - stale-closure
---

## Main Prompt
Explique por que o listener global pode continuar reagindo a uma prop velha.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
function Hotkey({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const onKey = () => {
      if (enabled) console.log("run");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
```

## Expected Answer Summary
A resposta deve mostrar que o listener registrado fecha sobre o valor inicial de enabled. Ref ou renovacao consciente do listener corrigem isso.

## Expansion Notes
Pode crescer para atalhos e toggles de editor.
