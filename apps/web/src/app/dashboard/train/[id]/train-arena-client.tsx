"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  ChevronLeft,
  BookOpen,
  HelpCircle,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  FileCode,
} from "lucide-react";

import { Button } from "@CC/ui/components/button";
import { submitAttempt } from "../../actions";

export interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  code: string;
  question: string;
  solution: string;
  tags: string;
}

interface Feedback {
  score: number;
  summary: string;
  strengths: string[];
  blindspots: string[];
  seniorSolution: string;
}

interface AttemptResult {
  score: number;
  eloChange: number;
  newElo: number;
  isFirstAttempt: boolean;
  feedback: Feedback;
}

const MIN_ANSWER_LENGTH = 30;

// Custom Zen-themed syntax highlighter for JSX / TypeScript
function highlightCode(code: string) {
  const lines = code.split("\n");
  
  return lines.map((line, lineIdx) => {
    if (line.trim().startsWith("//")) {
      return (
        <span key={lineIdx} className="text-muted-foreground/45 italic whitespace-pre">
          {line}
        </span>
      );
    }
    
    // JS/TS keywords, hooks, brackets/braces/punctuation, strings, JSX tags, numbers, comments
    const tokenRegex = /(\/\/.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|export|default|import|from|return|if|else|try|catch|finally|type|interface|as|switch|case|break)\b)|(\b(?:useState|useEffect|useMemo|useCallback|useRef)\b)|(\b(?:true|false|null|undefined)\b)|(\b\d+\b)|(<[^>]+>)|([a-zA-Z_$][a-zA-Z0-9_$]*)|([^\s\w]+)/g;
    
    let match;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    
    tokenRegex.lastIndex = 0;
    
    while ((match = tokenRegex.exec(line)) !== null) {
      const matchIndex = match.index;
      
      if (matchIndex > lastIndex) {
        elements.push(line.substring(lastIndex, matchIndex));
      }
      
      const [
        full,
        comment,
        string,
        keyword,
        hook,
        booleanNull,
        number,
        jsx,
        identifier,
        punctuation
      ] = match;
      
      const key = `${lineIdx}-${matchIndex}`;
      
      if (comment) {
        elements.push(
          <span key={key} className="text-muted-foreground/45 italic">
            {comment}
          </span>
        );
      } else if (string) {
        elements.push(
          <span key={key} className="text-[#bd5338] dark:text-[#e27e65] font-medium">
            {string}
          </span>
        );
      } else if (keyword) {
        elements.push(
          <span key={key} className="text-[#2d5a27] dark:text-[#8ebf80] font-bold">
            {keyword}
          </span>
        );
      } else if (hook) {
        elements.push(
          <span key={key} className="text-[#2c6b6b] dark:text-[#5fb3b3] font-semibold">
            {hook}
          </span>
        );
      } else if (booleanNull || number) {
        elements.push(
          <span key={key} className="text-amber-600 dark:text-amber-400">
            {full}
          </span>
        );
      } else if (jsx) {
        elements.push(
          <span key={key} className="text-sky-700 dark:text-sky-400">
            {jsx}
          </span>
        );
      } else if (punctuation) {
        elements.push(
          <span key={key} className="text-muted-foreground/60">
            {punctuation}
          </span>
        );
      } else {
        elements.push(full);
      }
      
      lastIndex = tokenRegex.lastIndex;
    }
    
    if (lastIndex < line.length) {
      elements.push(line.substring(lastIndex));
    }
    
    return (
      <div key={lineIdx} className="min-h-[1.25rem] whitespace-pre">
        {elements.length > 0 ? elements : " "}
      </div>
    );
  });
}

// Parses standard diagnostic questions to extract mysterious prompt and details
function parseQuestion(questionText: string) {
  const splitKeywords = [
    "Na sua resposta, cubra:",
    "Na sua resposta cubra:",
    "Na resposta, cubra:",
    "Na resposta cubra:",
    "Para responder, cubra:",
    "Pontos a cobrir:"
  ];
  
  let splitIndex = -1;
  
  for (const kw of splitKeywords) {
    const idx = questionText.indexOf(kw);
    if (idx !== -1) {
      splitIndex = idx;
      break;
    }
  }
  
  if (splitIndex !== -1) {
    const mainPrompt = questionText.substring(0, splitIndex).trim();
    const hintText = questionText.substring(splitIndex).trim();
    return {
      mainPrompt: mainPrompt || "Este componente apresenta comportamento incorreto em produção. Diagnose o bug e explique a correção.",
      hintText: hintText
    };
  }
  
  const listIdx = questionText.search(/\b1\)/);
  if (listIdx !== -1) {
    const mainPrompt = questionText.substring(0, listIdx).trim();
    const hintText = "Na sua resposta, cubra:\n" + questionText.substring(listIdx).trim();
    return {
      mainPrompt: mainPrompt || "Este componente apresenta comportamento incorreto em produção. Diagnose o bug e explique a correção.",
      hintText: hintText
    };
  }
  
  return {
    mainPrompt: "Este componente apresenta comportamento incorreto em produção. Diagnose o bug e explique a correção.",
    hintText: questionText
  };
}

