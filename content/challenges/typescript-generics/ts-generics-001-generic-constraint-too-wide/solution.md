### Leitura de Sinais
A função se anuncia como genérica sobre qualquer `object`, mas logo em seguida força um cast para uma estrutura com `id`.

### Causa Raiz
Isso mostra que o constraint `T extends object` é largo demais para o comportamento real. A API não aceita “qualquer objeto”; ela precisa de objetos com `id`. O cast existe apenas para tapar um contrato que foi modelado de forma frouxa.

### Correção
Explicite a necessidade no próprio generic:

```ts
function firstId<T extends { id: string }>(items: T[]) {
  if (items.length === 0) return undefined;
  return items[0].id;
}
```

Se a função tiver que lidar com objetos sem `id`, então ela precisa de outra API, não de um cast escondido.
