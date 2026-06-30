### Leitura de Sinais
Há uma única flag booleana para representar qualquer request em andamento.

### Causa Raiz
Se duas chamadas a `refresh` são iniciadas, ambas ligam `loading`. Quando a primeira termina, ela executa `setLoading(false)` mesmo que a segunda ainda esteja em voo. O usuário vê o loading sumir cedo demais, embora ainda exista trabalho pendente.

### Correção
Modele concorrência de forma mais rica, por exemplo com contador de requests ativas:

```tsx
const [pendingCount, setPendingCount] = useState(0);

async function refresh(sectionId: string) {
  setPendingCount(count => count + 1);
  try {
    const result = await fetch("/api/sections/" + sectionId).then(response => response.text());
    setLogs(current => [...current, result]);
  } finally {
    setPendingCount(count => count - 1);
  }
}
```

E o loading passa a ser `pendingCount > 0`.
