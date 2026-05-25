"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  EyeOff
} from "lucide-react";

import { Button } from "@CC/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@CC/ui/components/card";
import { getChallenge, getLocalUser, submitAttempt } from "../../actions";

interface Challenge {
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

export default function TrainArenaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userElo, setUserElo] = useState(1200);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  
  // Submit state
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const [challengeRes, userRes] = await Promise.all([getChallenge(id), getLocalUser()]);

        if (challengeRes.success && challengeRes.data) {
          setChallenge(challengeRes.data);
        } else {
          toast.error(challengeRes.error || "Desafio não encontrado");
          router.push("/dashboard/challenges");
        }

        if (userRes.success && userRes.data) {
          setUserElo(userRes.data.elo);
        }
      } catch (err) {
        toast.error("Erro ao conectar ao servidor");
      } finally {
        setLoadingChallenge(false);
      }
    };
    fetchChallengeData();
  }, [id, router]);

  // Form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitting || answerLocked) {
      return;
    }

    const answerLength = userAnswer.trim().length;
    if (answerLength < MIN_ANSWER_LENGTH) {
      toast.error(`Escreva pelo menos ${MIN_ANSWER_LENGTH} caracteres para enviar.`);
      return;
    }

    setAnswerLocked(true);
    setSubmitting(true);
    try {
      const res = await submitAttempt(id, userAnswer);
      if (res.success && res.data) {
        setResult(res.data as any);
        toast.success("Diagnóstico avaliado com sucesso!");
      } else {
        setAnswerLocked(false);
        toast.error(res.error || "Erro ao avaliar resposta");
      }
    } catch (err) {
      setAnswerLocked(false);
      toast.error("Erro ao enviar resposta para correção");
    } finally {
      setSubmitting(false);
    }
  };

  // Keyboard shortcut Ctrl + Enter handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (loadingChallenge) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <p className="text-xs text-muted-foreground font-mono">Montando arena de treino...</p>
      </div>
    );
  }

  if (!challenge) return null;

  const lines = challenge.code.split("\n");
  const answerLength = userAnswer.trim().length;
  const canSubmit = !submitting && !answerLocked && answerLength >= MIN_ANSWER_LENGTH;

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

  return (
    <div className="flex-1 w-full bg-background/50 flex flex-col max-w-7xl mx-auto p-4 md:p-6 space-y-4 animate-in fade-in duration-300">
      
      {/* Top Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Link href="/dashboard/challenges">
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

      {/* Main Split Screen Area */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 flex-1 items-stretch">
        
        {/* Left Column (60% width) - Static Code and Question */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* React Code Viewer */}
          <div className="flex-1 flex flex-col min-h-[350px] border border-border bg-card">
            <div className="bg-muted/30 border-b border-border px-4 py-2 flex items-center justify-between">
              <span className="text-3xs font-mono font-bold text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="size-3.5" />
                CÓDIGO REACT COMPONENTE
              </span>
              <span className="text-4xs font-mono bg-muted/80 border border-border px-1.5 uppercase font-bold text-foreground">
                {getDifficultyLabel(challenge.difficulty)}
              </span>
            </div>
            
            <div className="flex-1 flex font-mono text-[11px] leading-relaxed overflow-auto select-text bg-muted/5 h-[400px]">
              {/* Line Numbers column */}
              <div className="py-4 pl-3 pr-2 text-right text-muted-foreground/35 border-r border-border select-none bg-muted/10 font-bold w-10">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Actual Code block */}
              <pre className="py-4 px-3 overflow-x-auto flex-1 text-foreground whitespace-pre leading-5">
                <code>{challenge.code}</code>
              </pre>
            </div>
          </div>

          {/* Question Card */}
          <Card className="border-border rounded-none bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                <HelpCircle className="size-3.5" />
                Pergunta de Diagnóstico
              </CardTitle>
              {compatibility ? (
                <CardDescription>
                  <span className={compatibility.className}>
                    {compatibility.label.includes("Avançado") ? <AlertCircle className="size-3" /> : null}
                    {compatibility.label}
                  </span>
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent>
              <p className="text-xs font-semibold text-foreground leading-relaxed">
                {challenge.question}
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (40% width) - Dynamic State Panel */}
        <div className="lg:col-span-4 flex flex-col">
          
          {submitting && !result ? (
            <div className="flex-1 flex flex-col border border-border bg-card p-5 items-center justify-center text-center gap-3">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                Analisando sua resposta com base na rubrica sênior...
              </p>
              <p className="text-3xs text-muted-foreground">
                Evite recarregar a página durante o processamento.
              </p>
            </div>
          ) : !result ? (
            /* STATE 1: ANSWER FORM INPUT */
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col border border-border bg-card p-5 space-y-4 justify-between h-full">
              
              <div className="space-y-3 flex-1 flex flex-col">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider">Seu Diagnóstico Técnico</h3>
                  <p className="text-3xs text-muted-foreground mt-0.5">
                    Escreva detalhadamente o erro de lógica e como consertá-lo.
                  </p>
                </div>

                <div className="flex-1 flex flex-col min-h-[200px]">
                  <textarea
                    placeholder="Explique o bug aqui... (Pressione Ctrl + Enter para enviar imediatamente)"
                    className="w-full flex-1 min-h-[220px] rounded-none border border-input bg-transparent p-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring/50 font-mono resize-none leading-relaxed"
                    value={userAnswer}
                    onChange={e => setUserAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    readOnly={answerLocked}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button type="submit" disabled={!canSubmit} className="w-full h-9 rounded-none font-mono uppercase text-xs">
                  {submitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin mr-1.5" />
                      Analisando Resposta...
                    </>
                  ) : (
                    <>
                      <Play className="size-3 mr-1.5 fill-current" />
                      Enviar Diagnóstico
                    </>
                  )}
                </Button>
                <span className="text-[10px] text-center text-muted-foreground font-mono">
                  {answerLength}/{MIN_ANSWER_LENGTH} caracteres mínimos
                </span>
                <span className="text-[10px] text-center text-muted-foreground font-mono">
                  Ctrl + Enter para enviar imediatamente
                </span>
              </div>

            </form>
          ) : (
            /* STATE 2: AI FEEDBACK REPORT */
            <div className="flex-1 border border-border bg-card p-5 space-y-4 flex flex-col justify-between overflow-y-auto max-h-[75vh]">
              
              <div className="space-y-4">
                {/* Result header score/elo */}
                <div className="flex justify-between items-center bg-muted/30 border border-border p-3">
                  <div>
                    <span className="text-4xs font-mono uppercase text-muted-foreground">Avaliação Final</span>
                    <div className="text-lg font-mono font-bold text-foreground mt-0.5">
                      {result.score.toFixed(1)}/10
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-4xs font-mono uppercase text-muted-foreground">Variação Rating</span>
                    <div className="mt-0.5">
                      {result.eloChange > 0 ? (
                        <span className="text-emerald-500 font-bold font-mono text-sm inline-flex items-center gap-0.5">
                          <ArrowUpRight className="size-4" />
                          +{result.eloChange} ELO
                        </span>
                      ) : result.eloChange < 0 ? (
                        <span className="text-rose-500 font-bold font-mono text-sm inline-flex items-center gap-0.5">
                          <ArrowDownRight className="size-4" />
                          {result.eloChange} ELO
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-bold font-mono text-xs inline-flex items-center gap-1">
                          <AlertCircle className="size-3.5" />
                          Sem alteração (re-tentativa)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Summary review */}
                <div className="space-y-1">
                  <h4 className="text-3xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    Feedback do Tech Lead
                  </h4>
                  <p className="text-xs text-foreground italic leading-relaxed bg-muted/10 p-2.5 border border-border/60">
                    "{result.feedback.summary}"
                  </p>
                </div>

                {/* Strengths bullet points */}
                <div className="space-y-1.5">
                  <h4 className="text-3xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Pontos Fortes
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {result.feedback.strengths.map((str, idx) => (
                      <li key={idx} className="text-2xs text-foreground flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 font-bold shrink-0">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Blindspots bullet points */}
                <div className="space-y-1.5">
                  <h4 className="text-3xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Pontos Cegos
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {result.feedback.blindspots.map((blind, idx) => (
                      <li key={idx} className="text-2xs text-foreground flex items-start gap-1.5 leading-relaxed">
                        <span className="text-rose-500 font-bold shrink-0">•</span>
                        <span>{blind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Collapsible Comparison panel */}
                <div className="pt-2 border-t border-border/40">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setShowComparison(!showComparison)}
                    className="w-full flex justify-between items-center h-8 rounded-none font-mono text-[10px]"
                  >
                    <span>{showComparison ? "Ocultar Solução Sênior" : "Comparar com Solução Sênior"}</span>
                    {showComparison ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </Button>

                  {showComparison && (
                    <div className="mt-3 p-3 border border-border bg-background/50 space-y-3 animate-in slide-in-from-top-1 duration-150 text-2xs leading-relaxed max-h-48 overflow-y-auto">
                      <div className="space-y-1">
                        <span className="font-bold text-muted-foreground font-mono">Sua Resposta:</span>
                        <p className="font-mono text-muted-foreground whitespace-pre-wrap italic">
                          "{userAnswer}"
                        </p>
                      </div>
                      <div className="border-t border-border/40 my-2" />
                      <div className="space-y-1">
                        <span className="font-bold text-primary font-mono">Solução de Referência:</span>
                        <div className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
                          {result.feedback.seniorSolution}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-border flex gap-2">
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
                <Link href="/dashboard/challenges" className="flex-1">
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
  );
}
