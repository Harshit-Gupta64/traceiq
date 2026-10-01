import { describe, it, expect } from 'vitest';
import { validateEnv, envSchema } from '../../src/config/env.js';

describe('Environment Configuration Validation', () => {
  const validBaseEnv = {
    DATABASE_URL: 'postgresql://traceiq:traceiq_local_only@localhost:5432/traceiq',
  };

  describe('Passing cases', () => {
    it('successfully validates when all required and optional fields are provided', () => {
      const fullEnv = {
        NODE_ENV: 'production',
        PORT: '8080',
        LOG_LEVEL: 'warn',
        POSTGRES_PORT: '5432',
        DATABASE_URL: 'postgresql://prod_user:secret@db.traceiq.internal:5432/traceiq_prod',
        ARTIFACT_STORAGE_PATH: '/data/artifacts',
        GITHUB_WEBHOOK_SECRET: 'test-secret-12345',
      };

      const parsed = validateEnv(fullEnv);

      expect(parsed).toEqual({
        NODE_ENV: 'production',
        PORT: 8080,
        LOG_LEVEL: 'warn',
        POSTGRES_PORT: 5432,
        DATABASE_URL: 'postgresql://prod_user:secret@db.traceiq.internal:5432/traceiq_prod',
        ARTIFACT_STORAGE_PATH: '/data/artifacts',
        GITHUB_WEBHOOK_SECRET: 'test-secret-12345',
      });
    });

    it('applies standard defaults when optional fields are omitted', () => {
      const parsed = validateEnv(validBaseEnv);

      expect(parsed.NODE_ENV).toBe('development');
      expect(parsed.PORT).toBe(3000);
      expect(parsed.LOG_LEVEL).toBe('info');
      expect(parsed.POSTGRES_PORT).toBe(5432);
      expect(parsed.ARTIFACT_STORAGE_PATH).toBe('./.local-artifacts');
      expect(parsed.GITHUB_WEBHOOK_SECRET).toBeUndefined();
    });

    it('coerces string port to integer', () => {
      const parsed = validateEnv({
        ...validBaseEnv,
        PORT: '4000',
      });

      expect(parsed.PORT).toBe(4000);
      expect(typeof parsed.PORT).toBe('number');
    });

    it('accepts valid NODE_ENV options', () => {
      const dev = validateEnv({ ...validBaseEnv, NODE_ENV: 'development' });
      const test = validateEnv({ ...validBaseEnv, NODE_ENV: 'test' });
      const prod = validateEnv({ ...validBaseEnv, NODE_ENV: 'production' });

      expect(dev.NODE_ENV).toBe('development');
      expect(test.NODE_ENV).toBe('test');
      expect(prod.NODE_ENV).toBe('production');
    });
  });

  describe('Failing cases', () => {
    it('fails when DATABASE_URL is missing', () => {
      expect(() => validateEnv({})).toThrowError(/DATABASE_URL/);
    });

    it('fails when DATABASE_URL is not a valid URL', () => {
      expect(() =>
        validateEnv({
          DATABASE_URL: 'not-a-valid-url',
        }),
      ).toThrowError(/DATABASE_URL must be a valid URL/);
    });

    it('fails when PORT is out of valid range (0 or > 65535)', () => {
      expect(() =>
        validateEnv({
          ...validBaseEnv,
          PORT: '0',
        }),
      ).toThrowError(/PORT/);

      expect(() =>
        validateEnv({
          ...validBaseEnv,
          PORT: '70000',
        }),
      ).toThrowError(/PORT/);
    });

    it('fails when PORT is non-numeric', () => {
      expect(() =>
        validateEnv({
          ...validBaseEnv,
          PORT: 'not-a-number',
        }),
      ).toThrowError(/PORT/);
    });

    it('fails when NODE_ENV is invalid', () => {
      expect(() =>
        validateEnv({
          ...validBaseEnv,
          NODE_ENV: 'staging',
        }),
      ).toThrowError(/NODE_ENV/);
    });

    it('fails when LOG_LEVEL is invalid', () => {
      expect(() =>
        validateEnv({
          ...validBaseEnv,
          LOG_LEVEL: 'verbose',
        }),
      ).toThrowError(/LOG_LEVEL/);
    });

    it('returns structured issues in error message', () => {
      expect(() => validateEnv({})).toThrowError(
        /Environment validation failed:\n {2}- DATABASE_URL:/,
      );
    });
  });

  describe('Direct Schema parsing', () => {
    it('exposes envSchema for direct safeParse verification', () => {
      const result = envSchema.safeParse(validBaseEnv);
      expect(result.success).toBe(true);
    });
  });
});
