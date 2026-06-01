"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";

export default function EntryGate() {
  const { push } = useRouter();
  const [answer, setAnswer] = useState("");
  const [shake, setShake] = useState(false);

  const openPortal = () => {
    if (!answer.trim()) {
      setShake(true);
      window.setTimeout(() => setShake(false), 420);
      return;
    }
    document.cookie = "dojo_gate_seen=1; path=/; max-age=31536000; samesite=lax";
    push("/challenges");
  };

  return (
    <section
      data-entry-gate="true"
      className="relative isolate flex-1 min-h-svh overflow-hidden bg-[#f5f2e9] px-4 py-10 text-[#1b1c19] md:px-8 md:py-14 dark:bg-[#0c0c0c] dark:text-[#f2f1ec]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-0" style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(27,28,25,0.05) 0px, rgba(27,28,25,0.05) 1px, transparent 1px, transparent 8px)",
      }} />
      <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100" style={{
        backgroundImage:
          'radial-gradient(circle at 50% 50%, rgba(143, 0, 13, 0.08) 0%, transparent 52%), url("https://www.transparenttextures.com/patterns/dark-matter.png")',
      }} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 size-80 rounded-full bg-[#8f000d]/10 blur-[120px] dark:bg-[#8f000d]/18" />
        <div className="absolute bottom-1/4 right-1/4 size-80 rounded-full bg-[#8f000d]/10 blur-[120px] dark:bg-[#8f000d]/18" />
        <div className="absolute -bottom-6 left-6 select-none text-[96px] leading-none text-[#1b1c19]/8 dark:text-[#f2f1ec]/5">師</div>
        <div className="absolute top-6 right-6 select-none text-[96px] leading-none text-[#1b1c19]/8 dark:text-[#f2f1ec]/5">剣</div>
      </div>

      <div className="absolute right-4 top-4 z-20 rounded-sm border border-[#8e706d]/35 bg-[#f5f2e9]/80 dark:bg-[#0c0c0c]/70">
        <ModeToggle />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center py-6 md:py-10">
        <header className="mb-12 text-center md:mb-14">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-[#1b1c19] md:text-6xl dark:text-[#ffc8c2] dark:drop-shadow-[0_0_10px_rgba(143,0,13,0.35)]">
            Dojo Code
          </h1>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="inline-block h-[2px] w-20 bg-[#8f000d]/70 md:w-24 dark:bg-[#8f000d]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8f000d]/85 dark:text-[#b52424]">
              O Portão do Dojo
            </span>
            <span className="inline-block h-[2px] w-20 bg-[#8f000d]/70 md:w-24 dark:bg-[#8f000d]" />
          </div>
        </header>

        <section
          className={`relative w-full max-w-[700px] border border-[#c9b3ad]/55 bg-gradient-to-br from-[#f9f6ef] to-[#efe8db] p-6 shadow-[0_12px_34px_rgba(27,28,25,0.14)] md:p-10 dark:border-[#8e706d]/35 dark:from-[#161616] dark:to-[#0e0e0e] dark:shadow-[0_0_40px_rgba(0,0,0,0.45)] ${shake ? "animate-[dojo-shake_0.2s_ease-in-out_0s_2]" : ""}`}
        >
          <div className="absolute right-4 top-4 flex size-8 items-center justify-center bg-[#8f000d] font-serif text-lg font-bold text-white shadow-[0_0_10px_rgba(143,0,13,0.35)]">
            道
          </div>

          <div className="space-y-7">
            <div className="space-y-2">
              <h2 className="text-center font-serif text-2xl text-[#2b2b29] md:text-left dark:text-[#d6d4d4]">
                Prove sua maestria para entrar no Dojo
              </h2>
              <p className="text-center font-sans text-base text-[#474746]/85 md:text-left dark:text-[#c8c6c5]/80">
                O caminho para o código limpo exige olhos atentos. Identifique a falha no pergaminho abaixo.
              </p>
            </div>

            <div className="relative border border-[#c9b3ad]/50 bg-[#f0ece4] p-5 font-mono text-sm text-[#2f2f2c] dark:border-[#8e706d]/25 dark:bg-[#1a1a1a] dark:text-[#d6d4d4]">
              <div className="absolute left-0 top-0 h-full w-1 bg-[#8f000d]" />
              <pre className="whitespace-pre-wrap leading-relaxed">
                <span className="italic text-[#8f000d] dark:text-[#b52424]"># O Caminho da Multiplicação</span>{"\n"}
                <span className="text-[#8f000d] dark:text-[#b52424]">const</span> multiply = (a, b) =&gt; {"{"}{"\n"}
                {"  "}
                <span className="text-[#8f000d] dark:text-[#b52424]">return</span> a * b;{"\n"}
                {"};"}{"\n\n"}
                console.log(multiply(<span className="text-[#8e706d]">5</span>, <span className="text-[#8e706d]">10</span>));{" "}
                <span className="italic text-[#5f5e5e]">// Esperado: 50</span>
              </pre>
              <div className="mt-4 border border-dashed border-[#8e706d]/35 bg-[#e9e4d7]/55 p-3 font-mono text-[11px] text-[#5a403e] dark:border-[#8e706d]/30 dark:bg-[#e4e2dd]/5 dark:text-[#c8c6c5]/80">
                SYNTX_ERR: Linha 2 contém uma imperfeição oculta na lógica de execução.
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="gate-answer"
                  className="mb-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-[#8f000d] dark:text-[#b52424]"
                >
                  Onde está o erro?
                </label>
                <input
                  id="gate-answer"
                  value={answer}
                  onChange={event => setAnswer(event.target.value)}
                  placeholder="Digite sua correção aqui..."
                  className={`w-full border-0 border-b bg-transparent px-0 py-3 font-mono text-sm text-[#2f2f2c] placeholder:text-[#5f5e5e]/65 focus:outline-none dark:text-[#d6d4d4] dark:placeholder:text-[#5f5e5e]/60 ${shake ? "border-[#ba1a1a]" : "border-[#8f000d]"}`}
                />
              </div>

              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <button
                  type="button"
                  onClick={openPortal}
                  className="group relative w-full border border-[#8f000d] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8f000d] transition-all hover:bg-[#8f000d] hover:text-white md:w-auto dark:text-[#b52424]"
                >
                  <span className="relative z-10">Abrir o Portal</span>
                  <span className="absolute inset-0 bg-[#8f000d] opacity-0 blur-md transition-opacity group-hover:opacity-10" />
                </button>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5f5e5e]/70 dark:text-[#c8c6c5]/45">
                  <Lock className="size-3.5" />
                  <span>Acesso restrito aos Kyu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 max-w-md text-center">
          <p className="font-mono text-[10px] italic tracking-wide text-[#5f5e5e]/70 dark:text-[#c8c6c5]/45">
            © 2026 Dojo Code, O Caminho da Maestria, Silêncio e Foco
          </p>
        </footer>
      </main>
    </section>
  );
}
