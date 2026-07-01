import type {
  QuestionBankChallengeType,
  QuestionBankDifficulty,
  QuestionBankSeed,
} from "./question-bank";

type SeedRow = {
  id: string;
  title: string;
  challengeType: QuestionBankChallengeType;
  difficulty: QuestionBankDifficulty;
  recommendedElo: number;
  tags: string[];
  mainPrompt: string;
  miniSnippet: string;
  expectedAnswerSummary: string;
  expansionNotes: string;
};

const checklistByType: Record<QuestionBankChallengeType, [string, string, string]> = {
  debug: [
    "Identificar a causa raiz no snippet",
    "Explicar o impacto observavel para o usuario ou para o sistema",
    "Propor a correcao minima segura com justificativa",
  ],
  "explain-code": [
    "Descrever o que o codigo esta tentando fazer",
    "Explicar onde o contrato do codigo termina ou fica fragil",
    "Apontar trade-offs, limites ou riscos da abordagem",
  ],
  "explain-concept": [
    "Definir o conceito usando o snippet como base",
    "Explicar por que esse conceito importa na pratica",
    "Conectar o conceito a uma decisao de modelagem ou manutencao",
  ],
};

const estimatedTimeByDifficulty: Record<QuestionBankDifficulty, number> = {
  EASY: 7,
  MEDIUM: 9,
  HARD: 12,
};

function buildTheme(language: QuestionBankSeed["language"], theme: string, rows: SeedRow[]): QuestionBankSeed[] {
  return rows.map(row => ({
    ...row,
    language,
    theme,
    estimatedTime: estimatedTimeByDifficulty[row.difficulty],
    coverageChecklist: checklistByType[row.challengeType],
  }));
}

