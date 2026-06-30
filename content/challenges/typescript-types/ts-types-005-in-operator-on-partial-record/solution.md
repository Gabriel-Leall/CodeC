### Leitura de Sinais
O teste usa `"success" in counters` como se isso provasse que `counters.success` e um numero valido.

### Causa Raiz
Em um `Partial<Record<...>>`, a chave pode existir com valor `undefined`. O operador `in` so fala sobre presenca da propriedade no objeto, nao sobre o valor armazenado. Entao o codigo ainda pode chamar `toFixed` em `undefined`.

### Correcao
Valide o valor em si:

```ts
function readSuccess(counters: Counters) {
  const success = counters.success;
  return typeof success === "number" ? success.toFixed(0) : "0";
}
```

Isso alinha o narrowing com a garantia que o codigo realmente precisa para executar.
