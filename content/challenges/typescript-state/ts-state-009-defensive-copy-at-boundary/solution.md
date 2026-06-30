### Leitura de Sinais
A classe não expõe setter, mas recebe uma referência viva no construtor e devolve a mesma referência no método `list`.

### Causa Raiz
Encapsulamento por sintaxe não basta quando o dado continua escapando por referência. O array passado ao construtor ainda pode ser mutado fora da classe. Além disso, quem recebe o resultado de `list()` também pode alterar o conteúdo interno.

### Correção
Faça cópia defensiva na entrada e na saída:

```ts
class SessionStore {
  constructor(private readonly sessions: string[]) {
    this.sessions = [...sessions];
  }

  list() {
    return [...this.sessions];
  }
}
```

Se a coleção crescer em complexidade, convém considerar tipos readonly na borda também.
