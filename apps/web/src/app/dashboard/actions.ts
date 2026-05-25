"use server";

import prisma from "@CC/db";
import { revalidatePath } from "next/cache";

// Custom helper to clean LLM markdown wrapper wraps
function cleanJsonResponse(raw: string): string {
  let cleaned = raw.trim();
  // Remove markdown block backticks (e.g. ```json ... ```)
  cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "");
  cleaned = cleaned.replace(/\s*```$/, "");
  return cleaned.trim();
}

// Math for ELO variation based on AI score (0-10)
function calculateEloChange(score: number): number {
  if (score >= 8) {
    // Excelente Desempenho (8 a 10): +10 a +20
    return Math.round(10 + (score - 8) * 5);
  } else if (score >= 5) {
    // Entendimento Parcial (5 a 7): +2 a +5
    return Math.round(2 + (score - 5) * 1.5);
  } else {
    // Desempenho Crítico (0 a 4): -15 a -5
    return Math.round(-15 + (score * 2.5));
  }
}

// Auto-creates or fetches local default user
export async function getLocalUser() {
  try {
    let user = await prisma.user.findFirst({
      where: {
        email: "default@trainer.com",
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: "default-user-id",
          name: "Treinador CCT",
          email: "default@trainer.com",
          elo: 1200,
          emailVerified: true,
        },
      });
    }

    return { success: true, data: user };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao obter usuário local" };
  }
}

// Auto-seed data definition
const DEFAULT_CHALLENGES = [
  {
    title: "O Fechamento Obsoleto (Stale Closure) no useEffect",
    difficulty: "MEDIUM",
    recommendedElo: 1400,
    tags: "useEffect,stale-closure,react-hooks",
    question: "Por que o contador acima trava no número 1 e o console.log sempre imprime 'Count value: 0'? Explique a causa raiz e sugira duas formas de resolver.",
    code: `import React, { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Count value:", count);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Array de dependências vazio

  return <div>Contagem: {count}</div>;
}`,
    solution: `### Causa Raiz
O \`useEffect\` captura a variável de estado \`count\` em seu escopo léxico (closure) durante a montagem do componente. Como o array de dependências está vazio \`[]\`, a função do efeito nunca é recriada. O callback do intervalo sempre vê o valor inicial de \`count\` como \`0\` a cada execução, disparando \`setCount(0 + 1)\` repetidamente.

### Soluções Possíveis

1. **Atualização Funcional do Estado**:
   Passar um callback para \`setCount\` que recebe o estado anterior estável:
   \`\`\`tsx
   setCount(prev => prev + 1);
   \`\`\`

2. **Adicionar Dependência**:
   Adicionar \`count\` ao array de dependências e limpar o intervalo no cleanup para evitar múltiplos intervals registrados concorrentemente:
   \`\`\`tsx
   useEffect(() => {
     const interval = setInterval(() => {
       setCount(count + 1);
     }, 1000);
     return () => clearInterval(interval);
   }, [count]);
   \`\`\``
  },
  {
    title: "Race Condition não Tratada em Requisições",
    difficulty: "HARD",
    recommendedElo: 1600,
    tags: "useEffect,race-condition,data-fetching",
    question: "Explique qual o bug de concorrência (Race Condition) que pode ocorrer nesse componente ao mudar o 'userId' rapidamente, e como consertá-lo.",
    code: `import React, { useState, useEffect } from 'react';

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(\`https://api.example.com/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Carregando perfil...</div>;
  if (!user) return <div>Nenhum usuário selecionado</div>;
  return <div>Nome: {user.name}</div>;
}`,
    solution: `### Causa Raiz
Se a propriedade \`userId\` mudar rapidamente (por exemplo, de 1 para 2, e depois para 3), múltiplas requisições assíncronas de rede serão disparadas concorrentemente. O tempo de resposta de cada chamada de rede é imprevisível. Se a primeira requisição demorar mais para responder do que as posteriores, o callback da primeira atualizará o estado por último, sobrescrevendo os dados corretos com dados antigos e exibindo informações incorretas na tela.

### Solução Ideal
Adicionar uma flag de controle local dentro do efeito para ignorar a resposta da requisição se o efeito for cancelado por uma mudança subsequente de dependência:

\`\`\`tsx
useEffect(() => {
  let active = true;
  setLoading(true);

  fetch(\`https://api.example.com/users/\${userId}\`)
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
\`\`\``
  },
  {
    title: "Loop Infinito por Dependência de Objeto",
    difficulty: "EASY",
    recommendedElo: 1200,
    tags: "useEffect,infinite-loop,object-dependency",
    question: "Por que este componente entra em um loop infinito de requisições de rede? Mapeie a causa base e forneça a solução.",
    code: `import React, { useState, useEffect } from 'react';

export function DataFetcher() {
  const [data, setData] = useState([]);
  const config = { api: "https://api.example.com/items" };

  useEffect(() => {
    fetch(config.api)
      .then(res => res.json())
      .then(data => setData(data));
  }, [config]); // Objeto config como dependência

  return (
    <ul>
      {data.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}`,
    solution: `### Causa Raiz
No JavaScript, objetos são comparados por referência na memória, não por valor estrutural. O objeto \`config\` é recriado a cada renderização do componente, obtendo uma nova referência. Como \`config\` está no array de dependências do \`useEffect\`, o React detecta uma mudança de dependência e executa o efeito novamente. O efeito então chama \`setData\`, o que aciona um re-render, recriando \`config\` com outra referência e iniciando um loop infinito.

### Soluções Possíveis

1. **Extrair para fora do componente** (se for estático):
   \`\`\`tsx
   const config = { api: "https://api.example.com/items" };
   export function DataFetcher() { ... }
   \`\`\`

2. **Usar dependência primitiva** (String) no array:
   \`\`\`tsx
   useEffect(() => {
     fetch(config.api) ...
   }, [config.api]);
   \`\`\``
  }
];

