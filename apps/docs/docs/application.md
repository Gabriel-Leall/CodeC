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

A entrada pública direciona para <code>/inicio</code>. A página inicial pode atender visitantes e praticantes autenticados sem transformar o dashboard em um espaço privado.

</details>

<details>
<summary><code>/inicio</code> · Início canônico</summary>

Mostra a visão geral e um desafio em destaque com o código ao lado. Para visitantes, prioriza um desafio fácil praticado por mais pessoas. Para praticantes autenticados, pode retomar uma sessão recente ou recomendar um desafio próximo do ELO atual.

</details>

<details>
<summary><code>/desafios</code> · Catálogo canônico</summary>

Mostra os desafios disponíveis, permite busca textual e concentra os filtros contextuais de dificuldade, status, tipo e ordenação. Ao escolher um item, a aplicação navega para <code>/treinar/[id]</code>.

</details>

<details>
<summary><code>/treinar/[id]</code> · Arena canônica</summary>

Recebe o identificador de um desafio, apresenta o enunciado e o código para diagnóstico. Depois de errar, o praticante pode continuar sem ver a solução e com menor ELO potencial, ou revelar a solução e encerrar a sessão. A sessão aceita no máximo três tentativas avaliadas.

</details>

<details>
<summary><code>/perfil</code> · Perfil canônico</summary>

Reúne identidade do jogador, ELO, evolução, domínio por tópico, sessões recentes, recomendações e conquistas. A sidebar global também leva a esta rota para itens que ainda são seções do perfil, como histórico e configurações.

</details>

<details>
<summary><code>/dashboard</code> · Redirecionamento</summary>

É mantida por compatibilidade e redireciona para <code>/inicio</code>.

</details>

<details>
<summary><code>/challenges</code> e <code>/dashboard/challenges</code> · Compatibilidade</summary>

Mantêm caminhos antigos para quem já os utiliza e redirecionam para <code>/desafios</code>. Novos links devem apontar para a rota canônica.

</details>

<details>
<summary><code>/train/[id]</code> e <code>/dashboard/train/[id]</code> · Compatibilidade</summary>

Mantêm caminhos antigos da arena e redirecionam para <code>/treinar/[id]</code>. Novos links devem usar a rota canônica.

</details>

<details>
<summary><code>/login</code> · Redirecionamento local</summary>

O login autentica o praticante e preserva o destino local solicitado pela navegação.

</details>

<details>
<summary><code>/zen</code> · Laboratório</summary>

É um playground visual experimental. Fica fora da navegação principal e não faz parte da jornada de treino, catálogo ou perfil.

</details>

## Fluxo principal

1. O praticante ou visitante abre **Início** e escolhe entrar no catálogo.
2. Busca por texto e abre **Filtros** para combinar dificuldade, status, tipo e ordenação.
3. Seleciona um desafio e entra em `/treinar/[id]`.
4. Envia a análise e decide entre tentar novamente ou revelar a solução quando não resolver o desafio.
5. Consulta o resultado no **Perfil**.

## Rotas de API

As rotas `/api/*` não são páginas. Elas são interfaces HTTP para integrações e são descritas na [referência OpenAPI](/api-reference).

- `/api/me` e `/api/me/attempts` tratam o jogador atual e seu histórico.
- `/api/challenges` lista desafios.
- `/api/challenges/{id}` retorna detalhe de desafio.
- `/api/challenges/{id}/attempts` registra uma tentativa.
- `/api/auth/*` é fornecida pelo Better Auth.

> O contrato público de detalhe não expõe a solução de referência. Ela só aparece no resultado quando a sessão é resolvida ou quando o praticante escolhe revelá-la.
