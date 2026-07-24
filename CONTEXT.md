# Kodan

O Kodan treina leitura e diagnóstico de código por meio de desafios avaliados, progressão por ELO e feedback técnico.

## Language

**Desafio**:
Exercício jogável contendo código, pergunta diagnóstica, dificuldade, tópicos e solução de referência.
_Avoid_: Questão, exercício editorial

**Tentativa**:
Resposta enviada por um praticante para um Desafio. Uma sessão pode ter até três Tentativas avaliadas; o ELO potencial diminui a cada nova Tentativa e só é concedido quando o Desafio é resolvido.
_Avoid_: Submissão, resposta

**Sessão de tentativa**:
Ciclo de treino de um Praticante em um Desafio. Pode permitir nova Tentativa, terminar com o Desafio resolvido, esgotar o ELO disponível ou ser encerrada quando a solução é revelada.
_Avoid_: Rodada, execução

**Avaliação da tentativa**:
Resultado que combina feedback técnico, pontuação e mudança de ELO produzidos para uma Tentativa.
_Avoid_: Correção, análise da IA

**Praticante**:
Pessoa que treina no Kodan e acumula Tentativas, ELO e progresso.
_Avoid_: Aluno, jogador, usuário quando o papel de treino for relevante

**Progresso do praticante**:
Visão consolidada das Tentativas de um Praticante, incluindo sequência, precisão, desafios resolvidos, estudo e evolução de ELO.
_Avoid_: Dados do perfil, estatísticas do dashboard

**Tópico do desafio**:
Classificação canônica de um Desafio usada no catálogo, no progresso e nas recomendações.
_Avoid_: Categoria do perfil, seção do catálogo

**Catálogo promovido**:
Conjunto validado de Desafios jogáveis em `content/challenges`, pronto para leitura pelo produto e sincronização com persistência.
_Avoid_: Banco de questões, seed, conteúdo editorial

**Banco de questões**:
Conteúdo editorial ainda em curadoria e não jogável, mantido em `content/question-bank`.
_Avoid_: Catálogo promovido, desafios ativos

## Flagged ambiguities

- **Perfil** é uma tela; **Progresso do praticante** é o conceito compartilhado por Perfil e Dashboard.
- **Banco de questões** não é o **Catálogo promovido**: promoção é a passagem explícita do conteúdo editorial para um Desafio jogável.

## Example dialogue

> Dev: Uma Tentativa repetida ainda pode aumentar o ELO do Praticante?
>
> Especialista: Sim, se resolver o Desafio antes de revelar a solução. O ganho potencial diminui a cada erro e nunca é concedido duas vezes na mesma Sessão de tentativa.
>
> Dev: Onde classifico o Desafio para aparecer no Perfil e no catálogo?
>
> Especialista: No Tópico do desafio canônico. Depois que o conteúdo sair do Banco de questões, ele entra no Catálogo promovido e passa a compor o Progresso do praticante.
