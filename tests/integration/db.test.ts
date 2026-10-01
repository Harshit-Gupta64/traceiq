import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getPool, closePool, checkDatabaseHealth, query } from '../../src/db/pool.js';

describe('PostgreSQL Connectivity & Queries (Integration)', () => {
  let isDbAvailable = false;

  beforeAll(async () => {
    isDbAvailable = await checkDatabaseHealth();
  });

  afterAll(async () => {
    await closePool();
  });

  it('connects to PostgreSQL and passes health check', async () => {
    if (!isDbAvailable) {
      console.warn('[Integration Test Skipped] PostgreSQL is not running or unreachable.');
      return;
    }

    const healthy = await checkDatabaseHealth();
    expect(healthy).toBe(true);
  });

  it('executes parameterized queries safely', async () => {
    if (!isDbAvailable) {
      return;
    }

    const result = await query<{ sum: number }>('SELECT $1::int + $2::int AS sum', [3, 7]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.sum).toBe(10);
  });

  it('exposes a valid pool instance', async () => {
    if (!isDbAvailable) {
      return;
    }

    const pool = getPool();
    expect(pool).toBeDefined();
    expect(pool.totalCount).toBeGreaterThanOrEqual(0);
  });
});
