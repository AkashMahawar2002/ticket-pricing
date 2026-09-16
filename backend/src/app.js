import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import healthRoutes from './api/routes/health.routes.js';
import { requestLogger } from './api/middleware/request-logger.js';
import { notFound } from './api/middleware/not-found.js';
import { errorHandler } from './api/middleware/error-handler.js';
import authRoutes from './api/routes/auth.routes.js';
import commerceRoutes from './api/routes/commerce.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(requestLogger);

  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1', commerceRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
