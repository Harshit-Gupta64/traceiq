import { describe, it, expect, afterAll } from 'vitest';
import { buildApp } from '../../src/api/app.js';

describe('GET /api/v1/health (Unit)', () => {
  const app = buildApp({ logger: false });

  afterAll(async () => {
    await app.close();
  });

  it('returns HTTP 200 with process health information', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/health',
    });

    expect(response.statusCode).toBe(200);

    const payload = JSON.parse(response.payload);
    expect(payload.status).toBe('ok');
    expect(typeof payload.timestamp).toBe('string');
    expect(new Date(payload.timestamp).toString()).not.toBe('Invalid Date');
    expect(typeof payload.uptime).toBe('number');
    expect(payload.uptime).toBeGreaterThanOrEqual(0);
  });
});
