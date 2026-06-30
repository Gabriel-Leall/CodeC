### Leitura de Sinais
O effect dispara uma nova request sempre que `userId` muda, mas não controla qual resposta ainda é válida.

### Causa Raiz
Duas ou mais requests podem ficar em voo ao mesmo tempo. Se o usuário muda de `userId` rapidamente, a request antiga pode terminar depois da mais nova. Nesse caso, o callback da request antiga ainda chama `setUser` e sobrescreve o estado atual com dados obsoletos.

### Correção
Ignore respostas stale usando uma flag local ou um token por request. Um patch mínimo:

```tsx
useEffect(() => {
  let active = true;

  fetch("/api/users/" + userId)
    .then(response => response.json())
    .then(data => {
      if (active) setUser(data);
    });

  return () => {
    active = false;
  };
}, [userId]);
```
