### Leitura de Sinais
O predicado diz ao compilador que, depois da verificação, `value` tem a forma completa de `LoadedUser`.

### Causa Raiz
Em runtime, a função apenas checa se o valor é truthy. Isso não prova a existência de `id`, nem que `ready` seja `true`. O resultado é um contrato mentiroso: o compilador confia, mas o programa pode falhar depois.

### Correção
O predicado precisa validar a estrutura que promete:

```ts
function isLoadedUser(value: unknown): value is LoadedUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as { id: unknown }).id === "string" &&
    "ready" in value &&
    (value as { ready: unknown }).ready === true
  );
}
```

Se a checagem completa não fizer sentido, o melhor é não usar type guard com contrato tão forte.
