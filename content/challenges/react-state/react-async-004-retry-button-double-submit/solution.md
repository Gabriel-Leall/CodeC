### Leitura de Sinais
O código tenta bloquear reenvios com a flag `submitting`, mas lê esse valor dentro da closure do evento.

### Causa Raiz
Atualizações de estado em React não tornam o novo valor observável instantaneamente dentro de outros handlers que já foram disparados. Se o usuário der dois cliques muito próximos, ambos podem entrar em `retry` antes de o próximo render refletir `submitting = true`.

### Correção
Use um lock síncrono com `ref` ou desabilite o botão imediatamente por uma borda que não dependa do próximo render. Exemplo com `useRef`:

```tsx
const submittingRef = useRef(false);

async function retry() {
  if (submittingRef.current) return;
  submittingRef.current = true;
  setSubmitting(true);

  try {
    setAttempts(current => current + 1);
    await submitRetry();
  } finally {
    submittingRef.current = false;
    setSubmitting(false);
  }
}
```
