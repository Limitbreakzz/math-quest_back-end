const ERROR_CODES = require('../constants/errorCodes');

/**
 * Lightweight sliding-window in-memory rate limiter (zero external dependencies).
 */
const createRateLimiter = ({ windowMs = 60_000, max = 120 } = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip || 'unknown'}:${req.baseUrl}`;
    const record = hits.get(key);

    if (!record || now > record.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    record.count += 1;
    if (record.count > max) {
      const def = ERROR_CODES.RATE_LIMIT_EXCEEDED;
      return res.status(def.statusCode).json({
        success: false,
        error: {
          code: def.code,
          message: def.message,
          details: { retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000) },
          requestId: req.requestId || null,
        },
        meta: {
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          method: req.method,
        },
      });
    }

    return next();
  };
};

module.exports = { createRateLimiter };
