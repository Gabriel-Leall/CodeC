### Leitura de Sinais
O filtro depende de `query`, mas o memo so observa `users`.

### Causa Raiz
Quando o usuario digita, o componente rerenderiza, mas `visibleUsers` continua reutilizando o resultado memoizado anterior porque `query` nao esta no array de dependencias. Na pratica, a derivacao fica presa a um snapshot antigo da busca.

### Correcao
Inclua todas as entradas reais do calculo nas dependencias:

```tsx
const visibleUsers = useMemo(() => {
  return users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );
}, [users, query]);
```

Se o filtro for barato, outra alternativa valida e remover o `useMemo` completamente.
