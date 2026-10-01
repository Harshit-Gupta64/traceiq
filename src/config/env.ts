import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env variables into process.env if present
dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  POSTGRES_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  ARTIFACT_STORAGE_PATH: z.string().min(1).default('./.local-artifacts'),
  GITHUB_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates an environment record against the Zod schema.
 * Throws a descriptive Error if validation fails.
 */
export function validateEnv(rawEnv: Record<string, unknown> = process.env): EnvConfig {
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const errorDetails = result.error.errors
      .map((issue) => `  - ${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${errorDetails}`);
  }

  return result.data;
}

let cachedEnv: EnvConfig | null = null;

/**
 * Retrieves the validated environment configuration.
 * Caches the result after first validation.
 */
export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv(process.env);
  }
  return cachedEnv;
}
