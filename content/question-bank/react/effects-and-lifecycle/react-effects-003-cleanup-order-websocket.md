---
id: react-effects-003-cleanup-order-websocket
title: Cleanup de websocket
language: react
theme: effects-and-lifecycle
challengeType: explain-code
difficulty: MEDIUM
recommendedElo: 1420
estimatedTime: 9
tags:
  - react
  - cleanup
  - websocket
---

## Main Prompt
Explique o que este effect tenta garantir sobre inscricao e limpeza.

## Coverage Checklist
1. Descrever o que o codigo esta tentando fazer
2. Explicar onde o contrato do codigo termina ou fica fragil
3. Apontar trade-offs, limites ou riscos da abordagem

## Mini Snippet
```tsx
useEffect(() => {
  const socket = connect(roomId);
  socket.on("message", onMessage);
  return () => socket.off("message", onMessage);
}, [roomId, onMessage]);
```

## Expected Answer Summary
A resposta deve descrever montagem, limpeza e risco de listeners duplicados quando a ordem e o cleanup nao sao respeitados.

## Expansion Notes
Pode crescer para streams de notificacao.
