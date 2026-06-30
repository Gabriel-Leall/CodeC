import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type ChallengeDefinition = {
  category: string;
  slug: string;
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  recommendedElo: number;
  language: "react" | "typescript";
  estimatedTime: number;
  type: "debug";
  tags: string[];
  prompt: string;
  checklist: [string, string, string];
  code: string;
  solution: string;
};

const challenges: ChallengeDefinition[] = [
  {
    category: "react-state",
    slug: "react-async-004-retry-button-double-submit",
    id: "react-async-004-retry-button-double-submit",
    title: "Retry com Janela para Double Submit",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "async", "retry", "double-submit", "debugging"],
    prompt: "O time diz que, ao clicar rápido no botão de retry, a mesma operação pode ser enviada duas vezes. Explique por quê.",
    checklist: [
      "o erro principal envolvendo a janela entre evento e lock efetivo",
      "como dois cliques próximos ainda conseguem atravessar a proteção",
      "a correção mínima segura com código",
    ],
    code: `import React, { useState } from "react";

export function RetryPanel() {
  const [submitting, setSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);

  async function retry() {
    if (submitting) return;

    setSubmitting(true);
    setAttempts(current => current + 1);
    await submitRetry();
    setSubmitting(false);
  }

  return (
    <div>
      <button onClick={retry}>Tentar novamente</button>
      <p>Tentativas: {attempts}</p>
    </div>
  );
}
`,
    solution: `### Leitura de Sinais
O código tenta bloquear reenvios com a flag \`submitting\`, mas lê esse valor dentro da closure do evento.

### Causa Raiz
Atualizações de estado em React não tornam o novo valor observável instantaneamente dentro de outros handlers que já foram disparados. Se o usuário der dois cliques muito próximos, ambos podem entrar em \`retry\` antes de o próximo render refletir \`submitting = true\`.

### Correção
Use um lock síncrono com \`ref\` ou desabilite o botão imediatamente por uma borda que não dependa do próximo render. Exemplo com \`useRef\`:

\`\`\`tsx
const submittingRef = useRef(false);

async function retry() {
  if (submittingRef.current) return;
  submittingRef.current = true;
  setSubmitting(true);

  try {
    setAttempts(current => current + 1);
    await submitRetry();
  } finally {
    submittingRef.current = false;
    setSubmitting(false);
  }
}
\`\`\`
`,
  },
  {
    category: "react-state",
    slug: "react-state-004-optimistic-counter-race",
    id: "react-state-004-optimistic-counter-race",
    title: "Contador Otimista com Race entre Cliques",
    difficulty: "MEDIUM",
    recommendedElo: 1500,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "state", "optimistic-ui", "race-condition", "debugging"],
    prompt: "Explique por que interações rápidas podem deixar este contador otimista em um valor incorreto.",
    checklist: [
      "o problema principal envolvendo uso de state fechado na closure",
      "como cliques próximos competem usando o mesmo snapshot antigo",
      "a correção mínima segura com código",
    ],
    code: `import React, { useState } from "react";

export function LikeCounter() {
  const [likes, setLikes] = useState(0);

  async function handleLike() {
    setLikes(likes + 1);
    await saveLike();
  }

  return (
    <button onClick={handleLike}>
      Likes: {likes}
    </button>
  );
}
`,
    solution: `### Leitura de Sinais
O update otimista usa \`likes + 1\` a partir do valor fechado no render atual.

### Causa Raiz
Se dois cliques ocorrem muito próximos, ambos os handlers podem usar o mesmo valor antigo de \`likes\`. Em vez de produzir dois incrementos, os dois eventos calculam o mesmo próximo estado e um deles “some”.

### Correção
Use update funcional para sempre derivar do valor mais recente:

\`\`\`tsx
async function handleLike() {
  setLikes(current => current + 1);
  await saveLike();
}
\`\`\`

Se houver rollback em caso de erro, ele também precisa ser modelado de forma consistente para não criar outro race.
`,
  },
  {
    category: "react-interview/medium",
    slug: "react-contracts-004-component-api-incompatible-default",
    id: "react-contracts-004-component-api-incompatible-default",
    title: "Default de Prop que Quebra o Contrato Visual",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["interview", "react", "component-api", "defaults", "debugging"],
    prompt: "Você recebeu este componente de avatar em uma entrevista técnica. Explique por que o valor default parece inocente, mas quebra o contrato visual da API.",
    checklist: [
      "o erro principal envolvendo um default semanticamente inválido",
      "como esse contrato ruim aparece na interface ou no consumo do componente",
      "a correção mínima segura com código",
    ],
    code: `import React from "react";

type AvatarProps = {
  src: string;
  size?: number;
};

export function Avatar({ src, size = 0 }: AvatarProps) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
    />
  );
}
`,
    solution: `### Leitura de Sinais
O componente define um valor default, mas esse default faz o avatar nascer com largura e altura zero.

### Causa Raiz
O problema não é sintático; é contratual. Um default deveria representar um comportamento útil e previsível para quem consome o componente. Aqui, o consumidor que omite \`size\` recebe um avatar invisível, o que contradiz a expectativa natural da API.

### Correção
Escolha um default válido para o domínio visual, por exemplo:

\`\`\`tsx
export function Avatar({ src, size = 32 }: AvatarProps) {
  return <img src={src} width={size} height={size} alt="" />;
}
\`\`\`

Se o componente não tiver um tamanho padrão convincente, então \`size\` deveria ser obrigatório em vez de opcional.
`,
  },
  {
    category: "typescript-async",
    slug: "ts-async-001-race-guard-after-await",
    id: "ts-async-001-race-guard-after-await",
    title: "Guarda Antes do Await Não Congela o Domínio",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    language: "typescript",
    estimatedTime: 9,
    type: "debug",
    tags: ["typescript", "async", "race-condition", "debugging"],
    prompt: "Explique por que esta checagem inicial não garante que o draft ainda esteja válido no fim da operação.",
    checklist: [
      "o erro principal envolvendo a janela temporal criada pelo await",
      "como o draft pode mudar mesmo depois da guarda inicial",
      "a correção mínima segura com código",
    ],
    code: `type Draft = {
  status: "open" | "closed";
  title: string;
  lines: string[];
};

async function persistDraft(draft?: Draft) {
  if (!draft || draft.status === "closed") return;

  await saveAuditEntry(draft.title);

  return draft.lines[0].toUpperCase();
}
`,
    solution: `### Leitura de Sinais
O código verifica o estado do draft antes do \`await\` e depois usa o mesmo objeto como se nada pudesse ter mudado.

### Causa Raiz
O \`await\` abre uma janela temporal. Nesse intervalo, outro fluxo pode fechar o draft, limpar suas linhas ou até substituir seu conteúdo. A guarda inicial só valeu para aquele momento; ela não congela o objeto para o restante da função.

### Correção
As alternativas seguras são:

1. tirar um snapshot do dado que realmente será usado depois do \`await\`
2. revalidar o objeto após o \`await\`

Patch mínimo por snapshot:

\`\`\`ts
async function persistDraft(draft?: Draft) {
  if (!draft || draft.status === "closed") return;

  const firstLine = draft.lines[0];
  if (!firstLine) return;

  await saveAuditEntry(draft.title);
  return firstLine.toUpperCase();
}
\`\`\`
`,
  },
  {
    category: "typescript-async",
    slug: "ts-async-007-stale-cache-write",
    id: "ts-async-007-stale-cache-write",
    title: "Resposta Lenta Sobrescrevendo Cache Mais Novo",
    difficulty: "HARD",
    recommendedElo: 1680,
    language: "typescript",
    estimatedTime: 12,
    type: "debug",
    tags: ["typescript", "async", "cache", "stale-write", "debugging"],
    prompt: "Explique como esta rotina de refresh permite que uma resposta antiga sobrescreva um valor mais novo no cache.",
    checklist: [
      "o bug principal de stale write entre requests concorrentes",
      "como a ordem de conclusão quebra a expectativa do cache",
      "uma correção mínima segura com código",
    ],
    code: `const cache = new Map<string, string>();

async function refreshUser(id: string) {
  const value = await fetchUser(id);
  cache.set(id, value);
}

async function refreshVisibleUsers() {
  await Promise.all([
    refreshUser("u1"),
    refreshUser("u1"),
  ]);
}
`,
    solution: `### Leitura de Sinais
Duas atualizações para a mesma chave podem coexistir sem nenhuma noção de versão ou request atual.

### Causa Raiz
Se duas requests para \`u1\` são disparadas, a mais nova pode terminar primeiro e gravar o valor correto. Depois, a request antiga termina por último e sobrescreve o cache com um valor stale. O problema não está no \`Map\`; está na ausência de coordenação entre ordem de disparo e ordem de conclusão.

### Correção
Uma correção mínima é carregar um token por request e só aplicar a escrita se ela ainda for a mais recente:

\`\`\`ts
const latestRequest = new Map<string, number>();

async function refreshUser(id: string) {
  const token = (latestRequest.get(id) ?? 0) + 1;
  latestRequest.set(id, token);

  const value = await fetchUser(id);

  if (latestRequest.get(id) === token) {
    cache.set(id, value);
  }
}
\`\`\`
`,
  },
  {
    category: "typescript-state",
    slug: "ts-state-009-defensive-copy-at-boundary",
    id: "ts-state-009-defensive-copy-at-boundary",
    title: "Borda sem Cópia Defensiva",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    language: "typescript",
    estimatedTime: 9,
    type: "debug",
    tags: ["typescript", "state", "api-boundary", "debugging"],
    prompt: "Explique por que esta classe parece encapsular o estado, mas ainda permite mutação externa do seu conteúdo.",
    checklist: [
      "o problema principal envolvendo vazamento de referência na borda da API",
      "como um consumidor externo ainda altera o estado interno",
      "a correção mínima segura com código",
    ],
    code: `class SessionStore {
  constructor(private readonly sessions: string[]) {}

  list() {
    return this.sessions;
  }
}

const initialSessions = ["a", "b"];
const store = new SessionStore(initialSessions);
initialSessions.push("c");
`,
    solution: `### Leitura de Sinais
A classe não expõe setter, mas recebe uma referência viva no construtor e devolve a mesma referência no método \`list\`.

### Causa Raiz
Encapsulamento por sintaxe não basta quando o dado continua escapando por referência. O array passado ao construtor ainda pode ser mutado fora da classe. Além disso, quem recebe o resultado de \`list()\` também pode alterar o conteúdo interno.

### Correção
Faça cópia defensiva na entrada e na saída:

\`\`\`ts
class SessionStore {
  constructor(private readonly sessions: string[]) {
    this.sessions = [...sessions];
  }

  list() {
    return [...this.sessions];
  }
}
\`\`\`

Se a coleção crescer em complexidade, convém considerar tipos readonly na borda também.
`,
  },
  {
    category: "typescript-generics",
    slug: "ts-generics-001-generic-constraint-too-wide",
    id: "ts-generics-001-generic-constraint-too-wide",
    title: "Constraint Genérico Largo Demais",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    language: "typescript",
    estimatedTime: 9,
    type: "debug",
    tags: ["typescript", "generics", "constraints", "debugging"],
    prompt: "Explique por que este helper parece genérico e reutilizável, mas na prática já depende de uma propriedade específica.",
    checklist: [
      "o erro principal envolvendo um constraint amplo demais",
      "por que o cast posterior denuncia um contrato mal modelado",
      "a correção mínima segura com código",
    ],
    code: `function firstId<T extends object>(items: T[]) {
  if (items.length === 0) return undefined;
  return (items[0] as { id: string }).id;
}

const users = [{ id: "u1", name: "Ana" }];
const id = firstId(users);
`,
    solution: `### Leitura de Sinais
A função se anuncia como genérica sobre qualquer \`object\`, mas logo em seguida força um cast para uma estrutura com \`id\`.

### Causa Raiz
Isso mostra que o constraint \`T extends object\` é largo demais para o comportamento real. A API não aceita “qualquer objeto”; ela precisa de objetos com \`id\`. O cast existe apenas para tapar um contrato que foi modelado de forma frouxa.

### Correção
Explicite a necessidade no próprio generic:

\`\`\`ts
function firstId<T extends { id: string }>(items: T[]) {
  if (items.length === 0) return undefined;
  return items[0].id;
}
\`\`\`

Se a função tiver que lidar com objetos sem \`id\`, então ela precisa de outra API, não de um cast escondido.
`,
  },
  {
    category: "typescript-generics",
    slug: "ts-generics-008-generic-reducer-action-payload",
    id: "ts-generics-008-generic-reducer-action-payload",
    title: "Reducer Genérico Sem Vínculo entre Ação e Payload",
    difficulty: "HARD",
    recommendedElo: 1670,
    language: "typescript",
    estimatedTime: 12,
    type: "debug",
    tags: ["typescript", "generics", "reducer", "actions", "debugging"],
    prompt: "Explique por que este reducer genérico parece flexível, mas perde a relação correta entre tipo de ação e payload.",
    checklist: [
      "o erro principal envolvendo um generic único para ações de naturezas diferentes",
      "como isso enfraquece a segurança do payload",
      "a correção mínima segura com código",
    ],
    code: `type Action<T> = { type: string; payload: T };

type State = {
  items: string[];
  selectedId: string | null;
};

function reducer<T>(state: T, action: Action<T>) {
  if (action.type === "reset") return action.payload;
  return state;
}

const initialState: State = { items: [], selectedId: null };
reducer(initialState, { type: "select", payload: { items: ["a"], selectedId: "a" } });
`,
    solution: `### Leitura de Sinais
O reducer trata toda ação como se tivesse o mesmo payload do próprio state.

### Causa Raiz
Um único generic \`T\` para tudo apaga a diferença entre ações distintas. Isso impede o TypeScript de expressar, por exemplo, que uma ação \`select\` deveria carregar apenas um \`selectedId\`, enquanto uma ação \`reset\` talvez carregue o estado inteiro. O resultado é uma API flexível demais e pouco precisa.

### Correção
Modele a família de ações com uma união discriminada:

\`\`\`ts
type Action =
  | { type: "reset"; payload: State }
  | { type: "select"; payload: { selectedId: string | null } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return action.payload;
    case "select":
      return { ...state, selectedId: action.payload.selectedId };
  }
}
\`\`\`

Assim cada ação carrega apenas o payload que realmente faz sentido para ela.
`,
  },
];

