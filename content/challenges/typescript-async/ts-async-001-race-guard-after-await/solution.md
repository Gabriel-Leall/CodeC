### Leitura de Sinais
O código verifica o estado do draft antes do `await` e depois usa o mesmo objeto como se nada pudesse ter mudado.

### Causa Raiz
O `await` abre uma janela temporal. Nesse intervalo, outro fluxo pode fechar o draft, limpar suas linhas ou até substituir seu conteúdo. A guarda inicial só valeu para aquele momento; ela não congela o objeto para o restante da função.

### Correção
As alternativas seguras são:

1. tirar um snapshot do dado que realmente será usado depois do `await`
2. revalidar o objeto após o `await`

Patch mínimo por snapshot:

```ts
async function persistDraft(draft?: Draft) {
  if (!draft || draft.status === "closed") return;

  const firstLine = draft.lines[0];
  if (!firstLine) return;

  await saveAuditEntry(draft.title);
  return firstLine.toUpperCase();
}
```
