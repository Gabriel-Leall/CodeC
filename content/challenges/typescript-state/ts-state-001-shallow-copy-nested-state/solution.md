### Leitura de Sinais
O código cria `next` com spread, o que dá a impressão de imutabilidade.

### Causa Raiz
O spread copia apenas o primeiro nível do objeto. A propriedade `theme` continua apontando para o mesmo objeto interno tanto em `state` quanto em `next`. Quando o código faz `next.theme.contrast = "high"`, ele está mutando também a estrutura interna do estado anterior.

### Correção
Copie também o nível aninhado que será alterado:

```ts
function enableHighContrast(state: Preferences) {
  return {
    ...state,
    theme: {
      ...state.theme,
      contrast: "high",
    },
  };
}
```

Assim o novo estado ganha uma nova referência externa e interna para a parte alterada.
