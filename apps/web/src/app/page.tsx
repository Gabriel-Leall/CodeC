"use client";

import Link from "next/link";
import { Button } from "@CC/ui/components/button";
import { Brain, ShieldAlert, Cpu, Sparkles, ChevronRight, GraduationCap } from "lucide-react";

const TITLE_TEXT = `
  ██████╗ ██████╗ ████████╗
 ██╔════╝██╔═══██╗╚══██╔══╝
 ██║     ██║   ██║   ██║   
 ██║     ██║   ██║   ██║   
 ╚██████╗╚██████╔╝   ██║   
  ╚═════╝ ╚═════╝    ╚═╝   
                           
  CODE COMPREHENSION TRAINER
`;

export default function Home() {
  return (
    <div className="flex-1 w-full bg-background flex flex-col justify-center items-center py-12 px-4 md:px-8 max-w-5xl mx-auto gap-12 animate-in fade-in duration-500">
      
      {/* ASCII Art Hero */}
      <div className="text-center w-full flex flex-col items-center">
        <pre className="overflow-x-auto font-mono text-[9px] sm:text-xs md:text-sm leading-tight text-primary/80 select-none max-w-full">
          {TITLE_TEXT}
        </pre>
        <p className="text-xs text-muted-foreground max-w-md mt-6">
          Treine sua mente para ler, interpretar e diagnosticar problemas complexos em código React alheio. Receba avaliações inteligentes e suba seu ELO técnico.
        </p>
      </div>

      {/* Call to Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto h-10 px-6 font-semibold">
            Entrar na Arena
            <ChevronRight className="size-4 ml-1.5" />
          </Button>
        </Link>
        <Link href="/dashboard/challenges" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-10 px-6">
            Ver Desafios
          </Button>
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-6">
        
        <div className="border border-border bg-card p-5 space-y-3 relative group hover:border-foreground/20 transition-colors rounded-none">
          <div className="size-8 bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <Brain className="size-4" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider">Leitura Ativa</h3>
          <p className="text-2xs text-muted-foreground">
            O objetivo não é escrever código. É diagnosticar bugs reais, race conditions e stale closures com base na leitura e análise estrutural.
          </p>
        </div>

        <div className="border border-border bg-card p-5 space-y-3 relative group hover:border-foreground/20 transition-colors rounded-none">
          <div className="size-8 bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <GraduationCap className="size-4" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider">Rating por ELO</h3>
          <p className="text-2xs text-muted-foreground">
            Sua habilidade real é medida por ELO, semelhante ao xadrez. Ganhe pontos ao resolver com excelência ou perca pontos se o diagnóstico for crítico.
          </p>
        </div>

        <div className="border border-border bg-card p-5 space-y-3 relative group hover:border-foreground/20 transition-colors rounded-none">
          <div className="size-8 bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <Sparkles className="size-4" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider">Avaliação Tech Lead</h3>
          <p className="text-2xs text-muted-foreground">
            Uma IA sênior analisa semanticamente sua explicação textual, mapeando pontos fortes, pontos cegos e comparando-a com uma solução sênior ideal.
          </p>
        </div>

        <div className="border border-border bg-card p-5 space-y-3 relative group hover:border-foreground/20 transition-colors rounded-none">
          <div className="size-8 bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <Cpu className="size-4" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider">Desafios Reais</h3>
          <p className="text-2xs text-muted-foreground">
            Exercícios práticos focados em React (useEffect, loops infinitos, closures stale, dependências de objeto, e condições de corrida).
          </p>
        </div>

        <div className="border border-border bg-card p-5 space-y-3 relative group hover:border-foreground/20 transition-colors rounded-none">
          <div className="size-8 bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <ShieldAlert className="size-4" />
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider">Resiliência Total</h3>
          <p className="text-2xs text-muted-foreground">
            Tratamento de instabilidades com fallback offline e limpeza de strings para garantir processamento fluido das respostas.
          </p>
        </div>

        <div className="border border-border bg-card p-5 gap-3 relative group hover:border-foreground/20 transition-colors flex flex-col justify-center items-center text-center rounded-none">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">STATUS DO SISTEMA</span>
          <div className="flex items-center gap-1.5 mt-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Arena Pronta
          </div>
        </div>

      </div>

    </div>
  );
}
