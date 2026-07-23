"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {authClient} from "@/lib/auth-client"

const registerSchema = z
  .object({
    name: z.string().min(3, "Informe seu nome"),
    email: z.email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function CadastroPage() {
  const [showPwd, setShowPwd] = useState(false);
  const router = useRouter()

  const {
  register,
  handleSubmit,
  formState: { errors },
  } = useForm<RegisterForm>({
  resolver: zodResolver(registerSchema),
  });

  async function onSubmit (formData: RegisterForm) {
  console.log(formData); 

  const {data, error} = await authClient.signUp.email({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    callbackURL: "/dashboard"
  }, 
  {onRequest: (ctx)=> {

  }, 
  onSuccess: (ctx)=> {
    console.log("cadastrado", ctx)
    router.replace("/dashboard")
  },
  onError:(ctx)=>{
    console.log("ERRO AO CRIAR CONTA")
    console.log(ctx)
  }})
};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Criar sua conta
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-600 hover:text-violet-500"
          >
            Entrar
          </Link>
        </p>
      </div>

      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            placeholder="João Silva"
            {...register("name")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail corporativo</Label>
          <Input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            {...register("email")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>

          <div className="relative">
            <Input
              id="password"
              type={showPwd ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
          <Label htmlFor="confirmPassword">Confirmar senha</Label>

          <Input
            id="confirmPassword"
            type={showPwd ? "text" : "password"}
            placeholder="Repita a senha"
            {...register("confirmPassword")}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700"
          onClick={handleSubmit(onSubmit)}
        >
          Criar conta
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400">
        Ao criar uma conta você concorda com nossos{" "}
        <a
          href="#"
          className="text-violet-600 hover:underline"
        >
          Termos de Uso
        </a>{" "}
        e{" "}
        <a
          href="#"
          className="text-violet-600 hover:underline"
        >
          Política de Privacidade
        </a>
        .
      </p>
    </div>
  );
}