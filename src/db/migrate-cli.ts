/* eslint-disable no-console */
import { migrateUp, migrateDown, migrateStatus } from './migrator.js';
import { closePool } from './pool.js';

async function runCli(): Promise<void> {
  const command = process.argv[2]?.toLowerCase() ?? 'up';

  try {
    switch (command) {
      case 'up': {
        console.log('[Migrator] Applying pending migrations...');
        const result = await migrateUp();
        if (result.alreadyUpToDate) {
          console.log('[Migrator] Database is already up to date. No migrations to apply.');
        } else {
          console.log(`[Migrator] Successfully applied ${result.applied.length} migration(s):`);
          for (const name of result.applied) {
            console.log(`  - ${name}`);
          }
        }
        break;
      }
      case 'down': {
        console.log('[Migrator] Rolling back last migration...');
        const result = await migrateDown();
        if (result.rolledBack) {
          console.log(`[Migrator] Successfully rolled back: ${result.rolledBack}`);
        } else {
          console.log('[Migrator] No migrations found to rollback.');
        }
        break;
      }
      case 'status': {
        console.log('[Migrator] Fetching migration status...');
        const status = await migrateStatus();
        if (status.migrations.length === 0) {
          console.log('[Migrator] No migration files found.');
        } else {
          console.log('[Migrator] Migration Status:');
          for (const m of status.migrations) {
            const state = m.applied
              ? `[APPLIED at ${m.appliedAt?.toISOString() ?? 'unknown'}]`
              : '[PENDING]';
            console.log(`  ${state} ${m.name}`);
          }
        }
        break;
      }
      default: {
        console.error(
          `[Migrator] Unknown command: '${command}'. Expected 'up', 'down', or 'status'.`,
        );
        process.exitCode = 1;
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Migrator Error] ${message}`);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

void runCli();
