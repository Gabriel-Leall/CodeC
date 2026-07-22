"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";

export default function RecuperarSenhaPage() {
  const [success, setSuccess] = useState(false);

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            E-mail enviado!
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enviamos as instruções de recuperação para seu e-mail.
          </p>
        </div>

        <Link href="/login">
          <Button
            variant="outline"
            className="w-full text-black/80"
          >
            Voltar ao login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Recuperar senha
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <Input
              id="email"
              type="email"
              placeholder="voce@empresa.com"
              className="pl-9"
            />
          </div>
        </div>

        <Button
          type="button"
          className="w-full bg-violet-600 hover:bg-violet-700"
          onClick={() => setSuccess(true)}
        >
          Enviar link de recuperação
        </Button>
      </form>

      <Link
        href="/login"
        className="block text-center text-sm text-violet-600 hover:text-violet-500"
      >
        Voltar para o login
      </Link>
    </div>
  );
}