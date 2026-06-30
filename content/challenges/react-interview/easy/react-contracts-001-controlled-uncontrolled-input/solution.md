### Leitura de Sinais
No primeiro render, `value` está como `undefined`. Depois do fetch, passa a ser string.

### Causa Raiz
Quando `value` é `undefined`, o input nasce como não controlado. Depois que o fetch termina, o componente passa a fornecer um valor explícito e o input se torna controlado. Essa troca de contrato no meio do ciclo de vida gera warning e comportamento imprevisível.

### Correção
Escolha um contrato único desde o início. O patch mínimo é começar com string vazia:

```tsx
const [value, setValue] = useState("");
```

Assim o campo já nasce controlado e continua controlado depois da hidratação.
