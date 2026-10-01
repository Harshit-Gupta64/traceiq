import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildApp } from '../../src/api/app.js';
import { checkDatabaseHealth, closePool } from '../../src/db/pool.js';

describe('GET /api/v1/ready (Integration against live PostgreSQL)', () => {
  let isDbAvailable = false;
  const app = buildApp({ logger: false });

  beforeAll(async () => {
    isDbAvailable = await checkDatabaseHealth();
  });

  afterAll(async () => {
    await app.close();
    await closePool();
  });

  it('returns HTTP 200 with ready status when connected to live database', async () => {
    if (!isDbAvailable) {
      console.warn('[Integration Test Skipped] PostgreSQL is not running.');
      return;
    }

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
  });
});
