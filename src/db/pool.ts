import pg from 'pg';
import { getEnv } from '../config/env.js';

const { Pool } = pg;

let globalPool: pg.Pool | null = null;

/**
 * Sanitizes a PostgreSQL connection string by masking user and password.
 * Used for safe logging and error diagnostics.
 */
export function maskConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    if (url.password) {
      url.password = '***';
    }
    if (url.username) {
      url.username = '***';
    }
    return url.toString();
  } catch {
    return '[malformed-connection-string]';
  }
}

/**
 * Creates or retrieves the singleton PostgreSQL connection pool.
 */
export function getPool(overridePool?: pg.Pool): pg.Pool {
  if (overridePool) {
    return overridePool;
  }

  if (!globalPool) {
    const env = getEnv();

    globalPool = new Pool({
      connectionString: env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      max: 10,
    });

    globalPool.on('error', (err) => {
      // Log generic safe message without connection string or credentials
      console.error('[Database Pool Error] Unexpected idle client error:', err.message);
    });
  }

  return globalPool;
}

/**
 * Checks PostgreSQL connectivity by executing a fast probe query.
 * Returns true if the database responds, false otherwise.
 * Never throws or leaks sensitive connection details.
 */
export async function checkDatabaseHealth(targetPool?: pg.Pool): Promise<boolean> {
  const pool = targetPool ?? getPool();
  let client: pg.PoolClient | null = null;

  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    return true;
  } catch {
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Executes a parameterized SQL query safely.
 */
export async function query<R extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
  targetPool?: pg.Pool,
): Promise<pg.QueryResult<R>> {
  const pool = targetPool ?? getPool();
  return pool.query<R>(text, params);
}

/**
 * Closes the database pool cleanly during shutdown or test cleanup.
 */
export async function closePool(targetPool?: pg.Pool): Promise<void> {
  const pool = targetPool ?? globalPool;
  if (pool) {
    await pool.end();
    if (pool === globalPool) {
      globalPool = null;
    }
  }
}

/**
 * Resets the pool instance (primarily for test isolation).
 */
export function resetPool(): void {
  globalPool = null;
}
