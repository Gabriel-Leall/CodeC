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
    category: "react-hooks",
    slug: "react-effects-001-stale-closure-interval",
    id: "react-effects-001-stale-closure-interval",
    title: "Contador com Intervalo Preso em Stale Closure",
    difficulty: "EASY",
    recommendedElo: 1300,
    language: "react",
    estimatedTime: 7,
    type: "debug",
    tags: ["react", "hooks", "useEffect", "stale-closure", "debugging"],
    prompt: "Você recebeu este contador em uma revisão técnica. Explique por que ele trava em vez de crescer continuamente.",
    checklist: [
      "o erro principal envolvendo stale closure no `useEffect`",
      "como o bug aparece para o usuário ao longo do tempo",
      "a correção mínima segura com código",
    ],
    code: `import React, { useEffect, useState } from "react";

export function IntervalCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return <p>Count: {count}</p>;
}
`,
    solution: `### Leitura de Sinais
O contador renderiza corretamente no primeiro tick, mas depois para de avançar.

### Causa Raiz
O callback do \`setInterval\` fecha sobre o valor inicial de \`count\`. Como o \`useEffect\` roda só uma vez, o timer continua chamando uma função que sempre conhece \`count = 0\`, então o estado é atualizado repetidamente para \`1\`.

### Correção
Use update funcional para que cada tick leia o valor mais recente do estado:

\`\`\`tsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(current => current + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
\`\`\`

Também seria possível recriar o intervalo quando \`count\` muda, mas isso é mais custoso e menos direto para este caso.
`,
  },
  {
    category: "react-rendering",
    slug: "react-effects-002-object-dependency-loop",
    id: "react-effects-002-object-dependency-loop",
    title: "Busca com Dependência de Objeto Instável",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "useEffect", "dependencies", "rendering", "debugging"],
    prompt: "O time reporta que este componente dispara buscas repetidas mesmo quando o usuário não muda o filtro. Explique a causa raiz.",
    checklist: [
      "o problema principal envolvendo identidade de objeto nas dependências",
      "por que isso causa refetch ou rerender desnecessário",
      "a correção mínima segura com código",
    ],
    code: `import React, { useEffect, useState } from "react";

type Result = { id: string; label: string };

export function SearchPanel({ query }: { query: string }) {
  const [rows, setRows] = useState<Result[]>([]);
  const filters = { query, limit: 10 };

  useEffect(() => {
    fetch("/api/search", {
      method: "POST",
      body: JSON.stringify(filters),
    })
      .then(response => response.json())
      .then(data => setRows(data.items));
  }, [filters]);

  return <p>Resultados: {rows.length}</p>;
}
`,
    solution: `### Leitura de Sinais
O effect depende de \`filters\`, mas \`filters\` é criado de novo a cada render.

### Causa Raiz
Mesmo quando \`query\` não muda, a identidade de \`filters\` muda porque um novo objeto é alocado em cada render. Como o array de dependências compara por referência, o \`useEffect\` entende que a dependência mudou e dispara uma nova busca.

### Correção
Existem duas soluções seguras:

1. Derivar o objeto dentro do effect e depender apenas de \`query\`
2. Memoizar \`filters\`

Patch mínimo:

\`\`\`tsx
useEffect(() => {
  const filters = { query, limit: 10 };

  fetch("/api/search", {
    method: "POST",
    body: JSON.stringify(filters),
  })
    .then(response => response.json())
    .then(data => setRows(data.items));
}, [query]);
\`\`\`
`,
  },
  {
    category: "react-hooks",
    slug: "react-effects-005-event-listener-stale-prop",
    id: "react-effects-005-event-listener-stale-prop",
    title: "Listener Global Preso em Prop Antiga",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "hooks", "event-listener", "stale-closure", "debugging"],
    prompt: "Explique por que este atalho global pode continuar executando mesmo depois de a flag de habilitação mudar.",
    checklist: [
      "o problema principal envolvendo closure antiga no listener registrado",
      "como isso se manifesta para o usuário",
      "a correção mínima segura com código",
    ],
    code: `import React, { useEffect } from "react";

export function SaveHotkey({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s" && enabled) {
        event.preventDefault();
        console.log("saving");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
`,
    solution: `### Leitura de Sinais
O listener é instalado uma única vez e fecha sobre o valor inicial de \`enabled\`.

### Causa Raiz
Como o effect não depende de \`enabled\`, o navegador continua chamando um handler que foi criado no primeiro render. Se \`enabled\` era \`true\` naquele momento, o atalho pode continuar funcionando mesmo depois de a UI desabilitá-lo; se era \`false\`, o atalho nunca passa a funcionar.

### Correção
Renove o listener quando \`enabled\` muda, ou use uma ref para manter o valor atual.

Correção mínima:

\`\`\`tsx
useEffect(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s" && enabled) {
      event.preventDefault();
      console.log("saving");
    }
  };

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}, [enabled]);
\`\`\`
`,
  },
  {
    category: "react-state",
    slug: "react-async-001-fetch-out-of-order",
    id: "react-async-001-fetch-out-of-order",
    title: "Perfil Sobrescrito por Resposta Fora de Ordem",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "async", "race-condition", "data-fetching", "debugging"],
    prompt: "O time diz que, ao trocar rapidamente de usuário, esta tela às vezes mostra o perfil errado. Explique por quê.",
    checklist: [
      "o bug principal de concorrência entre requisições",
      "como a resposta errada chega a sobrescrever o estado correto",
      "uma correção mínima segura com código",
    ],
    code: `import React, { useEffect, useState } from "react";

type User = { id: string; name: string };

export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/users/" + userId)
      .then(response => response.json())
      .then(data => setUser(data));
  }, [userId]);

  return <p>{user ? user.name : "Loading..."}</p>;
}
`,
    solution: `### Leitura de Sinais
O effect dispara uma nova request sempre que \`userId\` muda, mas não controla qual resposta ainda é válida.

### Causa Raiz
Duas ou mais requests podem ficar em voo ao mesmo tempo. Se o usuário muda de \`userId\` rapidamente, a request antiga pode terminar depois da mais nova. Nesse caso, o callback da request antiga ainda chama \`setUser\` e sobrescreve o estado atual com dados obsoletos.

### Correção
Ignore respostas stale usando uma flag local ou um token por request. Um patch mínimo:

\`\`\`tsx
useEffect(() => {
  let active = true;

  fetch("/api/users/" + userId)
    .then(response => response.json())
    .then(data => {
      if (active) setUser(data);
    });

  return () => {
    active = false;
  };
}, [userId]);
\`\`\`
`,
  },
  {
    category: "react-state",
    slug: "react-async-003-loading-flag-shared-between-requests",
    id: "react-async-003-loading-flag-shared-between-requests",
    title: "Loading Único para Requisições Concorrentes",
    difficulty: "MEDIUM",
    recommendedElo: 1510,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "async", "loading-state", "race-condition", "debugging"],
    prompt: "Explique por que esta tela pode esconder o indicador de loading cedo demais quando várias atualizações acontecem quase juntas.",
    checklist: [
      "o problema principal de modelagem do loading",
      "como uma request pode desligar o loading da outra",
      "uma correção mínima segura com código",
    ],
    code: `import React, { useState } from "react";

export function RefreshPanel() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  async function refresh(sectionId: string) {
    setLoading(true);
    const result = await fetch("/api/sections/" + sectionId).then(response => response.text());
    setLogs(current => [...current, result]);
    setLoading(false);
  }

  return (
    <div>
      <button onClick={() => refresh("a")}>Atualizar A</button>
      <button onClick={() => refresh("b")}>Atualizar B</button>
      {loading ? <p>Carregando...</p> : null}
    </div>
  );
}
`,
    solution: `### Leitura de Sinais
Há uma única flag booleana para representar qualquer request em andamento.

### Causa Raiz
Se duas chamadas a \`refresh\` são iniciadas, ambas ligam \`loading\`. Quando a primeira termina, ela executa \`setLoading(false)\` mesmo que a segunda ainda esteja em voo. O usuário vê o loading sumir cedo demais, embora ainda exista trabalho pendente.

### Correção
Modele concorrência de forma mais rica, por exemplo com contador de requests ativas:

\`\`\`tsx
const [pendingCount, setPendingCount] = useState(0);

async function refresh(sectionId: string) {
  setPendingCount(count => count + 1);
  try {
    const result = await fetch("/api/sections/" + sectionId).then(response => response.text());
    setLogs(current => [...current, result]);
  } finally {
    setPendingCount(count => count - 1);
  }
}
\`\`\`

E o loading passa a ser \`pendingCount > 0\`.
`,
  },
  {
    category: "react-state",
    slug: "react-state-001-nested-state-mutation",
    id: "react-state-001-nested-state-mutation",
    title: "Mutação Direta em Estado Aninhado",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "state", "mutation", "rendering", "debugging"],
    prompt: "Explique por que esta atualização pode falhar em refletir a mudança na interface.",
    checklist: [
      "o problema principal envolvendo mutação direta do estado anterior",
      "por que isso conflita com o modelo de renderização do React",
      "a correção mínima segura com código",
    ],
    code: `import React, { useState } from "react";

type Profile = {
  name: string;
  prefs: {
    compact: boolean;
  };
};

export function ProfileSettings() {
  const [profile, setProfile] = useState<Profile>({
    name: "Ana",
    prefs: { compact: false },
  });

  const enableCompact = () => {
    profile.prefs.compact = true;
    setProfile(profile);
  };

  return (
    <div>
      <button onClick={enableCompact}>Compactar</button>
      <p>{profile.prefs.compact ? "Compacto" : "Normal"}</p>
    </div>
  );
}
`,
    solution: `### Leitura de Sinais
O código altera o objeto de estado existente e depois o envia de volta ao \`setProfile\`.

### Causa Raiz
React espera uma nova referência para detectar claramente uma atualização. Aqui o código muta \`profile.prefs.compact\` diretamente e reaproveita a mesma referência de \`profile\`. Além de poder falhar em disparar o rerender esperado, isso contamina o snapshot anterior do estado.

### Correção
Atualize o estado de forma imutável:

\`\`\`tsx
const enableCompact = () => {
  setProfile(current => ({
    ...current,
    prefs: {
      ...current.prefs,
      compact: true,
    },
  }));
};
\`\`\`
`,
  },
  {
    category: "react-rendering",
    slug: "react-state-003-key-instability-on-reorder",
    id: "react-state-003-key-instability-on-reorder",
    title: "Lista Reordenável com Key Instável",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "rendering", "keys", "lists", "debugging"],
    prompt: "Explique por que esta lista pode misturar estados visuais entre linhas depois da reordenação.",
    checklist: [
      "o problema principal envolvendo identidade de item e uso do índice como key",
      "como isso afeta a reconciliação do React",
      "a correção mínima segura com código",
    ],
    code: `import React, { useState } from "react";

type Player = { id: string; name: string };

function PlayerRow({ player }: { player: Player }) {
  const [selected, setSelected] = useState(false);
  return (
    <li onClick={() => setSelected(value => !value)}>
      {player.name} {selected ? "(selecionado)" : ""}
    </li>
  );
}

export function Ranking() {
  const [players, setPlayers] = useState<Player[]>([
    { id: "p1", name: "Ana" },
    { id: "p2", name: "Bia" },
  ]);

  const reverse = () => setPlayers(current => [...current].reverse());

  return (
    <div>
      <button onClick={reverse}>Inverter</button>
      <ul>{players.map((player, index) => <PlayerRow key={index} player={player} />)}</ul>
    </div>
  );
}
`,
    solution: `### Leitura de Sinais
Cada linha possui estado local (\`selected\`) e a lista usa o índice como \`key\`.

### Causa Raiz
Quando a ordem muda, os índices mudam junto. O React passa a reutilizar instâncias de \`PlayerRow\` com base no índice, não na identidade real do jogador. O resultado é que o estado local pode “grudar” na linha errada após a reordenação.

### Correção
Use uma key estável de domínio:

\`\`\`tsx
<ul>{players.map(player => <PlayerRow key={player.id} player={player} />)}</ul>
\`\`\`

Assim a reconciliação acompanha a identidade correta de cada item.
`,
  },
  {
    category: "react-rendering",
    slug: "react-memo-001-usememo-side-effect",
    id: "react-memo-001-usememo-side-effect",
    title: "useMemo com Efeito Colateral Embutido",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "useMemo", "side-effects", "rendering", "debugging"],
    prompt: "Explique por que este uso de `useMemo` é tecnicamente inadequado, mesmo que o cálculo do total pareça correto.",
    checklist: [
      "o erro principal envolvendo mistura de memoização com efeito colateral",
      "qual contrato do hook está sendo violado ou abusado",
      "a correção mínima segura com código",
    ],
    code: `import React, { useMemo } from "react";

type Item = { price: number };

export function CartSummary({ items }: { items: Item[] }) {
  const total = useMemo(() => {
    analytics.track("cart-recalculated", { size: items.length });
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <p>Total: {total}</p>;
}
`,
    solution: `### Leitura de Sinais
O cálculo de \`total\` é puro, mas o callback de \`useMemo\` também dispara \`analytics.track\`.

### Causa Raiz
\`useMemo\` existe para memoizar um valor derivado. O callback deveria ser puro, porque o React pode recalculá-lo em momentos que não foram pensados como “eventos de negócio”. Colocar tracking ali mistura cálculo e side effect em um hook cujo contrato principal não é efeito colateral.

### Correção
Separe as responsabilidades:

\`\`\`tsx
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

useEffect(() => {
  analytics.track("cart-recalculated", { size: items.length });
}, [items.length]);
\`\`\`

Assim o valor memoizado continua puro e o tracking fica em um lugar semanticamente correto.
`,
  },
  {
    category: "react-interview/easy",
    slug: "react-contracts-001-controlled-uncontrolled-input",
    id: "react-contracts-001-controlled-uncontrolled-input",
    title: "Input Alternando entre Controlado e Não Controlado",
    difficulty: "EASY",
    recommendedElo: 1450,
    language: "react",
    estimatedTime: 8,
    type: "debug",
    tags: ["interview", "react", "forms", "controlled", "debugging"],
    prompt: "Você recebeu este input em uma entrevista técnica. Explique por que ele pode alternar entre dois contratos de formulário ao longo da vida do componente.",
    checklist: [
      "o problema principal envolvendo input controlado e não controlado",
      "como isso aparece como warning ou comportamento estranho",
      "a correção mínima segura com código",
    ],
    code: `import React, { useEffect, useState } from "react";

export function NameField() {
  const [value, setValue] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch("/api/profile")
      .then(response => response.json())
      .then(data => setValue(data.name));
  }, []);

  return <input value={value} onChange={event => setValue(event.target.value)} />;
}
`,
    solution: `### Leitura de Sinais
No primeiro render, \`value\` está como \`undefined\`. Depois do fetch, passa a ser string.

### Causa Raiz
Quando \`value\` é \`undefined\`, o input nasce como não controlado. Depois que o fetch termina, o componente passa a fornecer um valor explícito e o input se torna controlado. Essa troca de contrato no meio do ciclo de vida gera warning e comportamento imprevisível.

### Correção
Escolha um contrato único desde o início. O patch mínimo é começar com string vazia:

\`\`\`tsx
const [value, setValue] = useState(\"\");
\`\`\`

Assim o campo já nasce controlado e continua controlado depois da hidratação.
`,
  },
  {
    category: "typescript-types",
    slug: "ts-types-003-user-defined-type-guard-lie",
    id: "ts-types-003-user-defined-type-guard-lie",
    title: "Type Guard que Promete Mais do que Prova",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    language: "typescript",
    estimatedTime: 9,
    type: "debug",
    tags: ["typescript", "type-guard", "runtime", "debugging"],
    prompt: "Explique por que este type guard parece elegante, mas entrega uma falsa sensação de segurança para o restante do código.",
    checklist: [
      "o erro principal envolvendo a promessa feita ao compilador",
      "por que a checagem atual é insuficiente em runtime",
      "a correção mínima segura com código",
    ],
    code: `type LoadedUser = { id: string; ready: true };

function isLoadedUser(value: unknown): value is LoadedUser {
  return Boolean(value);
}

function renderUser(value: unknown) {
  if (!isLoadedUser(value)) return "empty";
  return value.id.toUpperCase();
}
`,
    solution: `### Leitura de Sinais
O predicado diz ao compilador que, depois da verificação, \`value\` tem a forma completa de \`LoadedUser\`.

### Causa Raiz
Em runtime, a função apenas checa se o valor é truthy. Isso não prova a existência de \`id\`, nem que \`ready\` seja \`true\`. O resultado é um contrato mentiroso: o compilador confia, mas o programa pode falhar depois.

### Correção
O predicado precisa validar a estrutura que promete:

\`\`\`ts
function isLoadedUser(value: unknown): value is LoadedUser {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as { id: unknown }).id === "string" &&
    "ready" in value &&
    (value as { ready: unknown }).ready === true
  );
}
\`\`\`

Se a checagem completa não fizer sentido, o melhor é não usar type guard com contrato tão forte.
`,
  },
  {
    category: "typescript-architecture",
    slug: "ts-arch-003-overload-contract-drift",
    id: "ts-arch-003-overload-contract-drift",
    title: "Overload Incoerente com a Implementação",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    language: "typescript",
    estimatedTime: 9,
    type: "debug",
    tags: ["typescript", "overload", "contracts", "debugging"],
    prompt: "Explique por que estes overloads prometem um contrato que o corpo da função não cumpre.",
    checklist: [
      "o erro principal envolvendo drift entre overload e implementação",
      "qual o risco técnico para quem consome a API",
      "a correção mínima segura com código",
    ],
    code: `function parseValue(value: string): number;
function parseValue(value: number): string;
function parseValue(value: string | number) {
  return value;
}

const points = parseValue("42");
const label = parseValue(42);
`,
    solution: `### Leitura de Sinais
Os overloads dizem que string vira number e number vira string.

### Causa Raiz
O corpo real da função não implementa essa transformação. Ele apenas devolve o valor recebido. Isso cria um descolamento entre o contrato público e o comportamento efetivo: o compilador aceita usos baseados em um comportamento que o runtime não entrega.

### Correção
Ou os overloads mudam, ou o corpo muda. Se a intenção é realmente converter:

\`\`\`ts
function parseValue(value: string): number;
function parseValue(value: number): string;
function parseValue(value: string | number) {
  return typeof value === "string" ? Number(value) : String(value);
}
\`\`\`

Se a intenção era “ecoar” o valor, então os overloads deveriam refletir isso, em vez de mentir para o consumidor.
`,
  },
  {
    category: "typescript-state",
    slug: "ts-state-001-shallow-copy-nested-state",
    id: "ts-state-001-shallow-copy-nested-state",
    title: "Cópia Rasa com Estado Aninhado Compartilhado",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    language: "typescript",
    estimatedTime: 9,
    type: "debug",
    tags: ["typescript", "state", "immutability", "debugging"],
    prompt: "Explique por que esta função parece criar um novo estado, mas ainda permite mutação retroativa do valor anterior.",
    checklist: [
      "o problema principal envolvendo cópia rasa de objeto aninhado",
      "como o estado antigo continua sendo afetado",
      "a correção mínima segura com código",
    ],
    code: `type Preferences = {
  theme: {
    contrast: "low" | "high";
  };
};

function enableHighContrast(state: Preferences) {
  const next = { ...state };
  next.theme.contrast = "high";
  return next;
}
`,
    solution: `### Leitura de Sinais
O código cria \`next\` com spread, o que dá a impressão de imutabilidade.

### Causa Raiz
O spread copia apenas o primeiro nível do objeto. A propriedade \`theme\` continua apontando para o mesmo objeto interno tanto em \`state\` quanto em \`next\`. Quando o código faz \`next.theme.contrast = "high"\`, ele está mutando também a estrutura interna do estado anterior.

### Correção
Copie também o nível aninhado que será alterado:

\`\`\`ts
function enableHighContrast(state: Preferences) {
  return {
    ...state,
    theme: {
      ...state.theme,
      contrast: "high",
    },
  };
}
\`\`\`

Assim o novo estado ganha uma nova referência externa e interna para a parte alterada.
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

console.log(`Promoted ${challenges.length} wave 1 challenges.`);
