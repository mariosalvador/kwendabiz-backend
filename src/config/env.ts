import z from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().default(""),
})

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;