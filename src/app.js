const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./utils/env');
const apiRoutes = require('./routes');
const ERROR_CODES = require('./constants/errorCodes');
const requestIdMiddleware = require('./middlewares/requestId.middleware');
const { createRateLimiter } = require('./middlewares/rateLimit.middleware');
const { AppError, errorHandler } = require('./middlewares/error.middleware');

const createApp = () => {
  const app = express();

  app.set('json replacer', (_key, value) => (typeof value === 'bigint' ? Number(value) : value));

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(express.json({ limit: '5mb' }));
  app.use(requestIdMiddleware);

  // Rate limiting on API routes (stricter on auth)
  app.use('/api/auth', createRateLimiter({ windowMs: 60_000, max: 30 }));
  app.use('/api', createRateLimiter({ windowMs: 60_000, max: 200 }));

  app.use('/api', apiRoutes);

  app.use((_req, _res, next) => {
    next(new AppError(ERROR_CODES.ROUTE_NOT_FOUND));
  });

  app.use(errorHandler);
  return app;
};

module.exports = { createApp };
