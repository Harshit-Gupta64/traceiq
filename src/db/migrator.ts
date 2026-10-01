import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type pg from 'pg';
import { getPool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves the default migrations directory path.
 */
export function getDefaultMigrationsDir(): string {
  // First check project root relative to this file (src/db -> project root)
  const candidateFromSrc = path.resolve(__dirname, '../../migrations');
  return candidateFromSrc;
}

/**
 * Ensures the schema_migrations tracking table exists.
 */
export async function ensureMigrationTable(targetPool?: pg.Pool): Promise<void> {
  const pool = targetPool ?? getPool();
  const sql = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await pool.query(sql);
}

export interface MigrationRecord {
  name: string;
  applied: boolean;
  appliedAt?: Date;
}

export interface MigrationStatus {
  migrations: MigrationRecord[];
}

/**
 * Discovers and returns available migration files from the migrations directory.
 */
export async function discoverMigrations(migrationsDir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(migrationsDir);
    const upFiles = entries
      .filter((file) => file.endsWith('.up.sql'))
      .map((file) => file.replace(/\.up\.sql$/, ''))
      .sort();
    return upFiles;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Retrieves the names of all migrations that have already been applied.
 */
export async function getAppliedMigrations(
  targetPool?: pg.Pool,
): Promise<{ name: string; applied_at: Date }[]> {
  const pool = targetPool ?? getPool();
  await ensureMigrationTable(pool);
  const result = await pool.query<{ name: string; applied_at: Date }>(
    'SELECT name, applied_at FROM schema_migrations ORDER BY id ASC',
  );
  return result.rows;
}

/**
 * Applies all pending database migrations in sequential order.
 */
export async function migrateUp(options?: {
  pool?: pg.Pool;
  migrationsDir?: string;
}): Promise<{ applied: string[]; alreadyUpToDate: boolean }> {
  const pool = options?.pool ?? getPool();
  const migrationsDir = options?.migrationsDir ?? getDefaultMigrationsDir();

  await ensureMigrationTable(pool);

  const appliedRows = await getAppliedMigrations(pool);
  const appliedNames = new Set(appliedRows.map((r) => r.name));

  const availableMigrations = await discoverMigrations(migrationsDir);
  const pending = availableMigrations.filter((name) => !appliedNames.has(name));

  if (pending.length === 0) {
    return { applied: [], alreadyUpToDate: true };
  }

  const applied: string[] = [];

  for (const migrationName of pending) {
    const filePath = path.join(migrationsDir, `${migrationName}.up.sql`);
    const sqlContent = await fs.readFile(filePath, 'utf-8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sqlContent);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [migrationName]);
      await client.query('COMMIT');
      applied.push(migrationName);
    } catch (err) {
      await client.query('ROLLBACK');
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to apply migration '${migrationName}': ${message}`);
    } finally {
      client.release();
    }
  }

  return { applied, alreadyUpToDate: false };
}

/**
 * Rolls back the most recently applied migration.
 */
export async function migrateDown(options?: {
  pool?: pg.Pool;
  migrationsDir?: string;
}): Promise<{ rolledBack: string | null }> {
  const pool = options?.pool ?? getPool();
  const migrationsDir = options?.migrationsDir ?? getDefaultMigrationsDir();

  await ensureMigrationTable(pool);

  const appliedRows = await getAppliedMigrations(pool);
  if (appliedRows.length === 0) {
    return { rolledBack: null };
  }

  const lastApplied = appliedRows[appliedRows.length - 1];
  if (!lastApplied) {
    return { rolledBack: null };
  }

  const migrationName = lastApplied.name;
  const downFilePath = path.join(migrationsDir, `${migrationName}.down.sql`);

  let downSqlContent: string;
  try {
    downSqlContent = await fs.readFile(downFilePath, 'utf-8');
  } catch {
    throw new Error(
      `Rollback file '${migrationName}.down.sql' not found. Cannot rollback migration.`,
    );
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(downSqlContent);
    await client.query('DELETE FROM schema_migrations WHERE name = $1', [migrationName]);
    await client.query('COMMIT');
    return { rolledBack: migrationName };
  } catch (err) {
    await client.query('ROLLBACK');
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to rollback migration '${migrationName}': ${message}`);
  } finally {
    client.release();
  }
}

/**
 * Returns the status of all known migrations.
 */
export async function migrateStatus(options?: {
  pool?: pg.Pool;
  migrationsDir?: string;
}): Promise<MigrationStatus> {
  const pool = options?.pool ?? getPool();
  const migrationsDir = options?.migrationsDir ?? getDefaultMigrationsDir();

  await ensureMigrationTable(pool);

  const appliedRows = await getAppliedMigrations(pool);
  const appliedMap = new Map<string, Date>(appliedRows.map((r) => [r.name, r.applied_at]));

  const availableMigrations = await discoverMigrations(migrationsDir);

  const migrations: MigrationRecord[] = availableMigrations.map((name) => {
    const appliedAt = appliedMap.get(name);
    return {
      name,
      applied: appliedMap.has(name),
      ...(appliedAt ? { appliedAt } : {}),
    };
  });

  return { migrations };
}
