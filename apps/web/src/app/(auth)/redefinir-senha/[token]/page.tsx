"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";

export default function RedefinirSenhaPage() {
  const [showPwd, setShowPwd] = useState(false);
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
            Senha redefinida!
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Sua senha foi alterada com sucesso.
          </p>
        </div>

        <Link href="/login">
          <Button className="w-full">
            Ir para o login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Redefinir senha
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Escolha uma nova senha para sua conta.
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">
            Nova senha
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
            />

            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPwd ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">
            Confirmar nova senha
          </Label>

          <Input
            id="confirmPassword"
            type={showPwd ? "text" : "password"}
            placeholder="Repita a senha"
          />
        </div>

        <Button
          type="button"
          className="w-full bg-violet-600 hover:bg-violet-700"
          onClick={() => setSuccess(true)}
        >
          Redefinir senha
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