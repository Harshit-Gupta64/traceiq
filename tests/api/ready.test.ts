import { describe, it, expect } from 'vitest';
import { buildApp } from '../../src/api/app.js';

describe('GET /api/v1/ready (Unit)', () => {
  it('returns HTTP 200 when database health check succeeds', async () => {
    const app = buildApp({
      checkDbHealth: async () => true,
      logger: false,
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ready',
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toEqual({
      status: 'ready',
      database: 'connected',
    });

    await app.close();
  });

  it('returns HTTP 503 when database health check reports failure', async () => {
    const app = buildApp({
      checkDbHealth: async () => false,
      logger: false,
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ready',
    });

    expect(response.statusCode).toBe(503);
    const payload = JSON.parse(response.payload);
    expect(payload).toEqual({
      status: 'not_ready',
      database: 'disconnected',
    });

    await app.close();
  });

  it('returns HTTP 503 without leaking stack traces or credentials when health check throws', async () => {
    const app = buildApp({
      checkDbHealth: async () => {
        throw new Error(
          'connect ECONNREFUSED postgresql://traceiq:secret_password@127.0.0.1:5432/traceiq',
        );
      },
      logger: false,
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ready',
    });

    expect(response.statusCode).toBe(503);
    const payload = JSON.parse(response.payload);

    expect(payload).toEqual({
      status: 'not_ready',
      database: 'disconnected',
    });

    // Ensure raw response body does not leak credentials or connection info
    expect(response.payload).not.toContain('secret_password');
    expect(response.payload).not.toContain('ECONNREFUSED');
    expect(response.payload).not.toContain('traceiq:');
    expect(response.payload).not.toContain('stack');

    await app.close();
  });
});
