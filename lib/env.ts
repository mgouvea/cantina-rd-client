import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_API: z.string().url("URL da API inválida"),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_APP_API: process.env.NEXT_PUBLIC_APP_API,
});

if (!parsedEnv.success) {
  console.error("❌ Erro nas variáveis de ambiente:", parsedEnv.error.format());
  throw new Error("Configuração de ambiente inválida");
}

export const env = parsedEnv.data;
