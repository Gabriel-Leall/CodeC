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
    category: "react-rendering",
    slug: "react-memo-002-filtered-list-stale-dependency",
    id: "react-memo-002-filtered-list-stale-dependency",
    title: "Lista Filtrada Memoizada com Dependencia Faltando",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    language: "react",
    estimatedTime: 9,
    type: "debug",
    tags: ["react", "useMemo", "dependencies", "derived-state", "debugging"],
    prompt: "O time diz que a lista filtrada para de reagir quando o texto de busca muda. Explique a causa raiz.",
    checklist: [
      "o erro principal envolvendo dependencia faltando no `useMemo`",
      "como isso congela uma derivacao antiga na interface",
      "a correcao minima segura com codigo",
    ],
    code: `import React, { useMemo, useState } from "react";

type User = { id: string; name: string };

export function Directory({ users }: { users: User[] }) {
  const [query, setQuery] = useState("");

  const visibleUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [users]);

  return (
    <section>
      <input value={query} onChange={event => setQuery(event.target.value)} />
      <ul>
        {visibleUsers.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  );
}
`,
    solution: `### Leitura de Sinais
O filtro depende de \`query\`, mas o memo so observa \`users\`.

### Causa Raiz
Quando o usuario digita, o componente rerenderiza, mas \`visibleUsers\` continua reutilizando o resultado memoizado anterior porque \`query\` nao esta no array de dependencias. Na pratica, a derivacao fica presa a um snapshot antigo da busca.

### Correcao
Inclua todas as entradas reais do calculo nas dependencias:

\`\`\`tsx
const visibleUsers = useMemo(() => {
  return users.filter(user =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );
}, [users, query]);
\`\`\`

Se o filtro for barato, outra alternativa valida e remover o \`useMemo\` completamente.
`,
  },
  {
    category: "typescript-async",
    slug: "ts-async-003-abort-controller-leak",
    id: "ts-async-003-abort-controller-leak",
    title: "AbortController Reutilizado Entre Requisicoes",
    difficulty: "MEDIUM",
    recommendedElo: 1500,
    language: "typescript",
    estimatedTime: 10,
    type: "debug",
    tags: ["typescript", "async", "abort-controller", "fetch", "debugging"],
    prompt: "Explique por que, depois de uma tentativa cancelada, este client pode passar a falhar imediatamente nas proximas requisicoes.",
    checklist: [
      "o erro principal envolvendo reutilizacao de um `AbortController` abortado",
      "como o estado abortado vaza para chamadas futuras",
      "a correcao minima segura com codigo",
    ],
    code: `class SearchClient {
  private controller = new AbortController();

  async search(query: string) {
    const response = await fetch("/api/search?q=" + encodeURIComponent(query), {
      signal: this.controller.signal,
    });

    return response.json();
  }

  cancel() {
    this.controller.abort();
  }
}
`,
    solution: `### Leitura de Sinais
O client guarda um unico \`AbortController\` na instancia inteira.

### Causa Raiz
Depois que \`abort()\` e chamado, o \`signal\` associado permanece abortado para sempre. Como o metodo \`search\` continua reutilizando o mesmo controller, toda chamada futura herda um sinal ja cancelado e pode falhar imediatamente.

### Correcao
Crie um novo controller por requisicao ou recrie-o logo apos cancelar. A opcao mais segura e modelar o ciclo por chamada:

\`\`\`ts
class SearchClient {
  private controller: AbortController | null = null;

  async search(query: string) {
    this.controller = new AbortController();

    const response = await fetch("/api/search?q=" + encodeURIComponent(query), {
      signal: this.controller.signal,
    });

    return response.json();
  }

  cancel() {
    this.controller?.abort();
    this.controller = null;
  }
}
\`\`\`
`,
  },
  {
    category: "typescript-generics",
    slug: "ts-generics-006-api-helper-returns-any",
    id: "ts-generics-006-api-helper-returns-any",
    title: "Helper Generico que Finge Retornar T",
    difficulty: "MEDIUM",
    recommendedElo: 1520,
    language: "typescript",
    estimatedTime: 10,
    type: "debug",
    tags: ["typescript", "generics", "api", "any", "debugging"],
    prompt: "Voce recebeu este helper HTTP em uma revisao. Explique por que o generic parece seguro, mas nao protege nada em runtime nem no contrato real.",
    checklist: [
      "o erro principal envolvendo cast de `any` para um generic decorativo",
      "como isso cria uma falsa seguranca para quem consome a funcao",
      "a correcao minima segura com codigo",
    ],
    code: `async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  return data as T;
}

type User = {
  id: string;
  name: string;
};

async function loadUser() {
  const user = await getJson<User>("/api/user");
  return user.name.toUpperCase();
}
`,
    solution: `### Leitura de Sinais
O helper aceita qualquer \`T\`, mas nao valida nada antes de devolver o valor.

### Causa Raiz
O generic aqui e apenas cosmetico. O retorno real de \`response.json()\` continua sendo desconhecido em runtime, e o cast \`as T\` apenas manda o TypeScript confiar. Isso permite que consumidores acreditem ter um \`User\` valido mesmo quando a API devolve outro shape.

### Correcao
Pare de prometer um \`T\` sem validacao. O caminho minimo seguro e retornar \`unknown\` e validar na borda:

\`\`\`ts
async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}
\`\`\`

Se quiser manter o generic, ele precisa vir junto de um parser ou schema que verifique o dado de verdade.
`,
  },
  {
    category: "typescript-types",
    slug: "ts-types-005-in-operator-on-partial-record",
    id: "ts-types-005-in-operator-on-partial-record",
    title: "Narrowing Enganoso com in em Partial Record",
    difficulty: "MEDIUM",
    recommendedElo: 1460,
    language: "typescript",
    estimatedTime: 8,
    type: "debug",
    tags: ["typescript", "narrowing", "record", "partial", "debugging"],
    prompt: "Explique por que esta checagem com `in` parece garantir um numero, mas ainda permite um valor indefinido escapar.",
    checklist: [
      "o erro principal envolvendo `in` em um `Partial<Record<...>>`",
      "por que a presenca da chave nao garante que o valor seja utilizavel",
      "a correcao minima segura com codigo",
    ],
    code: `type Counters = Partial<Record<"success" | "error", number>>;

function readSuccess(counters: Counters) {
  if ("success" in counters) {
    return counters.success.toFixed(0);
  }

  return "0";
}
`,
    solution: `### Leitura de Sinais
O teste usa \`"success" in counters\` como se isso provasse que \`counters.success\` e um numero valido.

### Causa Raiz
Em um \`Partial<Record<...>>\`, a chave pode existir com valor \`undefined\`. O operador \`in\` so fala sobre presenca da propriedade no objeto, nao sobre o valor armazenado. Entao o codigo ainda pode chamar \`toFixed\` em \`undefined\`.

### Correcao
Valide o valor em si:

\`\`\`ts
function readSuccess(counters: Counters) {
  const success = counters.success;
  return typeof success === "number" ? success.toFixed(0) : "0";
}
\`\`\`

Isso alinha o narrowing com a garantia que o codigo realmente precisa para executar.
`,
  },
];

function buildQuestion(prompt: string, checklist: [string, string, string]) {
  return `${prompt}\nNa sua resposta, cubra:\n1) ${checklist[0]};\n2) ${checklist[1]};\n3) ${checklist[2]}.`;
}

async function writeChallenge(challenge: ChallengeDefinition) {
  const directory = path.resolve(
    process.cwd(),
    "content",
    "challenges",
    challenge.category,
    challenge.slug,
  );
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
    writeFile(
      path.join(directory, "challenge.json"),
      `${JSON.stringify(challengeJson, null, 2)}\n`,
      "utf8",
    ),
    writeFile(path.join(directory, "code.tsx"), challenge.code, "utf8"),
    writeFile(path.join(directory, "solution.md"), challenge.solution, "utf8"),
  ]);
}

for (const challenge of challenges) {
  await writeChallenge(challenge);
}

console.log(`Promoted ${challenges.length} wave 3 challenges.`);