interface TrainArenaClientProps {
  id: string;
  initialChallenge: Challenge | null;
  initialUserElo: number;
}

export default function TrainArenaClient({
  id,
  initialChallenge,
  initialUserElo,
}: TrainArenaClientProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  // Hint states
  const [usedHint, setUsedHint] = useState(false);
  const [showHintConfirm, setShowHintConfirm] = useState(false);
  const [hintRevealed, setHintRevealed] = useState(false);

  if (!initialChallenge) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-xs text-muted-foreground font-mono">
          Desafio não encontrado.
        </p>
        <Link href="/challenges">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none font-mono uppercase text-xs"
          >
            Voltar aos desafios
          </Button>
        </Link>
      </div>
    );
  }

  const challenge = initialChallenge;
  const userElo = initialUserElo;
  const lines = challenge.code.split("\n");
  const answerLength = userAnswer.trim().length;
  const canSubmit =
    !submitting && !answerLocked && answerLength >= MIN_ANSWER_LENGTH;

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (submitting || answerLocked) {
      return;
    }

    if (answerLength < MIN_ANSWER_LENGTH) {
      toast.error(
        `Escreva pelo menos ${MIN_ANSWER_LENGTH} caracteres para enviar.`
      );
      return;
    }

    setAnswerLocked(true);
    setSubmitting(true);

    try {
      const res = await submitAttempt(id, userAnswer, usedHint);
      if (res.success && res.data) {
        setResult(res.data as AttemptResult);
        toast.success("Diagnóstico avaliado com sucesso!");
      } else {
        setAnswerLocked(false);
        toast.error(res.error || "Erro ao avaliar resposta");
      }
    } catch {
      setAnswerLocked(false);
      toast.error("Erro ao enviar resposta para correção");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case "EASY":
        return "Fácil";
      case "MEDIUM":
        return "Médio";
      case "HARD":
        return "Difícil";
      default:
        return diff;
    }
  };

  const getLevelCompatibility = (recommendedElo: number) => {
    const delta = recommendedElo - userElo;
    if (delta <= 150) {
      return {
        label: "Nível Compatível",
        className:
          "inline-flex items-center border px-2 py-0.5 text-[10px] font-mono uppercase font-bold border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    }

    if (delta > 200) {
      return {
        label: "Desafio Avançado para o seu Rating",
        className:
          "inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-mono uppercase font-bold border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    }

    return null;
  };

  const compatibility = getLevelCompatibility(challenge.recommendedElo);

  const parsedQ = parseQuestion(challenge.question);

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-5 lg:px-6 py-4 flex flex-col gap-4 overflow-hidden h-full min-h-0 bg-background/50 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 border-b border-border pb-3 shrink-0">
        <Link href="/challenges">
          <Button variant="ghost" size="xs" className="h-7 text-muted-foreground">
            <ChevronLeft className="size-3.5 mr-1" />
            Voltar aos Desafios
          </Button>
        </Link>
        <span className="text-3xs text-muted-foreground font-mono">/</span>
        <span className="text-3xs text-muted-foreground font-mono font-bold truncate">
          {challenge.title}
        </span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 overflow-hidden">
        {/* Left Column (64% width, h-full): The Code Editor */}
        <div className="lg:w-[64%] w-full flex flex-col border border-border bg-card h-full min-h-0 overflow-hidden">
          {/* File Tab Header (IDE style) */}
          <div className="border-b border-border flex items-center justify-between shrink-0 bg-muted/10 h-9">
            <div className="flex items-center h-full">
              {/* Active Tab */}
              <div className="h-full border-r border-border bg-card px-4 flex items-center gap-2 text-xs font-mono font-medium text-foreground relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary">
                <FileCode className="size-3.5 text-primary/70" />
                <span>EasyCase1.tsx</span>
              </div>
              {/* Inactive Tab Spacer */}
              <div className="h-full flex items-center px-3 text-muted-foreground/30 select-none">
                <span className="text-3xs font-mono font-bold">...</span>
              </div>
            </div>
            <div className="px-3 shrink-0">
              <span className="text-4xs font-mono border border-border px-1.5 py-0.5 uppercase font-bold text-foreground">
                {getDifficultyLabel(challenge.difficulty)}
              </span>
            </div>
          </div>

          <div className="flex-1 flex font-mono text-[11px] leading-relaxed overflow-y-auto select-text bg-muted/5 min-h-0">
            <div className="py-4 pl-3 pr-2 text-right text-muted-foreground/35 border-r border-border select-none bg-muted/10 font-semibold w-10 shrink-0">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <pre className="py-4 px-3 overflow-x-auto flex-1 text-foreground leading-5 font-mono">
              {highlightCode(challenge.code)}
            </pre>
          </div>
        </div>

        {/* Right Column (36% width, h-full) */}
        <div className="lg:w-[36%] w-full h-full min-h-0 grid grid-rows-[4fr_6fr] gap-4 overflow-hidden">
          {/* Top Section (40% height): Pergunta de Diagnóstico (permanently visible) */}
          <div className="row-span-1 border border-border bg-card p-4 flex flex-col gap-3 min-h-0 overflow-y-auto">
            <div className="flex items-center justify-between shrink-0 pb-1.5 border-b border-border/40">
              <h3 className="text-3xs font-mono font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-primary/70" />
                Pergunta de Diagnóstico
              </h3>
              {compatibility ? (
                <span className={`${compatibility.className} shrink-0`}>
                  {compatibility.label.includes("Avançado") ? (
                    <AlertCircle className="size-3 mr-0.5" />
                  ) : null}
                  {compatibility.label}
                </span>
              ) : null}
            </div>
            
            <div className="flex-1 overflow-y-auto text-xs text-foreground leading-relaxed flex flex-col gap-3 font-mono">
              <p className="whitespace-pre-wrap">{parsedQ.mainPrompt}</p>
              
              {/* Hint System */}
              {!hintRevealed ? (
                <div className="pt-2">
                  {!showHintConfirm ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setShowHintConfirm(true)}
                      className="h-7 text-3xs font-mono uppercase tracking-wider rounded-none border border-amber-500/30 hover:border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    >
                      Pedir Dica
                    </Button>
                  ) : (
                    <div className="p-3 border border-amber-500/30 bg-amber-500/5 flex flex-col gap-2 rounded-none animate-in fade-in slide-in-from-top-1 duration-150">
                      <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-normal">
                        Pedir uma dica limitará seu ganho máximo para +7 ELO neste desafio. Revelar dica?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="xs"
                          onClick={() => {
                            setUsedHint(true);
                            setHintRevealed(true);
                            setShowHintConfirm(false);
                          }}
                          className="h-6 text-[10px] px-2 rounded-none bg-amber-600 hover:bg-amber-700 text-white font-mono uppercase"
                        >
                          Sim, revelar
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => setShowHintConfirm(false)}
                          className="h-6 text-[10px] px-2 rounded-none text-muted-foreground font-mono uppercase"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2 p-3 border border-border bg-muted/20 rounded-none animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-3xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                    <AlertCircle className="size-3" />
                    <span>Dica Ativada (Ganho de ELO limitado a +7)</span>
                  </div>
                  <p className="whitespace-pre-wrap text-2xs text-muted-foreground leading-normal">
                    {parsedQ.hintText}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section (60% height): Interactive Input Area / Loading / Feedback */}
          <div className="row-span-1 min-h-0 flex flex-col overflow-hidden">
            {submitting && !result ? (
              <div className="flex-1 flex flex-col border border-border bg-card p-5 items-center justify-center text-center gap-3 h-full">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <p className="text-xs font-medium text-foreground">
                  Analisando sua resposta com base na rubrica sênior…
                </p>
                <p className="text-3xs text-muted-foreground">
                  Evite recarregar a página durante o processamento.
                </p>
              </div>
            ) : !result ? (
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col border border-border bg-card p-4 gap-3 justify-between min-h-0"
              >
                <div className="gap-2 flex-1 flex flex-col min-h-0">
                  <div className="shrink-0">
                    <h3 className="text-xs font-semibold uppercase tracking-wider">
                      Seu Diagnóstico Técnico
                    </h3>
                    <p className="text-3xs text-muted-foreground mt-0.5">
                      Escreva detalhadamente o erro de lógica e como consertá-lo.
                    </p>
                  </div>

                  <div className="flex-1 min-h-0 flex flex-col">
                    <textarea
                      placeholder="Explique o bug aqui…"
                      aria-label="Resposta do diagnóstico técnico"
                      className="w-full flex-1 rounded-none border border-border/50 bg-muted/30 hover:bg-muted/45 focus:bg-muted/60 p-3 text-xs outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-0 font-mono resize-none leading-relaxed transition-colors duration-150 min-h-0"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      readOnly={answerLocked}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-border shrink-0 flex flex-col gap-1.5">
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full h-9 rounded-none font-mono uppercase text-xs"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        Analisando Resposta…
                      </>
                    ) : (
                      <>
                        <Play className="size-3 mr-1.5 fill-current" />
                        Enviar Diagnóstico
                      </>
                    )}
                  </Button>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono px-1">
                    <span>
                      {answerLength}/{MIN_ANSWER_LENGTH} caracteres mínimos
                    </span>
                    <span>
                      Ctrl + Enter para enviar
                    </span>
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex-1 border border-border bg-card p-4 gap-4 flex flex-col justify-between overflow-y-auto min-h-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-muted/30 border border-border p-3 shrink-0">
                    <div>
                      <span className="text-4xs font-mono uppercase text-muted-foreground">
                        Avaliação Final
                      </span>
                      <div className="text-lg font-mono font-semibold text-foreground mt-0.5">
                        {result.score.toFixed(1)}/10
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-4xs font-mono uppercase text-muted-foreground">
                        Variação Rating
                      </span>
                      <div className="mt-0.5">
                        {result.eloChange > 0 ? (
                          <span className="text-emerald-500 font-semibold font-mono text-sm inline-flex items-center gap-0.5">
                            <ArrowUpRight className="size-4" />+{result.eloChange} ELO
                          </span>
                        ) : result.eloChange < 0 ? (
                          <span className="text-rose-500 font-semibold font-mono text-sm inline-flex items-center gap-0.5">
                            <ArrowDownRight className="size-4" />
                            {result.eloChange} ELO
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-semibold font-mono text-xs inline-flex items-center gap-1">
                            <AlertCircle className="size-3.5" />
                            Sem alteração (re-tentativa)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-3xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="size-3 text-emerald-500" />
                      Feedback do Tech Lead
                    </h4>
                    <p className="text-xs text-foreground italic leading-relaxed bg-muted/10 p-2.5 border border-border/60">
                      "{result.feedback.summary}"
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-3xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Pontos Fortes
                    </h4>
                    <ul className="space-y-1 pl-1">
                      {result.feedback.strengths.map(str => (
                        <li
                          key={str}
                          className="text-2xs text-foreground flex items-start gap-1.5 leading-relaxed"
                        >
                          <span className="text-emerald-500 font-semibold shrink-0">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-3xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Pontos Cegos
                    </h4>
                    <ul className="space-y-1 pl-1">
                      {result.feedback.blindspots.map(blind => (
                        <li
                          key={blind}
                          className="text-2xs text-foreground flex items-start gap-1.5 leading-relaxed"
                        >
                          <span className="text-rose-500 font-semibold shrink-0">•</span>
                          <span>{blind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setShowComparison(!showComparison)}
                      className="w-full flex justify-between items-center h-8 rounded-none font-mono text-[10px]"
                    >
                      <span>
                        {showComparison
                          ? "Ocultar Solução Sênior"
                          : "Comparar com Solução Sênior"}
                      </span>
                      {showComparison ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </Button>

                    {showComparison && (
                      <div className="mt-3 p-3 border border-border bg-background/50 space-y-3 animate-in slide-in-from-top-1 duration-150 text-2xs leading-relaxed max-h-48 overflow-y-auto">
                        <div className="space-y-1">
                          <span className="font-semibold text-muted-foreground font-mono">
                            Sua Resposta:
                          </span>
                          <p className="font-mono text-muted-foreground whitespace-pre-wrap italic">
                            "{userAnswer}"
                          </p>
                        </div>
                        <div className="border-t border-border/40 my-2" />
                        <div className="space-y-1">
                          <span className="font-semibold text-primary font-mono">
                            Solução de Referência:
                          </span>
                          <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
                            {result.feedback.seniorSolution}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setResult(null);
                      setUserAnswer("");
                      setAnswerLocked(false);
                      setShowComparison(false);
                    }}
                    className="flex-1 h-9 rounded-none font-mono uppercase text-xs"
                  >
                    Tentar Novamente
                  </Button>
                  <Link href="/challenges" className="flex-1">
                    <Button className="w-full h-9 rounded-none font-mono uppercase text-xs">
                      Concluir Arena
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