// Fetches challenges with auto-seeding
export async function getChallenges() {
  try {
    const userRes = await getLocalUser();
    if (!userRes.success || !userRes.data) {
      throw new Error("Erro ao identificar usuário");
    }

    let count = await prisma.challenge.count();

    if (count === 0) {
      // Seed default challenges
      for (const ch of DEFAULT_CHALLENGES) {
        await prisma.challenge.create({
          data: ch,
        });
      }
    }

    const challenges = await prisma.challenge.findMany({
      include: {
        attempts: {
          where: {
            userId: userRes.data.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        recommendedElo: "asc",
      },
    });

    return { success: true, data: challenges };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar desafios" };
  }
}

// Fetches detailed challenge info
export async function getChallenge(id: string) {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      return { success: false, error: "Desafio não encontrado" };
    }

    return { success: true, data: challenge };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar desafio" };
  }
}

// Submits user attempt for evaluation
export async function submitAttempt(challengeId: string, userAnswer: string) {
  try {
    const userRes = await getLocalUser();
    if (!userRes.success || !userRes.data) {
      return { success: false, error: "Usuário padrão local não encontrado" };
    }
    const user = userRes.data;

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) {
      return { success: false, error: "Desafio não encontrado" };
    }

    // OpenRouter connection disabled for now. Always generate mock feedback directly.
    const feedbackObj = getMockFeedback(challenge.solution);

    // Ensure score boundaries (0 to 10)
    const score = Math.max(0, Math.min(10, feedbackObj.score));

    // Calculate rounded ELO Change
    const eloChange = calculateEloChange(score);

    // Apply ELO change with ELO floor (min 100)
    const newElo = Math.max(100, user.elo + eloChange);

    // Write attempt and update user ELO in database
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { elo: newElo },
      }),
      prisma.attempt.create({
        data: {
          userId: user.id,
          challengeId: challenge.id,
          userAnswer,
          feedbackJson: JSON.stringify(feedbackObj),
          score,
          eloChange,
        },
      }),
    ]);

    revalidatePath("/dashboard");
    return {
      success: true,
      data: {
        score,
        eloChange,
        newElo,
        feedback: feedbackObj,
      },
    };

  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao enviar tentativa" };
  }
}

// History of attempts for dashboard evolution mapping
export async function getAttemptsHistory() {
  try {
    const userRes = await getLocalUser();
    if (!userRes.success || !userRes.data) {
      throw new Error("Usuário padrão local não encontrado");
    }

    const attempts = await prisma.attempt.findMany({
      where: {
        userId: userRes.data.id,
      },
      include: {
        challenge: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: attempts };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar histórico de tentativas" };
  }
}

// Helper mock generator for offline resiliency
function getMockFeedback(solution: string) {
  return {
    score: 8.0,
    summary: "Você identificou os principais problemas do código, demonstrando boa compreensão do fluxo do React. Contudo, alguns detalhes mais sutis de gerenciamento de dependências e ciclo de vida foram omitidos.",
    strengths: [
      "Identificou o problema principal relacionado a closures obsoletas ou dependências recriadas repetidamente.",
      "Escreveu uma explicação lógica sobre como o estado atualiza e redesenha o componente."
    ],
    blindspots: [
      "Omitiu a necessidade de limpar intervalos ou referências temporárias no retorno do hook (cleanup).",
      "Poderia ter mencionado a importância de manter referências estáveis em variáveis de escopo usando Hooks apropriados."
    ],
    seniorSolution: solution
  };
}
