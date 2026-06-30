### Leitura de Sinais
O update otimista usa `likes + 1` a partir do valor fechado no render atual.

### Causa Raiz
Se dois cliques ocorrem muito próximos, ambos os handlers podem usar o mesmo valor antigo de `likes`. Em vez de produzir dois incrementos, os dois eventos calculam o mesmo próximo estado e um deles “some”.

### Correção
Use update funcional para sempre derivar do valor mais recente:

```tsx
async function handleLike() {
  setLikes(current => current + 1);
  await saveLike();
}
```

Se houver rollback em caso de erro, ele também precisa ser modelado de forma consistente para não criar outro race.
