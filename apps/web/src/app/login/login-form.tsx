"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";

import { cn } from "@kodan/ui/lib/utils";

import { authClient } from "@/lib/auth-client";
import type { AuthMode } from "@/lib/auth-navigation";

export function LoginForm({
  initialMode,
  callbackURL,
}: {
  initialMode: AuthMode;
  callbackURL: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    const result =
      mode === "register"
        ? await authClient.signUp.email({ name: name.trim(), email, password })
        : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(
        result.error.message ??
          (mode === "register"
            ? "Não foi possível criar sua conta."
            : "E-mail ou senha inválidos."),
      );
      setPending(false);
      return;
    }

    router.push(callbackURL as Route);
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <Link href="/challenges" className="inline-flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">⛩</span>
          <span className="font-serif text-2xl font-bold tracking-widest text-[var(--profile-text-primary)]">
            KODAN
          </span>
        </Link>
        <p className="mt-3 text-sm leading-6 text-[var(--profile-text-secondary)]">
          Entre para salvar seu progresso, receber avaliações e evoluir seu ELO.
        </p>
      </div>

      <section className="rounded-2xl border border-[color:var(--profile-border)] bg-[var(--profile-surface)] p-6 shadow-[var(--profile-shadow-md)] sm:p-8">
        <div className="grid grid-cols-2 rounded-xl bg-[var(--profile-surface-elevated)] p-1" aria-label="Tipo de acesso">
          {(["login", "register"] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={mode === item}
              className={cn(
                "min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors",
                mode === item
                  ? "bg-[var(--profile-surface)] text-[var(--profile-text-primary)] shadow-sm"
                  : "text-[var(--profile-text-secondary)] hover:text-[var(--profile-text-primary)]",
              )}
              onClick={() => {
                setMode(item);
                setError(null);
              }}
            >
              {item === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <div className="mt-7">
          <h1 className="font-serif text-2xl font-bold text-[var(--profile-text-primary)]">
            {mode === "register" ? "Comece sua jornada" : "Bem-vindo de volta"}
          </h1>
          <p className="mt-2 text-sm text-[var(--profile-text-secondary)]">
            {mode === "register"
              ? "Crie seu perfil para enviar diagnósticos e acompanhar sua evolução."
              : "Continue de onde parou no Dojo."}
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label className="block text-sm font-medium text-[var(--profile-text-primary)]">
              Nome
              <input
                required
                autoComplete="name"
                value={name}
                className="mt-2 h-11 w-full rounded-lg border border-[color:var(--profile-border)] bg-[var(--profile-bg)] px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--profile-accent-blue)]"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-[var(--profile-text-primary)]">
            E-mail
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              className="mt-2 h-11 w-full rounded-lg border border-[color:var(--profile-border)] bg-[var(--profile-bg)] px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--profile-accent-blue)]"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-[var(--profile-text-primary)]">
            Senha
            <input
              required
              type="password"
              minLength={8}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              value={password}
              className="mt-2 h-11 w-full rounded-lg border border-[color:var(--profile-border)] bg-[var(--profile-bg)] px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--profile-accent-blue)]"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? (
            <p role="alert" className="rounded-lg bg-[var(--challengers-danger-soft)] px-3 py-2 text-sm text-[var(--profile-danger)]">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--profile-accent-blue)] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-65"
          >
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : mode === "register" ? <UserPlus className="size-4" aria-hidden="true" /> : <LogIn className="size-4" aria-hidden="true" />}
            {pending ? "Aguarde..." : mode === "register" ? "Criar conta" : "Entrar"}
          </button>
        </form>
      </section>

      <p className="mt-5 text-center text-sm text-[var(--profile-text-secondary)]">
        <Link href="/challenges" className="font-medium text-[var(--profile-accent-blue)] hover:underline">
          Continuar explorando sem conta
        </Link>
      </p>
    </div>
  );
}
