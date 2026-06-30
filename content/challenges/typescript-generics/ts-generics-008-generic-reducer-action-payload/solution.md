### Leitura de Sinais
O reducer trata toda ação como se tivesse o mesmo payload do próprio state.

### Causa Raiz
Um único generic `T` para tudo apaga a diferença entre ações distintas. Isso impede o TypeScript de expressar, por exemplo, que uma ação `select` deveria carregar apenas um `selectedId`, enquanto uma ação `reset` talvez carregue o estado inteiro. O resultado é uma API flexível demais e pouco precisa.

### Correção
Modele a família de ações com uma união discriminada:

```ts
type Action =
  | { type: "reset"; payload: State }
  | { type: "select"; payload: { selectedId: string | null } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return action.payload;
    case "select":
      return { ...state, selectedId: action.payload.selectedId };
  }
}
```

Assim cada ação carrega apenas o payload que realmente faz sentido para ela.
