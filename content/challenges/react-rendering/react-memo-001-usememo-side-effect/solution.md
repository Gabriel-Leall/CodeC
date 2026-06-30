### Leitura de Sinais
O cálculo de `total` é puro, mas o callback de `useMemo` também dispara `analytics.track`.

### Causa Raiz
`useMemo` existe para memoizar um valor derivado. O callback deveria ser puro, porque o React pode recalculá-lo em momentos que não foram pensados como “eventos de negócio”. Colocar tracking ali mistura cálculo e side effect em um hook cujo contrato principal não é efeito colateral.

### Correção
Separe as responsabilidades:

```tsx
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

useEffect(() => {
  analytics.track("cart-recalculated", { size: items.length });
}, [items.length]);
```

Assim o valor memoizado continua puro e o tracking fica em um lugar semanticamente correto.
