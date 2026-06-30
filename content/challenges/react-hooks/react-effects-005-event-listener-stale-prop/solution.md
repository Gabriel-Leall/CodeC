### Leitura de Sinais
O listener é instalado uma única vez e fecha sobre o valor inicial de `enabled`.

### Causa Raiz
Como o effect não depende de `enabled`, o navegador continua chamando um handler que foi criado no primeiro render. Se `enabled` era `true` naquele momento, o atalho pode continuar funcionando mesmo depois de a UI desabilitá-lo; se era `false`, o atalho nunca passa a funcionar.

### Correção
Renove o listener quando `enabled` muda, ou use uma ref para manter o valor atual.

Correção mínima:

```tsx
useEffect(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s" && enabled) {
      event.preventDefault();
      console.log("saving");
    }
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [enabled]);
```
