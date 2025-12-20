import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_API: z.string().url("URL da API inválida"),
  NEXT_PUBLIC_APP_EMAIL_LOGIN: z.string().email("Email de login inválido"),
  NEXT_PUBLIC_APP_PASSWORD_LOGIN: z.string().min(1, "Senha de login não pode ser vazia"),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_APP_API: process.env.NEXT_PUBLIC_APP_API,
  NEXT_PUBLIC_APP_EMAIL_LOGIN: process.env.NEXT_PUBLIC_APP_EMAIL_LOGIN,
  NEXT_PUBLIC_APP_PASSWORD_LOGIN: process.env.NEXT_PUBLIC_APP_PASSWORD_LOGIN,
});

if (!parsedEnv.success) {
  console.error("❌ Erro nas variáveis de ambiente:", parsedEnv.error.format());
  throw new Error("Configuração de ambiente inválida");
}

export const env = parsedEnv.data;
