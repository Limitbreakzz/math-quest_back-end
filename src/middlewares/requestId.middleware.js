const crypto = require('crypto');
const logger = require('../utils/logger');

const requestIdMiddleware = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId =
    typeof incomingId === 'string' && incomingId.trim().length > 0 && incomingId.length <= 64
      ? incomingId.trim()
      : `req_${crypto.randomBytes(6).toString('hex')}`;

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const startedAt = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    if (res.statusCode >= 500) return; // errorHandler logs 5xx with stack trace
    logger.info('HTTP request completed', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
    });
  });

  next();
};

module.exports = requestIdMiddleware;
