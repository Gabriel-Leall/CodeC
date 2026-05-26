### Causa Raiz
No JavaScript, objetos são comparados por referência na memória, não por valor estrutural. O objeto `config` é recriado a cada renderização do componente, obtendo uma nova referência. Como `config` está no array de dependências do `useEffect`, o React detecta uma mudança de dependência e executa o efeito novamente. O efeito então chama `setData`, o que aciona um re-render, recriando `config` com outra referência e iniciando um loop infinito.

### Soluções Possíveis

1. **Extrair para fora do componente** (se for estático):
   ```tsx
   const config = { api: "https://api.example.com/items" };
   export function DataFetcher() { ... }
   ```

2. **Usar dependência primitiva** (String) no array:
   ```tsx
   useEffect(() => {
     fetch(config.api) ...
   }, [config.api]);
   ```
