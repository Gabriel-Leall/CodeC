### Leitura de Sinais
O contador renderiza corretamente no primeiro tick, mas depois para de avançar.

### Causa Raiz
O callback do `setInterval` fecha sobre o valor inicial de `count`. Como o `useEffect` roda só uma vez, o timer continua chamando uma função que sempre conhece `count = 0`, então o estado é atualizado repetidamente para `1`.

### Correção
Use update funcional para que cada tick leia o valor mais recente do estado:

```tsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(current => current + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

Também seria possível recriar o intervalo quando `count` muda, mas isso é mais custoso e menos direto para este caso.
