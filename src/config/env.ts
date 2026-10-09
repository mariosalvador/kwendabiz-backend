import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
})

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;