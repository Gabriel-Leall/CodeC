### Leitura de Sinais
O effect depende de `filters`, mas `filters` é criado de novo a cada render.

### Causa Raiz
Mesmo quando `query` não muda, a identidade de `filters` muda porque um novo objeto é alocado em cada render. Como o array de dependências compara por referência, o `useEffect` entende que a dependência mudou e dispara uma nova busca.

### Correção
Existem duas soluções seguras:

1. Derivar o objeto dentro do effect e depender apenas de `query`
2. Memoizar `filters`

Patch mínimo:

```tsx
useEffect(() => {
  const filters = { query, limit: 10 };

  fetch("/api/search", {
    method: "POST",
    body: JSON.stringify(filters),
  })
    .then(response => response.json())
    .then(data => setRows(data.items));
}, [query]);
```
