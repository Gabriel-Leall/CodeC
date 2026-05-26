### Causa Raiz
O `useEffect` captura a variável de estado `count` em seu escopo léxico (closure) durante a montagem do componente. Como o array de dependências está vazio `[]`, a função do efeito nunca é recriada. O callback do intervalo sempre vê o valor inicial de `count` como `0` a cada execução, disparando `setCount(0 + 1)` repetidamente.

### Soluções Possíveis

1. **Atualização Funcional do Estado**:
   Passar um callback para `setCount` que recebe o estado anterior estável:
   ```tsx
   setCount(prev => prev + 1);
   ```

2. **Adicionar Dependência**:
   Adicionar `count` ao array de dependências e limpar o intervalo no cleanup para evitar múltiplos intervals registrados concorrentemente:
   ```tsx
   useEffect(() => {
     const interval = setInterval(() => {
       setCount(count + 1);
     }, 1000);
     return () => clearInterval(interval);
   }, [count]);
   ```
