### Causa Raiz
Se a propriedade `userId` mudar rapidamente (por exemplo, de 1 para 2, e depois para 3), múltiplas requisições assíncronas de rede serão disparadas concorrentemente. O tempo de resposta de cada chamada de rede é imprevisível. Se a primeira requisição demorar mais para responder do que as posteriores, o callback da primeira atualizará o estado por último, sobrescrevendo os dados corretos com dados antigos e exibindo informações incorretas na tela.

### Solução Ideal
Adicionar uma flag de controle local dentro do efeito para ignorar a resposta da requisição se o efeito for cancelado por uma mudança subsequente de dependência:

```tsx
useEffect(() => {
  let active = true;
  setLoading(true);

  fetch(`https://api.example.com/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (active) {
        setUser(data);
        setLoading(false);
      }
    });

  return () => {
    active = false;
  };
}, [userId]);
```
