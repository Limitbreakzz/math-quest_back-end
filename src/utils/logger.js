const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'secret',
  'jwtsecret',
  'cookie',
]);

const redactSensitive = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redactSensitive);

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = redactSensitive(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

const writeLog = (level, message, context = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...redactSensitive(context),
  };

  const line = JSON.stringify(entry);
  if (level === 'ERROR' || level === 'FATAL') {
    console.error(line);
  } else if (level === 'WARN') {
    console.warn(line);
  } else {
    console.log(line);
  }
};

const logger = {
  debug: (message, context) => {
    if (process.env.NODE_ENV === 'development') writeLog('DEBUG', message, context);
  },
  info: (message, context) => writeLog('INFO', message, context),
  warn: (message, context) => writeLog('WARN', message, context),
  error: (message, context) => writeLog('ERROR', message, context),
  fatal: (message, context) => writeLog('FATAL', message, context),
};

module.exports = logger;
