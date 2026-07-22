"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/button";

export default function VerificarEmailPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verifique seu e-mail
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Enviamos um link de confirmação para seu e-mail.
          <br />
          Clique no link para ativar sua conta.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-xs text-amber-700">
        <p className="font-semibold">
          Não recebeu o e-mail?
        </p>

        <p className="mt-1">
          Verifique a pasta de spam. O link expira em 24 horas.
        </p>
      </div>

      {sent ? (
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          E-mail reenviado com sucesso!
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full text-black/80"
          onClick={() => setSent(true)}
        >
          Reenviar e-mail
        </Button>
      )}

      <Link
        href="/login"
        className="block text-sm text-blue-600 hover:text-blue-500"
      >
        Voltar para o login
      </Link>
    </div>
  );
}