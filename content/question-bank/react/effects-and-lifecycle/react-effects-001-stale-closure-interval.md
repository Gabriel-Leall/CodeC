---
id: react-effects-001-stale-closure-interval
title: Intervalo preso em stale closure
language: react
theme: effects-and-lifecycle
challengeType: debug
difficulty: EASY
recommendedElo: 1300
estimatedTime: 7
tags:
  - react
  - useEffect
  - stale-closure
---

## Main Prompt
Explique por que este contador trava em vez de crescer continuamente.

## Coverage Checklist
1. Identificar a causa raiz no snippet
2. Explicar o impacto observavel para o usuario ou para o sistema
3. Propor a correcao minima segura com justificativa

## Mini Snippet
```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{count}</span>;
}
```

## Expected Answer Summary
A resposta deve mostrar que o callback fecha sobre o valor inicial de count. Update funcional ou dependencias corretas resolvem a armadilha.

## Expansion Notes
Pode crescer para polling e cronometro.
