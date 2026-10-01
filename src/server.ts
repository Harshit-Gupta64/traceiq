/* eslint-disable no-console */
import { buildApp } from './api/app.js';
import { getEnv } from './config/env.js';
import { closePool } from './db/pool.js';

async function startServer(): Promise<void> {
  const env = getEnv();
  const app = buildApp({
    logger: env.NODE_ENV !== 'test',
  });

  let isShuttingDown = false;

  async function handleShutdown(signal: string): Promise<void> {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);

    try {
      await app.close();
      console.log('[Server] HTTP server closed.');

      await closePool();
      console.log('[Server] Database pool closed.');

      console.log('[Server] Graceful shutdown complete.');
      process.exit(0);
    } catch (err) {
      console.error(
        '[Server] Error during shutdown:',
        err instanceof Error ? err.message : String(err),
      );
      process.exit(1);
    }
  }

  process.on('SIGINT', () => void handleShutdown('SIGINT'));
  process.on('SIGTERM', () => void handleShutdown('SIGTERM'));

  try {
    const address = await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });
    console.log(`[Server] TraceIQ API listening at ${address}`);
    console.log(`[Server] Health check: ${address}/api/v1/health`);
    console.log(`[Server] Readiness check: ${address}/api/v1/ready`);
  } catch (err) {
    console.error(
      '[Server] Failed to start server:',
      err instanceof Error ? err.message : String(err),
    );
    await closePool();
    process.exit(1);
  }
}

void startServer();
