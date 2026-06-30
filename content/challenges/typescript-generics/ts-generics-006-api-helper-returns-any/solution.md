### Leitura de Sinais
O helper aceita qualquer `T`, mas nao valida nada antes de devolver o valor.

### Causa Raiz
O generic aqui e apenas cosmetico. O retorno real de `response.json()` continua sendo desconhecido em runtime, e o cast `as T` apenas manda o TypeScript confiar. Isso permite que consumidores acreditem ter um `User` valido mesmo quando a API devolve outro shape.

### Correcao
Pare de prometer um `T` sem validacao. O caminho minimo seguro e retornar `unknown` e validar na borda:

```ts
async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}
```

Se quiser manter o generic, ele precisa vir junto de um parser ou schema que verifique o dado de verdade.
