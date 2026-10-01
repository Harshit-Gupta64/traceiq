import Fastify, { type FastifyInstance, type FastifyError } from 'fastify';
import { healthRoutes } from './routes/health.js';
import { readyRoutes } from './routes/ready.js';

export interface BuildAppOptions {
  checkDbHealth?: () => Promise<boolean>;
  logger?: boolean;
}

/**
 * Builds and configures the Fastify application instance.
 */
export function buildApp(options: BuildAppOptions = {}): FastifyInstance {
  const app = Fastify({
    logger: options.logger ?? false,
  });

  // Global error handler - guarantees no internal stack traces or secrets leak to clients
  app.setErrorHandler((error: FastifyError, _request, reply) => {
    const statusCode = error.statusCode ?? 500;
    if (statusCode >= 500) {
      return reply.status(statusCode).send({
        error: 'Internal Server Error',
        message: 'An unexpected internal error occurred',
        statusCode,
      });
    }

    return reply.status(statusCode).send({
      error: error.name || 'Error',
      message: error.message,
      statusCode,
    });
  });

  // 404 handler - structured JSON
  app.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      error: 'Not Found',
      message: 'The requested resource does not exist',
      statusCode: 404,
    });
  });

  // Register versioned API routes
  void app.register(healthRoutes, { prefix: '/api/v1' });
  void app.register(readyRoutes, {
    prefix: '/api/v1',
    checkDbHealth: options.checkDbHealth,
  });

  return app;
}
