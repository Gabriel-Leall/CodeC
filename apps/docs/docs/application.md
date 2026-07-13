---
sidebar_position: 2
title: Aplicação e rotas
---

# Aplicação e rotas

Kodan é uma aplicação Next.js para treino de leitura e diagnóstico de código. Esta página descreve a navegação de interface. Ela é diferente da [referência de API](/api-reference), que documenta apenas os Route Handlers HTTP.

## Navegação global

As telas de treino usam a mesma sidebar global:

- **Início** leva ao fluxo de entrada.
- **Desafios** abre o catálogo.
- **Perfil** mostra progresso, ELO e histórico.
- **Histórico** e **Configurações** apontam para seções do perfil enquanto ainda não possuem rotas independentes.

O cabeçalho global identifica a área atual e mantém o acesso a notificações. A navegação contextual fica dentro da página: por exemplo, a busca e os filtros pertencem ao catálogo, não à sidebar.

## Rotas de interface

Abra uma rota para ver como ela participa da jornada. As rotas marcadas como **canônicas** são os endereços que a navegação deve preferir.

<details>
<summary><code>/</code> · Entrada</summary>

O gate inicial decide se o jogador já pode entrar no treino e, no fluxo local atual, direciona para o catálogo. Não é uma tela de trabalho persistente: depois da decisão, a jornada continua em **Desafios**.

</details>

<details>
<summary><code>/challenges</code> · Catálogo canônico</summary>

É o ponto de partida de treino. Mostra os desafios disponíveis, permite busca textual e concentra os filtros contextuais de dificuldade, status, tipo e ordenação. Ao escolher um item, a aplicação navega para <code>/train/[id]</code>.

</details>

<details>
<summary><code>/train/[id]</code> · Arena canônica</summary>

Recebe o identificador de um desafio, apresenta o enunciado e o código para diagnóstico. O jogador escreve a análise, pode registrar o uso de dica e envia a tentativa. Ao final, recebe feedback e a atualização de ELO quando a avaliação está disponível.

</details>

<details>
<summary><code>/profile</code> · Perfil canônico</summary>

Reúne identidade do jogador, ELO, evolução, domínio por tópico, sessões recentes, recomendações e conquistas. A sidebar global também leva a esta rota para itens que ainda são seções do perfil, como histórico e configurações.

</details>

<details>
<summary><code>/dashboard</code> · Redirecionamento</summary>

É mantida por compatibilidade. Ela não apresenta uma interface própria: redireciona diretamente para <code>/profile</code>.

</details>

<details>
<summary><code>/dashboard/challenges</code> · Compatibilidade</summary>

Mantém o caminho antigo para quem já o utiliza. A implementação é reutilizada por <code>/challenges</code>; novos links devem apontar para a rota canônica.

</details>

<details>
<summary><code>/dashboard/train/[id]</code> · Compatibilidade</summary>

É o caminho antigo da arena. A implementação é a mesma de <code>/train/[id]</code>; novos links devem usar a rota canônica.

</details>

<details>
<summary><code>/login</code> · Redirecionamento local</summary>

No estado atual, a rota não mostra um formulário de autenticação separado. Ela direciona para <code>/challenges</code>, porque o projeto ainda trabalha com o fluxo local de jogador.

</details>

<details>
<summary><code>/zen</code> · Laboratório</summary>

É um playground visual experimental. Fica fora da navegação principal e não faz parte da jornada de treino, catálogo ou perfil.

</details>

## Fluxo principal

1. O jogador abre **Desafios**.
2. Busca por texto e abre **Filtros** para combinar dificuldade, status, tipo e ordenação.
3. Seleciona um desafio e entra em `/train/[id]`.
4. Envia a análise e recebe feedback com alteração de ELO quando houver avaliação disponível.
5. Consulta o resultado no **Perfil**.

## Rotas de API

As rotas `/api/*` não são páginas. Elas são interfaces HTTP para integrações e são descritas na [referência OpenAPI](/api-reference).

- `/api/me` e `/api/me/attempts` tratam o jogador atual e seu histórico.
- `/api/challenges` lista desafios.
- `/api/challenges/{id}` retorna detalhe de desafio.
- `/api/challenges/{id}/attempts` registra uma tentativa.
- `/api/auth/*` é fornecida pelo Better Auth.

> A rota de detalhe expõe atualmente a solução de referência. Isso é conhecido como um problema de produto e deve mudar quando o módulo de treino separar a projeção do enunciado do feedback pós-envio.