function buildQuestion(prompt: string, checklist: [string, string, string]) {
  return `${prompt}\nNa sua resposta, cubra:\n1) ${checklist[0]};\n2) ${checklist[1]};\n3) ${checklist[2]}.`;
}

async function writeChallenge(challenge: ChallengeDefinition) {
  const directory = path.resolve(process.cwd(), "content", "challenges", challenge.category, challenge.slug);
  await mkdir(directory, { recursive: true });

  const challengeJson = {
    id: challenge.id,
    title: challenge.title,
    difficulty: challenge.difficulty,
    recommendedElo: challenge.recommendedElo,
    question: buildQuestion(challenge.prompt, challenge.checklist),
    tags: challenge.tags,
    language: challenge.language,
    type: challenge.type,
    estimatedTime: challenge.estimatedTime,
  };

  await Promise.all([
    writeFile(path.join(directory, "challenge.json"), `${JSON.stringify(challengeJson, null, 2)}\n`, "utf8"),
    writeFile(path.join(directory, "code.tsx"), challenge.code, "utf8"),
    writeFile(path.join(directory, "solution.md"), challenge.solution, "utf8"),
  ]);
}

for (const challenge of challenges) {
  await writeChallenge(challenge);
}

console.log(`Promoted ${challenges.length} wave 2 challenges.`);
