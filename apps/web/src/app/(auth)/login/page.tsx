"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {authClient} from "@/lib/auth-client"
import { useRouter } from "next/navigation";

const loginSchema = z
  .object({
    email: z.email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 6 caracteres"),
  })
  

type LoginFormValues = z.infer<typeof loginSchema>;


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()

  const {
  register,
  handleSubmit,
  formState: { errors },
  } = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  });

  async function onSubmit (formData: LoginFormValues) {
  console.log(formData); 

    await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
      callbackURL: "/dashboard"
    }, 
    {
      onRequest: (ctx)=> {

    }, 
    onSuccess: (ctx)=> {
      console.log("Logado:", ctx)
      router.replace("/dashboard")
    },
    onError:(ctx)=>{
      console.log("ERRO AO LOGAR!!")
      console.log(ctx)
    }
  })
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Entrar na sua conta
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            className="font-medium text-violet-600 hover:text-violet-500"
          >
            Criar conta
          </Link>
        </p>
      </div>

      {/* Card de demonstração */}
      {/* <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-xs text-violet-700">
        <p className="mb-1 font-semibold">
          Credenciais de demonstração:
        </p>

        <p>
          Gestor: <code>ana.souza@empresa.com</code> / <code>123456</code>
        </p>

        <p>
          Colaborador: <code>carlos.lima@empresa.com</code> /{" "}
          <code>123456</code>
        </p>
      </div> */}

      <form className="space-y-4">
        <div className="space-y-1.5 text-black/80">
          <Label htmlFor="email">E-mail</Label>

          <Input
            id="email"
            type="email"
            placeholder="voce@empresa.com"
            {...register("email")}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-black/80">
            <Label htmlFor="password">Senha</Label>

            <Link
              href="/recuperar-senha"
              className="text-xs text-violet-600 hover:text-violet-500"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
            />

            <button
              type="submit"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="button"
          className="w-full bg-[#2783c0] hover:bg-violet-700"
          onClick={handleSubmit(onSubmit)}
        >
          Entrar
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>

        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-400">
            ou continue com
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full rounded"
      >
        <FontAwesomeIcon
          icon={faGoogle}
          className="mr-2 h-4 w-4 text-zinc-500"
        />

        <p className="text-black/60">Entrar com Google</p>
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
      >
        <FontAwesomeIcon
          icon={faGithub}
          className="mr-2 h-4 w-4 text-zinc-500"
        />

        <p className="text-black/60">Entrar com GitHub</p>
      </Button>
    </div>
  );
}