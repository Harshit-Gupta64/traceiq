import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { checkDatabaseHealth, closePool, query } from '../../src/db/pool.js';
import {
  migrateUp,
  migrateDown,
  migrateStatus,
  getAppliedMigrations,
} from '../../src/db/migrator.js';

describe('Database Migrations (Integration)', () => {
  let isDbAvailable = false;

  beforeAll(async () => {
    isDbAvailable = await checkDatabaseHealth();
  });

  afterAll(async () => {
    if (isDbAvailable) {
      // Ensure migration is applied at the end for consistent state
      await migrateUp();
    }
    await closePool();
  });

  it('applies pending migrations and creates system_metadata table', async () => {
    if (!isDbAvailable) {
      console.warn('[Integration Test Skipped] PostgreSQL is not running.');
      return;
    }

    const upResult = await migrateUp();
    expect(upResult).toBeDefined();

    const applied = await getAppliedMigrations();
    expect(applied.some((m) => m.name === '001_foundation')).toBe(true);

    // Verify system_metadata table exists and has initial record
    const metaCheck = await query<{ key: string; value: string }>(
      "SELECT key, value FROM system_metadata WHERE key = 'schema_version'",
    );
    expect(metaCheck.rows).toHaveLength(1);
    expect(metaCheck.rows[0]?.value).toBe('1');
  });

  it('reports migration status accurately', async () => {
    if (!isDbAvailable) {
      return;
    }

    const status = await migrateStatus();
    expect(status.migrations.length).toBeGreaterThanOrEqual(1);
    const foundation = status.migrations.find((m) => m.name === '001_foundation');
    expect(foundation?.applied).toBe(true);
  });

  it('rolls back migration cleanly and removes system_metadata table', async () => {
    if (!isDbAvailable) {
      return;
    }

    const downResult = await migrateDown();
    expect(downResult.rolledBack).toBe('001_foundation');

    // Verify system_metadata table was dropped
    const tableCheck = await query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'system_metadata'
      ) as exists;
    `);
    expect(tableCheck.rows[0]?.exists).toBe(false);

    // Re-apply migration to leave DB in consistent healthy state
    const reUpResult = await migrateUp();
    expect(reUpResult.applied).toContain('001_foundation');
  });
});
