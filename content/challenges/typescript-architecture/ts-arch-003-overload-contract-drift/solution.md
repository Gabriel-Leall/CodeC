### Leitura de Sinais
Os overloads dizem que string vira number e number vira string.

### Causa Raiz
O corpo real da função não implementa essa transformação. Ele apenas devolve o valor recebido. Isso cria um descolamento entre o contrato público e o comportamento efetivo: o compilador aceita usos baseados em um comportamento que o runtime não entrega.

### Correção
Ou os overloads mudam, ou o corpo muda. Se a intenção é realmente converter:

```ts
function parseValue(value: string): number;
function parseValue(value: number): string;
function parseValue(value: string | number) {
  return typeof value === "string" ? Number(value) : String(value);
}
```

Se a intenção era “ecoar” o valor, então os overloads deveriam refletir isso, em vez de mentir para o consumidor.
