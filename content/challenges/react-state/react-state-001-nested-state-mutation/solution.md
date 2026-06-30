### Leitura de Sinais
O código altera o objeto de estado existente e depois o envia de volta ao `setProfile`.

### Causa Raiz
React espera uma nova referência para detectar claramente uma atualização. Aqui o código muta `profile.prefs.compact` diretamente e reaproveita a mesma referência de `profile`. Além de poder falhar em disparar o rerender esperado, isso contamina o snapshot anterior do estado.

### Correção
Atualize o estado de forma imutável:

```tsx
const enableCompact = () => {
  setProfile(current => ({
    ...current,
    prefs: {
      ...current.prefs,
      compact: true,
    },
  }));
};
```