const typescriptAsyncAndConcurrency = buildTheme("typescript", "async-and-concurrency", [
  {
    id: "ts-async-001-race-guard-after-await",
    title: "Guarda temporal perdida apos await",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    tags: ["typescript", "async", "race-condition"],
    mainPrompt: "Explique por que a guarda inicial nao torna este fluxo seguro ate o final.",
    miniSnippet: `type Draft = { status: "open" | "closed"; items: string[] };

async function persistDraft(draft?: Draft) {
  if (!draft || draft.status === "closed") return;
  await Promise.resolve();
  return draft.items[0].toUpperCase();
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o await abre uma janela temporal; o objeto pode mudar antes do uso final. Snapshot ou revalidacao apos o await fecham o buraco.",
    expansionNotes: "Pode crescer para save otimista com edicao concorrente.",
  },
  {
    id: "ts-async-002-promise-all-partial-failure",
    title: "Falha parcial em Promise.all",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1420,
    tags: ["typescript", "promise-all", "error-handling"],
    mainPrompt: "Explique o que essa funcao realmente garante quando uma das promessas falha.",
    miniSnippet: `async function syncWidgets(ids: string[]) {
  return Promise.all(ids.map(id => syncWidget(id)));
}`,
    expectedAnswerSummary: "A resposta deve separar falha do chamador de cancelamento real das tarefas irmas. Promise.all rejeita cedo, mas nao desfaz side effects ja iniciados.",
    expansionNotes: "Pode virar caso maior com compensacao e rollback.",
  },
  {
    id: "ts-async-003-abort-controller-leak",
    title: "AbortController compartilhado",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1500,
    tags: ["typescript", "abort-controller", "fetch"],
    mainPrompt: "Explique por que este helper pode cancelar requisicoes novas por engano.",
    miniSnippet: `const controller = new AbortController();

export async function loadReport(url: string) {
  return fetch(url, { signal: controller.signal });
}

export function cancelReport() {
  controller.abort();
}`,
    expectedAnswerSummary: "A resposta deve apontar que o controller global atravessa chamadas e pode permanecer abortado. Cada execucao ou cada instancia precisa do proprio signal.",
    expansionNotes: "Pode crescer para client de API com timeout e retry.",
  },
  {
    id: "ts-async-004-retry-with-shared-state",
    title: "Retry com estado mutavel compartilhado",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1520,
    tags: ["typescript", "retry", "mutable-state"],
    mainPrompt: "Explique por que este retry mistura controle de tentativas com estado de dominio.",
    miniSnippet: `async function retrySend(job: { attempts: number; payload: string }) {
  job.attempts++;
  try {
    return await send(job.payload);
  } catch {
    if (job.attempts < 3) return retrySend(job);
    throw new Error("failed");
  }
}`,
    expectedAnswerSummary: "A resposta deve mostrar que as tentativas reutilizam e mutam o mesmo objeto, o que polui log, auditoria e raciocinio. Contador separado ou snapshot tornam o fluxo mais honesto.",
    expansionNotes: "Pode crescer para fila com backoff.",
  },
  {
    id: "ts-async-005-queue-flush-order",
    title: "Fila serial simplificada",
    challengeType: "explain-code",
    difficulty: "EASY",
    recommendedElo: 1280,
    tags: ["typescript", "queue", "microtask"],
    mainPrompt: "Explique quais garantias de ordem esta fila realmente oferece.",
    miniSnippet: `let current = Promise.resolve();

export function enqueue(task: () => Promise<void>) {
  current = current.then(task);
  return current;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que a fila serializa o encadeamento, mas erros podem quebrar a esteira se nao forem tratados, e nao ha durabilidade nenhuma.",
    expansionNotes: "Pode crescer para executor com recovery por tarefa.",
  },
  {
    id: "ts-async-006-timeout-race-concept",
    title: "Race entre timeout e operacao",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1460,
    tags: ["typescript", "promise-race", "timeout"],
    mainPrompt: "Usando o snippet, explique por que Promise.race nao cancela sozinho o trabalho perdedor.",
    miniSnippet: `function withTimeout(work: Promise<unknown>, ms: number) {
  return Promise.race([
    work,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}`,
    expectedAnswerSummary: "A resposta deve separar resultado da interface e ciclo de vida real das tarefas. O perdedor continua vivo sem protocolo cooperativo de cancelamento.",
    expansionNotes: "Pode crescer para fetch com AbortController.",
  },
  {
    id: "ts-async-007-stale-cache-write",
    title: "Stale write em cache",
    challengeType: "debug",
    difficulty: "HARD",
    recommendedElo: 1680,
    tags: ["typescript", "cache", "stale-write"],
    mainPrompt: "Explique como uma resposta lenta pode sobrescrever um valor mais novo no cache.",
    miniSnippet: `const cache = new Map<string, string>();

async function refreshUser(id: string) {
  const value = await fetchUser(id);
  cache.set(id, value);
}`,
    expectedAnswerSummary: "A resposta deve apontar que ordem de disparo e ordem de conclusao divergem. Sem versao, token ou compare-and-set, uma resposta antiga pode vencer no armazenamento.",
    expansionNotes: "Pode crescer para UI concorrente e optimistic update.",
  },
  {
    id: "ts-async-008-batched-side-effects",
    title: "Lote com side effects fora de ordem",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1510,
    tags: ["typescript", "batch", "side-effects"],
    mainPrompt: "Explique por que este lote nao garante a ordem global que o time talvez suponha.",
    miniSnippet: `async function processAll(ids: string[]) {
  await Promise.all(ids.map(async id => {
    await persist(id);
    audit(id);
  }));
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o audit dispara por ordem de conclusao de cada item, nao pela ordem do array. Se a auditoria exigir ordem global, o desenho esta errado.",
    expansionNotes: "Pode crescer para pipeline com etapas separadas.",
  },
  {
    id: "ts-async-009-fire-and-forget-audit",
    title: "Fire-and-forget em auditoria",
    challengeType: "explain-code",
    difficulty: "EASY",
    recommendedElo: 1260,
    tags: ["typescript", "fire-and-forget", "observability"],
    mainPrompt: "Explique o que esta funcao esta assumindo ao ignorar a promise de auditoria.",
    miniSnippet: `export function saveAndAudit(record: string) {
  void auditAsync(record);
  return persist(record);
}`,
    expectedAnswerSummary: "A resposta deve explicar que o efeito colateral pode falhar silenciosamente ou morrer no shutdown. void comunica intencao, mas nao cria confiabilidade.",
    expansionNotes: "Pode crescer para fila de auditoria.",
  },
  {
    id: "ts-async-010-semaphore-fairness",
    title: "Fairness em semaforo caseiro",
    challengeType: "explain-concept",
    difficulty: "HARD",
    recommendedElo: 1720,
    tags: ["typescript", "semaphore", "fairness"],
    mainPrompt: "Explique por que limitar concorrencia nao implica justica entre tarefas.",
    miniSnippet: `class Semaphore {
  private active = 0;
  constructor(private readonly limit: number) {}

  async run<T>(task: () => Promise<T>) {
    while (this.active >= this.limit) await Promise.resolve();
    this.active++;
    try {
      return await task();
    } finally {
      this.active--;
    }
  }
}`,
    expectedAnswerSummary: "A resposta deve definir fairness e mostrar que polling nao estabelece fila justa. Algumas tarefas podem ser continuamente ultrapassadas.",
    expansionNotes: "Pode crescer para fila FIFO real.",
  },
]);

const typescriptTypesAndNarrowing = buildTheme("typescript", "types-and-narrowing", [
  {
    id: "ts-types-001-optional-alias-lost-after-mutation",
    title: "Alias invalida narrowing",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1440,
    tags: ["typescript", "narrowing", "aliasing"],
    mainPrompt: "Explique por que este narrowing nao continua valido apos a mutacao por outro alias.",
    miniSnippet: `type Session = { user?: { name: string } };

function greet(session: Session) {
  if (!session.user) return;
  const same = session;
  same.user = undefined;
  return session.user.name;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o narrowing foi invalidado por mutacao do mesmo objeto atraves de outro alias. Snapshot da propriedade ou imutabilidade resolvem melhor.",
    expansionNotes: "Pode crescer para contextos mutaveis por referencia.",
  },
  {
    id: "ts-types-002-discriminated-union-exhaustiveness",
    title: "Exhaustividade em uniao discriminada",
    challengeType: "explain-code",
    difficulty: "EASY",
    recommendedElo: 1250,
    tags: ["typescript", "union", "never"],
    mainPrompt: "Explique o papel do branch com never neste switch.",
    miniSnippet: `type Result =
  | { kind: "ok"; value: string }
  | { kind: "error"; message: string };

function label(result: Result) {
  switch (result.kind) {
    case "ok":
      return result.value;
    case "error":
      return result.message;
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}`,
    expectedAnswerSummary: "A resposta deve explicar como o discriminante permite narrowing preciso e como never vira alarme de manutencao quando novos casos entram no dominio.",
    expansionNotes: "Pode crescer para status de treino ou pagamento.",
  },
  {
    id: "ts-types-003-user-defined-type-guard-lie",
    title: "Type guard que mente",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    tags: ["typescript", "type-guard", "runtime"],
    mainPrompt: "Explique por que este type guard e perigoso mesmo deixando o codigo mais elegante.",
    miniSnippet: `function isLoaded(value: unknown): value is { id: string; ready: true } {
  return Boolean(value);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o predicado promete demais ao compilador e prova de menos em runtime. Validacao frouxa gera falsa seguranca.",
    expansionNotes: "Pode crescer para parsers e schema validation.",
  },
  {
    id: "ts-types-004-satisfies-vs-as",
    title: "satisfies versus as",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1410,
    tags: ["typescript", "satisfies", "as", "inference"],
    mainPrompt: "Explique a diferenca entre satisfies e as usando este exemplo.",
    miniSnippet: `const config = {
  mode: "strict",
  retries: 3,
} satisfies Record<string, string | number>;

const unsafe = {
  mode: "strict",
  retries: 3,
} as Record<string, string | number>;
`,
    expectedAnswerSummary: "A resposta deve mostrar que satisfies checa compatibilidade sem perder inferencia precisa do valor original, enquanto as apenas força uma visao possivelmente enganosa.",
    expansionNotes: "Pode crescer para config e design tokens.",
  },
  {
    id: "ts-types-005-in-operator-on-partial-record",
    title: "in em Record parcial",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1460,
    tags: ["typescript", "in-operator", "record"],
    mainPrompt: "Explique por que a existencia da chave ainda nao garante um valor utilizavel.",
    miniSnippet: `function render(map: Partial<Record<string, string>>, key: string) {
  if (key in map) {
    return map[key].toUpperCase();
  }
}`,
    expectedAnswerSummary: "A resposta deve mostrar que in prova presenca da propriedade, nao valor definido. O contrato do tipo continua permitindo undefined.",
    expansionNotes: "Pode crescer para dados hidratados do servidor.",
  },
  {
    id: "ts-types-006-never-hidden-by-default",
    title: "Default escondendo falta de exaustividade",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1430,
    tags: ["typescript", "switch", "never"],
    mainPrompt: "Explique por que este default enfraquece a manutencao do switch.",
    miniSnippet: `type Status = "draft" | "published";

function badge(status: Status) {
  switch (status) {
    case "draft":
      return "D";
    default:
      return "P";
  }
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o default absorve novos casos silenciosamente e tira do compilador o papel de avisar sobre evolucao incompleta do dominio.",
    expansionNotes: "Pode crescer para status de challenge.",
  },
  {
    id: "ts-types-007-nullable-generic-callback",
    title: "Generic com null escondido no callback",
    challengeType: "debug",
    difficulty: "HARD",
    recommendedElo: 1650,
    tags: ["typescript", "generic", "nullability"],
    mainPrompt: "Explique onde esta API embaralha a responsabilidade entre chamador e callback.",
    miniSnippet: `function mapLoaded<T>(value: T | null, project: (input: T) => string) {
  return value ? project(value) : null;
}`,
    expectedAnswerSummary: "A resposta deve discutir coerencia de retorno, nullability e como a API mistura mapa e branching. Talvez precise de outro nome ou outra forma.",
    expansionNotes: "Pode crescer para helpers de loaders.",
  },
  {
    id: "ts-types-008-filter-boolean-narrowing",
    title: "filter(Boolean) e narrowing",
    challengeType: "explain-concept",
    difficulty: "EASY",
    recommendedElo: 1290,
    tags: ["typescript", "array-filter", "narrowing"],
    mainPrompt: "Explique quando filter(Boolean) limpa dados em runtime sem comunicar o tipo desejado ao compilador.",
    miniSnippet: `const raw: Array<string | undefined> = ["a", undefined, "b"];
const cleaned = raw.filter(Boolean);`,
    expectedAnswerSummary: "A resposta deve separar limpeza em runtime e type guard formal. Em varios contextos o compilador continua sem o narrowing ideal.",
    expansionNotes: "Pode crescer para pipelines de normalizacao.",
  },
  {
    id: "ts-types-009-readonly-tuple-indexing",
    title: "Tuple readonly como contrato",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1400,
    tags: ["typescript", "tuple", "readonly"],
    mainPrompt: "Explique o que este tipo comunica melhor do que um array comum.",
    miniSnippet: `type Range = readonly [start: number, end: number];

function renderRange(range: Range) {
  return String(range[0]) + "-" + String(range[1]);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que tuple readonly comunica aridade fixa, semantica posicional e fronteira imutavel. Isso melhora legibilidade e manutencao.",
    expansionNotes: "Pode crescer para coordenadas e intervalos.",
  },
  {
    id: "ts-types-010-assert-function-contract",
    title: "Assert function com contrato fraco",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    tags: ["typescript", "asserts", "contract"],
    mainPrompt: "Explique por que esta assert function e mais perigosa do que parece.",
    miniSnippet: `function assertHasId(value: unknown): asserts value is { id: string } {
  if (!value) throw new Error("missing value");
}`,
    expectedAnswerSummary: "A resposta deve mostrar que asserts muda o fluxo de tipos de forma forte; se a checagem nao prova a existencia de id, o contrato mente para todo o codigo seguinte.",
    expansionNotes: "Pode crescer para helpers de parsing.",
  },
]);

const typescriptGenericsAndInference = buildTheme("typescript", "generics-and-inference", [
  {
    id: "ts-generics-001-generic-constraint-too-wide",
    title: "Constraint generico largo demais",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    tags: ["typescript", "generics", "constraint"],
    mainPrompt: "Explique por que este helper aceita entradas demais e depois compensa com cast.",
    miniSnippet: `function firstId<T extends object>(items: T[]) {
  return items[0] && (items[0] as { id: string }).id;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o constraint quase nao comunica nada util. Se a funcao precisa de id, isso deveria aparecer no contrato do tipo.",
    expansionNotes: "Pode crescer para repositorios e selects.",
  },
  {
    id: "ts-generics-002-infer-lost-in-wrapper",
    title: "Inferencia perdida em wrapper",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1440,
    tags: ["typescript", "generics", "inference", "wrapper"],
    mainPrompt: "Explique por que este wrapper apaga parte importante da assinatura do callback.",
    miniSnippet: `function withLog(fn: (...args: any[]) => any) {
  return (...args: any[]) => {
    console.log(args);
    return fn(...args);
  };
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o wrapper perde relacao entre parametros e retorno. Generic sobre args e retorno preservaria melhor a API original.",
    expansionNotes: "Pode crescer para decorators e adapters.",
  },
  {
    id: "ts-generics-003-default-generic-masks-bug",
    title: "Default generico mascara erro",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1500,
    tags: ["typescript", "default-generic", "api-design"],
    mainPrompt: "Explique como o generic default aqui torna a API mais permissiva do que deveria.",
    miniSnippet: `function pick<T = string>(value: T, key?: keyof T) {
  return key ? value[key] : value;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que defaults podem esconder falta de especificacao real e gerar inferencia surpreendente. Talvez a API precise de overloads mais honestos.",
    expansionNotes: "Pode crescer para utilitarios de forms.",
  },
  {
    id: "ts-generics-004-mapped-type-key-remap",
    title: "Prefixando chaves em mapped type",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1420,
    tags: ["typescript", "mapped-types", "template-literal-types"],
    mainPrompt: "Explique como esse mapped type renomeia chaves e por que esse tipo de transformacao e util.",
    miniSnippet: `type PrefixKeys<T> = {
  [K in keyof T as \`prefix_\${string & K}\`]: T[K];
};`,
    expectedAnswerSummary: "A resposta deve explicar que o mapped type reaproveita os valores de T enquanto cria novas chaves com prefixo. Em producao isso ajuda em adapters, payloads serializados e contratos derivados.",
    expansionNotes: "Pode crescer para serializacao, clients e nomes derivados por convencao.",
  },
  {
    id: "ts-generics-005-conditional-type-distribution",
    title: "Distribuicao de conditional type",
    challengeType: "explain-code",
    difficulty: "HARD",
    recommendedElo: 1660,
    tags: ["typescript", "conditional-types", "distribution"],
    mainPrompt: "Explique o que este tipo calcula quando recebe uma uniao e por que isso surpreende.",
    miniSnippet: `type Boxed<T> = T extends string ? { value: T } : never;
type Result = Boxed<"a" | "b">;`,
    expectedAnswerSummary: "A resposta deve explicar distribuicao sobre unioes nuas e como embrulhar em tupla evita essa distribuicao quando ela nao e desejada.",
    expansionNotes: "Pode crescer para transformacoes de schema.",
  },
  {
    id: "ts-generics-006-api-helper-returns-any",
    title: "Generic declarativo com any escondido",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1510,
    tags: ["typescript", "any", "generics", "api"],
    mainPrompt: "Explique por que este helper parece tipado, mas devolve pouca seguranca real.",
    miniSnippet: `async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as any;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o generic apenas ecoa a expectativa do chamador sem validacao nenhuma. Parser real ou retorno mais honesto melhoram o contrato.",
    expansionNotes: "Pode crescer para borda HTTP do produto.",
  },
  {
    id: "ts-generics-007-overload-vs-generic",
    title: "Overload versus generic",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1430,
    tags: ["typescript", "overload", "generics"],
    mainPrompt: "Explique quando overload comunica melhor a API do que um generic muito esperto.",
    miniSnippet: `function format(value: Date): string;
function format(value: number): string;
function format(value: Date | number) {
  return String(value);
}`,
    expectedAnswerSummary: "A resposta deve distinguir familias finitas de chamadas de relacoes parametricas reais entre entrada e saida.",
    expansionNotes: "Pode crescer para helpers compartilhados.",
  },
  {
    id: "ts-generics-008-generic-reducer-action-payload",
    title: "Reducer generico enfraquece payload",
    challengeType: "debug",
    difficulty: "HARD",
    recommendedElo: 1670,
    tags: ["typescript", "reducer", "actions", "generics"],
    mainPrompt: "Explique por que este reducer generico perde o vinculo entre tipo de acao e payload.",
    miniSnippet: `type Action<T> = { type: string; payload: T };

function reducer<T>(state: T, action: Action<T>) {
  if (action.type === "reset") return action.payload;
  return state;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que um generic unico para todas as acoes nao representa familias diferentes de eventos. Union discriminada comunica melhor.",
    expansionNotes: "Pode crescer para stores e command reducers.",
  },
  {
    id: "ts-generics-009-builder-pattern-inference-stall",
    title: "Builder trava inferencia acumulada",
    challengeType: "explain-code",
    difficulty: "HARD",
    recommendedElo: 1690,
    tags: ["typescript", "builder", "inference"],
    mainPrompt: "Explique o que esta API quer modelar e por que retornar this puro trava a especializacao do tipo.",
    miniSnippet: `class QueryBuilder<T extends object> {
  select<K extends keyof T>(key: K) {
    return this;
  }
}`,
    expectedAnswerSummary: "A resposta deve mostrar que fluent APIs precisam carregar novo estado de tipo no retorno. this cru costuma congelar a inferencia.",
    expansionNotes: "Pode crescer para form builder ou query builder.",
  },
  {
    id: "ts-generics-010-covariance-assumption-array",
    title: "Covariancia inocente em array mutavel",
    challengeType: "debug",
    difficulty: "HARD",
    recommendedElo: 1710,
    tags: ["typescript", "variance", "arrays"],
    mainPrompt: "Explique por que esta atribuicao abre um buraco de tipo na pratica.",
    miniSnippet: `type Animal = { kind: "animal" };
type Dog = Animal & { bark(): void };

const dogs: Dog[] = [];
const animals: Animal[] = dogs;
animals.push({ kind: "animal" });`,
    expectedAnswerSummary: "A resposta deve conectar variancia a leitura versus escrita. Estruturas mutaveis nao aceitam a mesma conversa de uma colecao readonly.",
    expansionNotes: "Pode crescer para colecoes expostas entre camadas.",
  },
]);

const typescriptStateAndImmutability = buildTheme("typescript", "state-and-immutability", [
  {
    id: "ts-state-001-shallow-copy-nested-state",
    title: "Copia rasa em estado aninhado",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    tags: ["typescript", "immutability", "object-spread"],
    mainPrompt: "Explique por que esta atualizacao parece imutavel, mas ainda compartilha estrutura perigosa.",
    miniSnippet: `type Preferences = { theme: { contrast: "low" | "high" } };

function update(state: Preferences) {
  const next = { ...state };
  next.theme.contrast = "high";
  return next;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o spread copia apenas o primeiro nivel; theme continua compartilhado e mutavel para leitores antigos.",
    expansionNotes: "Pode crescer para stores e snapshots.",
  },
  {
    id: "ts-state-002-readonly-does-not-freeze",
    title: "Readonly nao congela runtime",
    challengeType: "explain-concept",
    difficulty: "EASY",
    recommendedElo: 1240,
    tags: ["typescript", "readonly", "runtime"],
    mainPrompt: "Explique por que readonly ajuda no contrato sem congelar o objeto em memoria.",
    miniSnippet: `type User = { readonly name: string };
const user: User = { name: "Ana" };`,
    expectedAnswerSummary: "A resposta deve separar garantia de compilacao de garantia de runtime. readonly melhora API, mas nao substitui estrategia de imutabilidade real.",
    expansionNotes: "Pode crescer para fronteiras entre pacotes.",
  },
  {
    id: "ts-state-003-map-mutation-hidden-in-helper",
    title: "Mutacao escondida em helper de Map",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    tags: ["typescript", "map", "mutation"],
    mainPrompt: "Explique por que este helper devolve a mesma estrutura viva e por que isso e perigoso.",
    miniSnippet: `function addUser(state: Map<string, string>, id: string, name: string) {
  state.set(id, name);
  return state;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que Map e mutavel por natureza; retornar a mesma referencia sabota cache, snapshots e comparacoes por identidade.",
    expansionNotes: "Pode crescer para historico e undo/redo.",
  },
  {
    id: "ts-state-004-reducer-returns-same-reference",
    title: "Reducer devolve a mesma referencia",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1380,
    tags: ["typescript", "reducer", "reference"],
    mainPrompt: "Explique por que este reducer e semanticamente suspeito mesmo quando o valor final parece correto.",
    miniSnippet: `function reducer(state: { count: number }, delta: number) {
  state.count += delta;
  return state;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que conteudo correto nao basta; identidade e parte do contrato de atualizacao em varios sistemas reativos.",
    expansionNotes: "Pode crescer para reducers de UI e cache.",
  },
  {
    id: "ts-state-005-object-identity-cache-key",
    title: "Cache baseado em identidade de objeto",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1520,
    tags: ["typescript", "cache", "identity"],
    mainPrompt: "Explique por que essa estrategia de cache falha para objetos equivalentes de dominio.",
    miniSnippet: `const cache = new Map<object, string>();

function memoizeUser(query: { id: string }) {
  return cache.get(query) ?? "miss";
}`,
    expectedAnswerSummary: "A resposta deve mostrar que igualdade por referencia nao coincide com igualdade de dominio. Chave estrutural ou normalizada evita misses artificiais.",
    expansionNotes: "Pode crescer para query keys e memoizacao.",
  },
  {
    id: "ts-state-006-clone-structured-vs-json",
    title: "JSON clone versus clone real",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1410,
    tags: ["typescript", "clone", "serialization"],
    mainPrompt: "Explique onde JSON.parse(JSON.stringify(...)) ajuda e onde ele quebra silenciosamente.",
    miniSnippet: `const snapshot = JSON.parse(JSON.stringify({ createdAt: new Date(), tags: new Set(["a"]) }));`,
    expectedAnswerSummary: "A resposta deve mostrar que serializacao JSON perde tipos nao JSON como Date, Set e Map. Clonagem e serializacao sao problemas diferentes.",
    expansionNotes: "Pode crescer para exportacao e snapshot.",
  },
  {
    id: "ts-state-007-array-sort-mutates-source",
    title: "sort muta a fonte original",
    challengeType: "debug",
    difficulty: "EASY",
    recommendedElo: 1230,
    tags: ["typescript", "array", "sort", "mutation"],
    mainPrompt: "Explique por que esta funcao altera o input original mesmo parecendo apenas calcular uma visao ordenada.",
    miniSnippet: `function ordered(scores: number[]) {
  return scores.sort((a, b) => a - b);
}`,
    expectedAnswerSummary: "A resposta deve apontar sort como operacao mutavel e sugerir copia antes da ordenacao.",
    expansionNotes: "Pode crescer para rankings e feeds.",
  },
  {
    id: "ts-state-008-set-reference-trap",
    title: "Armadilha de referencia com Set",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1390,
    tags: ["typescript", "set", "reference"],
    mainPrompt: "Explique o que este uso de Set esta assumindo sobre igualdade e por que isso diverge do dominio.",
    miniSnippet: `const selected = new Set<{ id: string }>();
selected.add({ id: "a" });
selected.has({ id: "a" });`,
    expectedAnswerSummary: "A resposta deve mostrar que Set com objetos trabalha por identidade de referencia, nao por igualdade de negocio.",
    expansionNotes: "Pode crescer para tags e selecao de itens.",
  },
  {
    id: "ts-state-009-defensive-copy-at-boundary",
    title: "Falta de copia defensiva na borda",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    tags: ["typescript", "defensive-copy", "api-boundary"],
    mainPrompt: "Explique por que essa classe continua exposta a mutacao externa mesmo sem setter publico.",
    miniSnippet: `class SessionStore {
  constructor(private readonly sessions: string[]) {}

  list() {
    return this.sessions;
  }
}`,
    expectedAnswerSummary: "A resposta deve mostrar que encapsulamento por referencia e diferente de encapsulamento por sintaxe. Sem copia defensiva, o estado interno continua escapando.",
    expansionNotes: "Pode crescer para stores e caches.",
  },
  {
    id: "ts-state-010-snapshot-before-async-work",
    title: "Snapshot antes de trabalho assincrono",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1420,
    tags: ["typescript", "snapshot", "async"],
    mainPrompt: "Explique o que este snapshot local tenta proteger antes do await.",
    miniSnippet: `async function ship(order: { id: string; lines: string[] }) {
  const lines = [...order.lines];
  await Promise.resolve();
  return lines.length;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o snapshot reduz impacto de mutacoes posteriores naquele pedaco do estado, mas nao resolve toda a coerencia do objeto.",
    expansionNotes: "Pode crescer para pipelines de aprovacao.",
  },
]);

const typescriptArchitectureAndApiDesign = buildTheme("typescript", "architecture-and-api-design", [
  {
    id: "ts-arch-001-result-object-vs-throw",
    title: "Resultado tipado versus throw",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1400,
    tags: ["typescript", "result", "exceptions"],
    mainPrompt: "Explique a diferenca entre modelar falha como retorno tipado e modelar falha como excecao.",
    miniSnippet: `type SaveResult =
  | { ok: true; id: string }
  | { ok: false; reason: "conflict" | "offline" };`,
    expectedAnswerSummary: "A resposta deve comparar fluxo explicito, ergonomia e propagacao. Result object torna falha parte do contrato publico.",
    expansionNotes: "Pode crescer para actions e importadores.",
  },
  {
    id: "ts-arch-002-optional-parameter-order-smell",
    title: "Opcionais em cascata na assinatura",
    challengeType: "explain-code",
    difficulty: "EASY",
    recommendedElo: 1260,
    tags: ["typescript", "api-design", "parameters"],
    mainPrompt: "Explique por que esta assinatura tende a envelhecer mal.",
    miniSnippet: `function createAttempt(userId: string, score?: number, hintsUsed?: boolean, source?: string) {}`,
    expectedAnswerSummary: "A resposta deve apontar legibilidade ruim da chamada, acoplamento a ordem e manutencao pior do contrato.",
    expansionNotes: "Pode crescer para APIs de analytics e scoring.",
  },
  {
    id: "ts-arch-003-overload-contract-drift",
    title: "Overload incoerente com implementacao",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    tags: ["typescript", "overload", "contract"],
    mainPrompt: "Explique por que estes overloads prometem algo que o corpo nao entrega.",
    miniSnippet: `function parse(value: string): number;
function parse(value: number): string;
function parse(value: string | number) {
  return value;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que overload serve como contrato publico e precisa refletir comportamento real. Aqui o corpo contradiz o anuncio.",
    expansionNotes: "Pode crescer para adapters e parsers.",
  },
  {
    id: "ts-arch-004-repository-leaks-db-shape",
    title: "Repositorio vazando shape do banco",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1510,
    tags: ["typescript", "repository", "boundaries"],
    mainPrompt: "Explique por que esta interface enfraquece a fronteira entre dominio e persistencia.",
    miniSnippet: `type UserRow = { id: string; created_at: string; deleted_at: string | null };

interface UserRepository {
  findById(id: string): Promise<UserRow | null>;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o repositorio esta expondo detalhes de naming e serializacao da infra. DTO ou mapeamento reduzem acoplamento.",
    expansionNotes: "Pode crescer para Prisma e Neon.",
  },
  {
    id: "ts-arch-005-command-handler-idempotency",
    title: "Handler e idempotencia",
    challengeType: "explain-code",
    difficulty: "HARD",
    recommendedElo: 1640,
    tags: ["typescript", "commands", "idempotency"],
    mainPrompt: "Explique o que significa idempotencia neste handler e o que ainda falta para ela ser confiavel.",
    miniSnippet: `async function completeAttempt(command: { attemptId: string }) {
  if (await alreadyCompleted(command.attemptId)) return;
  await markCompleted(command.attemptId);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que a intencao existe, mas garantia real depende de persistencia atomica, isolamento e chave de deduplicacao.",
    expansionNotes: "Pode crescer para submitAttempt e pagamentos.",
  },
  {
    id: "ts-arch-006-parser-return-type-ambiguity",
    title: "Parser com retorno ambiguo",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    tags: ["typescript", "parser", "return-type"],
    mainPrompt: "Explique por que este parser joga ambiguidade demais para quem chama.",
    miniSnippet: `function parseRating(input: string): number | null | Error {
  return Number(input);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que misturar null e Error como canais de falha cria contrato confuso. Union discriminada e mais clara.",
    expansionNotes: "Pode crescer para parsing de ELO e importadores.",
  },
  {
    id: "ts-arch-007-event-payload-versioning",
    title: "Versionamento de payload de evento",
    challengeType: "explain-concept",
    difficulty: "HARD",
    recommendedElo: 1670,
    tags: ["typescript", "events", "versioning"],
    mainPrompt: "Explique por que payload de evento precisa de estrategia de evolucao e nao apenas de novos campos.",
    miniSnippet: `type AttemptScoredV1 = {
  type: "attempt.scored";
  payload: { attemptId: string; score: number };
};`,
    expectedAnswerSummary: "A resposta deve conectar contrato de evento a consumidores independentes no tempo, replay e compatibilidade.",
    expansionNotes: "Pode crescer para analytics e projections.",
  },
  {
    id: "ts-arch-008-service-locator-hidden-dependency",
    title: "Dependencia escondida por service locator",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1530,
    tags: ["typescript", "service-locator", "testing"],
    mainPrompt: "Explique por que esta funcao parece simples, mas fica pior de testar e de entender localmente.",
    miniSnippet: `export async function scoreAttempt(id: string) {
  return container.aiScorer.score(id);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que a assinatura nao revela dependencias reais. Injecao explicita melhora previsibilidade e teste.",
    expansionNotes: "Pode crescer para AI scorer e adapters.",
  },
  {
    id: "ts-arch-009-callback-api-missed-discriminant",
    title: "Callback sem discriminante suficiente",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1420,
    tags: ["typescript", "callback", "discriminated-union"],
    mainPrompt: "Explique por que este callback obriga o consumidor a inferir contexto por combinacao de opcionais.",
    miniSnippet: `type Update = { value?: string; error?: string };

function subscribe(listener: (update: Update) => void) {}`,
    expectedAnswerSummary: "A resposta deve mostrar que estados invalidos ficam representaveis. Union discriminada ou eventos nomeados deixam a API mais legivel.",
    expansionNotes: "Pode crescer para upload e feedback de treino.",
  },
  {
    id: "ts-arch-010-sync-async-bridge-smell",
    title: "Ponte sincrona-asincrona suspeita",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1540,
    tags: ["typescript", "sync-async", "architecture"],
    mainPrompt: "Explique por que esta API parece sincrona, mas empurra comportamento e falha para outro modelo de execucao.",
    miniSnippet: `function runLater(task: () => void) {
  Promise.resolve().then(task);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que a API engana o chamador sobre ordem e tratamento de erro. Tornar a borda explicitamente async costuma ser mais honesto.",
    expansionNotes: "Pode crescer para filas de UI e instrumentation.",
  },
]);

const reactEffectsAndLifecycle = buildTheme("react", "effects-and-lifecycle", [
  {
    id: "react-effects-001-stale-closure-interval",
    title: "Intervalo preso em stale closure",
    challengeType: "debug",
    difficulty: "EASY",
    recommendedElo: 1300,
    tags: ["react", "useEffect", "stale-closure"],
    mainPrompt: "Explique por que este contador trava em vez de crescer continuamente.",
    miniSnippet: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{count}</span>;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o callback fecha sobre o valor inicial de count. Update funcional ou dependencias corretas resolvem a armadilha.",
    expansionNotes: "Pode crescer para polling e cronometro.",
  },
  {
    id: "react-effects-002-object-dependency-loop",
    title: "Loop por dependencia instavel",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    tags: ["react", "useEffect", "dependencies"],
    mainPrompt: "Explique por que este effect reexecuta sem necessidade.",
    miniSnippet: `function Search({ query }: { query: string }) {
  const filters = { query };

  useEffect(() => {
    fetchResults(filters);
  }, [filters]);

  return null;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o objeto filters muda de identidade a cada render. Isso basta para reacender o effect.",
    expansionNotes: "Pode crescer para filtros e busca.",
  },
  {
    id: "react-effects-003-cleanup-order-websocket",
    title: "Cleanup de websocket",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1420,
    tags: ["react", "cleanup", "websocket"],
    mainPrompt: "Explique o que este effect tenta garantir sobre inscricao e limpeza.",
    miniSnippet: `useEffect(() => {
  const socket = connect(roomId);
  socket.on("message", onMessage);
  return () => socket.off("message", onMessage);
}, [roomId, onMessage]);`,
    expectedAnswerSummary: "A resposta deve descrever montagem, limpeza e risco de listeners duplicados quando a ordem e o cleanup nao sao respeitados.",
    expansionNotes: "Pode crescer para streams de notificacao.",
  },
  {
    id: "react-effects-004-strict-mode-double-invoke",
    title: "Strict Mode e dupla invocacao",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1440,
    tags: ["react", "strict-mode", "effects"],
    mainPrompt: "Explique por que este effect pode rodar duas vezes em desenvolvimento.",
    miniSnippet: `useEffect(() => {
  analytics.track("page-open");
}, []);`,
    expectedAnswerSummary: "A resposta deve mostrar o papel pedagogico do Strict Mode para revelar side effects nao idempotentes e cleanups incompletos.",
    expansionNotes: "Pode crescer para tracking e init de SDK.",
  },
  {
    id: "react-effects-005-event-listener-stale-prop",
    title: "Listener preso em prop antiga",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    tags: ["react", "event-listener", "stale-closure"],
    mainPrompt: "Explique por que o listener global pode continuar reagindo a uma prop velha.",
    miniSnippet: `function Hotkey({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    const onKey = () => {
      if (enabled) console.log("run");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o listener registrado fecha sobre o valor inicial de enabled. Ref ou renovacao consciente do listener corrigem isso.",
    expansionNotes: "Pode crescer para atalhos e toggles de editor.",
  },
]);

const reactStateAndRendering = buildTheme("react", "state-and-rendering", [
  {
    id: "react-state-001-nested-state-mutation",
    title: "Mutacao de estado aninhado",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    tags: ["react", "state", "mutation"],
    mainPrompt: "Explique por que esta atualizacao pode falhar em disparar o rerender esperado.",
    miniSnippet: `const [profile, setProfile] = useState({ prefs: { compact: false } });

function enableCompact() {
  profile.prefs.compact = true;
  setProfile(profile);
}`,
    expectedAnswerSummary: "A resposta deve mostrar mutacao direta do objeto anterior e reuso da mesma referencia. React depende de identidade para detectar mudanca.",
    expansionNotes: "Pode crescer para settings e forms.",
  },
  {
    id: "react-state-002-derived-flag-stored-in-state",
    title: "Flag derivada armazenada",
    challengeType: "explain-code",
    difficulty: "EASY",
    recommendedElo: 1280,
    tags: ["react", "derived-state", "state"],
    mainPrompt: "Explique por que guardar essa flag no state adiciona acoplamento desnecessario.",
    miniSnippet: `const [items, setItems] = useState<string[]>([]);
const [isEmpty, setIsEmpty] = useState(true);`,
    expectedAnswerSummary: "A resposta deve mostrar que isEmpty e derivavel de items.length. Duplicar a verdade aumenta risco de drift.",
    expansionNotes: "Pode crescer para badges e contadores.",
  },
  {
    id: "react-state-003-key-instability-on-reorder",
    title: "Key instavel em lista reordenavel",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    tags: ["react", "keys", "lists"],
    mainPrompt: "Explique por que usar indice como key pode misturar estado visual entre linhas.",
    miniSnippet: `items.map((item, index) => <Row key={index} item={item} />);`,
    expectedAnswerSummary: "A resposta deve mostrar que indice nao representa identidade quando a ordem muda. O React pode reaproveitar a instancia errada.",
    expansionNotes: "Pode crescer para trees e tabelas editaveis.",
  },
  {
    id: "react-state-004-optimistic-counter-race",
    title: "Race em update otimista",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1500,
    tags: ["react", "optimistic-ui", "state"],
    mainPrompt: "Explique por que cliques rapidos podem deixar este contador em valor errado.",
    miniSnippet: `const [likes, setLikes] = useState(0);

async function like() {
  setLikes(likes + 1);
  await saveLike();
}`,
    expectedAnswerSummary: "A resposta deve mostrar colisao entre eventos que usam o mesmo snapshot antigo. Update funcional reduz o problema.",
    expansionNotes: "Pode crescer para reactions e attempts.",
  },
  {
    id: "react-state-005-state-machine-vs-boolean-matrix",
    title: "Boolean matrix versus state machine",
    challengeType: "explain-concept",
    difficulty: "HARD",
    recommendedElo: 1620,
    tags: ["react", "state-machine", "booleans"],
    mainPrompt: "Explique por que varias flags de UI independentes tendem a criar estados invalidos representaveis.",
    miniSnippet: `const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(false);`,
    expectedAnswerSummary: "A resposta deve mostrar combinacoes impossiveis como loading+success ao mesmo tempo. Uniao discriminada ou state machine tornam o dominio mais honesto.",
    expansionNotes: "Pode crescer para auth, submit e importadores.",
  },
]);

const reactDerivedStateAndMemoization = buildTheme("react", "derived-state-and-memoization", [
  {
    id: "react-memo-001-usememo-side-effect",
    title: "Side effect dentro de useMemo",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    tags: ["react", "useMemo", "side-effects"],
    mainPrompt: "Explique por que este useMemo esta sendo usado para a responsabilidade errada.",
    miniSnippet: `const total = useMemo(() => {
  analytics.track("cart-recalculated");
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);`,
    expectedAnswerSummary: "A resposta deve separar memoizacao de calculo puro e side effect observavel. O tracking precisa de outro lugar mais explicito.",
    expansionNotes: "Pode crescer para metricas e tracing.",
  },
  {
    id: "react-memo-002-filtered-list-stale-dependency",
    title: "Memo com dependencia faltando",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1460,
    tags: ["react", "useMemo", "dependencies"],
    mainPrompt: "Explique por que esta lista memoizada pode ficar velha quando a busca muda.",
    miniSnippet: `const visible = useMemo(() => {
  return items.filter(item => item.name.includes(query));
}, [items]);`,
    expectedAnswerSummary: "A resposta deve mostrar que o resultado depende de query e items. Sem a dependencia completa, a memoizacao devolve valor stale.",
    expansionNotes: "Pode crescer para filtros do dashboard.",
  },
  {
    id: "react-memo-003-expensive-computation-with-transition",
    title: "Calculo caro e transicao",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1430,
    tags: ["react", "useTransition", "memoization"],
    mainPrompt: "Explique como transicao e memoizacao atacam camadas diferentes do problema.",
    miniSnippet: `const [isPending, startTransition] = useTransition();
const rows = useMemo(() => heavyTransform(data), [data]);`,
    expectedAnswerSummary: "A resposta deve separar custo computacional puro de prioridade perceptiva de atualizacao. useTransition nao substitui memoizacao.",
    expansionNotes: "Pode crescer para analytics e scoreboard.",
  },
  {
    id: "react-memo-004-memoized-callback-identity-trap",
    title: "Armadilha de identidade em callback memoizado",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1440,
    tags: ["react", "useCallback", "identity"],
    mainPrompt: "Explique por que memoizar callback nem sempre gera ganho real.",
    miniSnippet: `const handleSave = useCallback(() => save(form), [form]);
return <Toolbar onSave={handleSave} />;`,
    expectedAnswerSummary: "A resposta deve mostrar que estabilidade de referencia so importa quando algum consumidor realmente compara ou depende dessa identidade.",
    expansionNotes: "Pode crescer para arquitetura de components.",
  },
  {
    id: "react-memo-005-selector-over-derive-state",
    title: "Seletor versus state derivado duplicado",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1410,
    tags: ["react", "selectors", "derived-state"],
    mainPrompt: "Explique quando um seletor derivado e melhor do que guardar mais state.",
    miniSnippet: `const visibleAttempts = attempts.filter(attempt => attempt.score >= minScore);`,
    expectedAnswerSummary: "A resposta deve mostrar que seletor preserva uma unica fonte de verdade e evita sincronizacao manual. Memoizacao entra apenas quando identidade ou custo importam.",
    expansionNotes: "Pode crescer para stores e filtros.",
  },
]);

const reactAsyncUiAndRaces = buildTheme("react", "async-ui-and-races", [
  {
    id: "react-async-001-fetch-out-of-order",
    title: "Fetch fora de ordem sobrescreve tela",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1490,
    tags: ["react", "async", "race-condition"],
    mainPrompt: "Explique como respostas fora de ordem podem mostrar o usuario errado na tela.",
    miniSnippet: `useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);`,
    expectedAnswerSummary: "A resposta deve mostrar que uma request antiga pode resolver depois da nova e ainda assim escrever no state. Token ou cancelamento evitam isso.",
    expansionNotes: "Pode crescer para profile e detalhes.",
  },
  {
    id: "react-async-002-abort-on-unmount",
    title: "Abort no cleanup",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1400,
    tags: ["react", "abort-controller", "cleanup"],
    mainPrompt: "Explique o que este cleanup esta tentando evitar.",
    miniSnippet: `useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);`,
    expectedAnswerSummary: "A resposta deve mostrar que o cleanup reduz trabalho inutil e escrita tardia apos unmount, mas ainda exige tratar o caso de abort conscientemente.",
    expansionNotes: "Pode crescer para loaders e navegacao rapida.",
  },
  {
    id: "react-async-003-loading-flag-shared-between-requests",
    title: "Loading compartilhado entre requests",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1510,
    tags: ["react", "loading-state", "async"],
    mainPrompt: "Explique por que uma flag booleana unica pode mentir quando ha requisicoes concorrentes.",
    miniSnippet: `const [loading, setLoading] = useState(false);

async function refresh(id: string) {
  setLoading(true);
  await fetchUser(id);
  setLoading(false);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que a primeira request que termina pode desligar a flag enquanto outra ainda esta em voo. Contador ou chave por request resolvem melhor.",
    expansionNotes: "Pode crescer para painel multi-fonte.",
  },
  {
    id: "react-async-004-retry-button-double-submit",
    title: "Retry permite double submit",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1480,
    tags: ["react", "retry", "double-submit"],
    mainPrompt: "Explique por que cliques rapidos ainda podem duplicar envios aqui.",
    miniSnippet: `const [submitting, setSubmitting] = useState(false);

async function retry() {
  if (submitting) return;
  setSubmitting(true);
  await submit();
  setSubmitting(false);
}`,
    expectedAnswerSummary: "A resposta deve mostrar janela entre evento e render com lock efetivo. Ref, serializacao ou disable imediato ajudam.",
    expansionNotes: "Pode crescer para forms e attempts.",
  },
  {
    id: "react-async-005-cache-stampede-in-component",
    title: "Cache stampede na UI",
    challengeType: "explain-concept",
    difficulty: "HARD",
    recommendedElo: 1600,
    tags: ["react", "cache", "stampede"],
    mainPrompt: "Explique o conceito de cache stampede em componentes montando ao mesmo tempo.",
    miniSnippet: `useEffect(() => {
  fetchStats(teamId).then(setStats);
}, [teamId]);`,
    expectedAnswerSummary: "A resposta deve ligar montagens simultaneas com requests identicas, desperdicio de rede e reconciliacao visual pior. Deduplicacao ou cache compartilhado ajudam.",
    expansionNotes: "Pode crescer para widgets do dashboard.",
  },
]);

const reactComponentContractsAndComposition = buildTheme("react", "component-contracts-and-composition", [
  {
    id: "react-contracts-001-controlled-uncontrolled-input",
    title: "Input alterna entre controlado e nao controlado",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1450,
    tags: ["react", "forms", "controlled"],
    mainPrompt: "Explique por que este componente pode alternar entre dois contratos de input.",
    miniSnippet: `function NameField({ value }: { value?: string }) {
  return <input value={value} />;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que undefined em alguns renders e string em outros pode alternar o contrato do input. O componente precisa de uma escolha consistente.",
    expansionNotes: "Pode crescer para onboarding e form builder.",
  },
  {
    id: "react-contracts-002-children-as-function-explain",
    title: "children como funcao",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1390,
    tags: ["react", "composition", "render-props"],
    mainPrompt: "Explique o que este componente oferece ao consumidor usando children como funcao.",
    miniSnippet: `function Loader({ children }: { children: (ready: boolean) => React.ReactNode }) {
  return children(true);
}`,
    expectedAnswerSummary: "A resposta deve mostrar que o container delega a renderizacao final ao consumidor enquanto fornece contexto. Isso aumenta flexibilidade e tambem custo cognitivo.",
    expansionNotes: "Pode crescer para shells e wrappers do trainer.",
  },
  {
    id: "react-contracts-003-prop-drilling-vs-context",
    title: "Prop drilling versus context",
    challengeType: "explain-concept",
    difficulty: "MEDIUM",
    recommendedElo: 1420,
    tags: ["react", "context", "props"],
    mainPrompt: "Explique quando prop drilling e apenas composicao honesta e quando context passa a valer a pena.",
    miniSnippet: `function Page({ theme }: { theme: string }) {
  return <Sidebar theme={theme} />;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que context nao e premio por poucas props. Ele vale quando a dependencia e transversal de verdade e tem varios consumidores.",
    expansionNotes: "Pode crescer para theme, auth e config.",
  },
  {
    id: "react-contracts-004-component-api-incompatible-default",
    title: "Default de prop quebra contrato",
    challengeType: "debug",
    difficulty: "MEDIUM",
    recommendedElo: 1470,
    tags: ["react", "component-api", "defaults"],
    mainPrompt: "Explique por que este default e tecnicamente valido, mas editorialmente ruim para a API.",
    miniSnippet: `function Avatar({ size = 0 }: { size?: number }) {
  return <img width={size} height={size} />;
}`,
    expectedAnswerSummary: "A resposta deve mostrar que defaults precisam ter semantica util. Um 0 aqui cria comportamento invisivel ou invalido por padrao.",
    expansionNotes: "Pode crescer para pacote UI compartilhado.",
  },
  {
    id: "react-contracts-005-ref-forwarding-boundary",
    title: "forwardRef como ampliacao de contrato",
    challengeType: "explain-code",
    difficulty: "MEDIUM",
    recommendedElo: 1400,
    tags: ["react", "ref", "forwardRef"],
    mainPrompt: "Explique o que muda no contrato publico quando um componente passa a encaminhar ref.",
    miniSnippet: `const Field = forwardRef<HTMLInputElement, { label: string }>((props, ref) => {
  return <input ref={ref} aria-label={props.label} />;
});`,
    expectedAnswerSummary: "A resposta deve mostrar que forwardRef expoe uma borda imperativa e acopla consumidores a uma estrutura interna. Isso deve ser intencional.",
    expansionNotes: "Pode crescer para inputs e command menu.",
  },
]);

export const questionBankSeeds = [
  ...typescriptAsyncAndConcurrency,
  ...typescriptTypesAndNarrowing,
  ...typescriptGenericsAndInference,
  ...typescriptStateAndImmutability,
  ...typescriptArchitectureAndApiDesign,
  ...reactEffectsAndLifecycle,
  ...reactStateAndRendering,
  ...reactDerivedStateAndMemoization,
  ...reactAsyncUiAndRaces,
  ...reactComponentContractsAndComposition,
];
