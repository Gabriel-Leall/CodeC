### Leitura de Sinais
Duas atualizações para a mesma chave podem coexistir sem nenhuma noção de versão ou request atual.

### Causa Raiz
Se duas requests para `u1` são disparadas, a mais nova pode terminar primeiro e gravar o valor correto. Depois, a request antiga termina por último e sobrescreve o cache com um valor stale. O problema não está no `Map`; está na ausência de coordenação entre ordem de disparo e ordem de conclusão.

### Correção
Uma correção mínima é carregar um token por request e só aplicar a escrita se ela ainda for a mais recente:

```ts
const latestRequest = new Map<string, number>();

async function refreshUser(id: string) {
  const token = (latestRequest.get(id) ?? 0) + 1;
  latestRequest.set(id, token);

  const value = await fetchUser(id);

  if (latestRequest.get(id) === token) {
    cache.set(id, value);
  }
}
```
