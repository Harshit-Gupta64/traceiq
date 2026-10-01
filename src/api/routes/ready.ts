import type { FastifyPluginAsync } from 'fastify';
import { checkDatabaseHealth } from '../../db/pool.js';

export interface ReadyRouteOptions {
  checkDbHealth?: () => Promise<boolean>;
}

export const readyRoutes: FastifyPluginAsync<ReadyRouteOptions> = async (fastify, opts) => {
  const checkHealth = opts.checkDbHealth ?? checkDatabaseHealth;

  fastify.get('/ready', async (_request, reply) => {
    try {
      const isConnected = await checkHealth();

      if (isConnected) {
        return reply.status(200).send({
          status: 'ready',
          database: 'connected',
        });
      }

      return reply.status(503).send({
        status: 'not_ready',
        database: 'disconnected',
      });
    } catch {
      // Catch any unexpected error and safely return 503 without leaking details
      return reply.status(503).send({
        status: 'not_ready',
        database: 'disconnected',
      });
    }
  });
};
