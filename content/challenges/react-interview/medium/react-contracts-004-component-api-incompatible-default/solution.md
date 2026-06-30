### Leitura de Sinais
O componente define um valor default, mas esse default faz o avatar nascer com largura e altura zero.

### Causa Raiz
O problema não é sintático; é contratual. Um default deveria representar um comportamento útil e previsível para quem consome o componente. Aqui, o consumidor que omite `size` recebe um avatar invisível, o que contradiz a expectativa natural da API.

### Correção
Escolha um default válido para o domínio visual, por exemplo:

```tsx
export function Avatar({ src, size = 32 }: AvatarProps) {
  return <img src={src} width={size} height={size} alt="" />;
}
```

Se o componente não tiver um tamanho padrão convincente, então `size` deveria ser obrigatório em vez de opcional.
