### Leitura de Sinais
O snippet contém dois sintomas clássicos: filtro com memo incompleto e mutação direta de estado.

### Causa Raiz
- O filtro depende de `searchTerm`, mas ele não está no array de dependências do `useMemo`.
- O botão muta `rows` diretamente antes do `setRows(rows)`; a referência não muda e o React pode não re-renderizar.

### Correção
- Incluir `searchTerm` nas dependências do memo.
- Atualizar estado de forma imutável: `setRows(prev => prev.map(...))`.

### Exemplo de patch
```tsx
const filtered = useMemo(() => {
  return rows.filter(row => row.name.toLowerCase().includes(searchTerm.toLowerCase()));
}, [rows, searchTerm]);

const addOne = () => {
  setRows(prev => prev.map((row, i) => i === 0 ? { ...row, score: row.score + 1 } : row));
};
```
