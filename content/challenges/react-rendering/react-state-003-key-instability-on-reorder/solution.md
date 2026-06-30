### Leitura de Sinais
Cada linha possui estado local (`selected`) e a lista usa o índice como `key`.

### Causa Raiz
Quando a ordem muda, os índices mudam junto. O React passa a reutilizar instâncias de `PlayerRow` com base no índice, não na identidade real do jogador. O resultado é que o estado local pode “grudar” na linha errada após a reordenação.

### Correção
Use uma key estável de domínio:

```tsx
<ul>{players.map(player => <PlayerRow key={player.id} player={player} />)}</ul>
```

Assim a reconciliação acompanha a identidade correta de cada item.
