import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    AUTH_SECRET: z.string().min(16),
    AUTH_TRUST_HOST: z.coerce.boolean().default(true),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    OPENAI_API_KEY: z.string().min(1),
    OPENCORPORATES_API_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default("AI Pipeline Intel"),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENCORPORATES_API_TOKEN: process.env.OPENCORPORATES_API_TOKEN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
