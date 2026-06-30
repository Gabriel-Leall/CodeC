### Leitura de Sinais
O client guarda um unico `AbortController` na instancia inteira.

### Causa Raiz
Depois que `abort()` e chamado, o `signal` associado permanece abortado para sempre. Como o metodo `search` continua reutilizando o mesmo controller, toda chamada futura herda um sinal ja cancelado e pode falhar imediatamente.

### Correcao
Crie um novo controller por requisicao ou recrie-o logo apos cancelar. A opcao mais segura e modelar o ciclo por chamada:

```ts
class SearchClient {
  private controller: AbortController | null = null;

  async search(query: string) {
    this.controller = new AbortController();

    const response = await fetch("/api/search?q=" + encodeURIComponent(query), {
      signal: this.controller.signal,
    });

    return response.json();
  }

  cancel() {
    this.controller?.abort();
    this.controller = null;
  }
}
```
