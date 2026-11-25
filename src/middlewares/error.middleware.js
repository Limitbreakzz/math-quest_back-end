const ERROR_CODES = require('../constants/errorCodes');
const logger = require('../utils/logger');

class AppError extends Error {
  constructor(
    errorDefOrMessage,
    statusCode = 400,
    code = 'BAD_REQUEST',
    details = null,
    cause = null
  ) {
    if (errorDefOrMessage && typeof errorDefOrMessage === 'object' && errorDefOrMessage.code) {
      super(errorDefOrMessage.message);
      this.number = errorDefOrMessage.number || ERROR_CODES.INTERNAL_SERVER_ERROR.number;
      this.code = errorDefOrMessage.code;
      this.statusCode = errorDefOrMessage.statusCode || 400;
      this.details = details;
    } else {
      super(String(errorDefOrMessage || ERROR_CODES.INTERNAL_SERVER_ERROR.message));
      this.number = ERROR_CODES.INTERNAL_SERVER_ERROR.number;
      this.code = code;
      this.statusCode = statusCode;
      this.details = details;
    }
    this.cause = cause || null;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const translatePrismaError = (err) => {
  if (!err || typeof err !== 'object') return null;

  if (err.name === 'PrismaClientInitializationError') {
    return ERROR_CODES.DATABASE_CONNECTION_ERROR;
  }

  if (err.code === 'P2002') {
    return {
      ...ERROR_CODES.DUPLICATE_RECORD,
      details: err.meta?.target ? { fields: err.meta.target } : null,
    };
  }
  if (err.code === 'P2025') {
    return ERROR_CODES.RESOURCE_NOT_FOUND;
  }
  if (err.code === 'P2003') {
    return {
      ...ERROR_CODES.VALIDATION_FAILED,
      message: 'ข้อมูลอ้างอิงไม่ถูกต้องหรือไม่พบในระบบ',
    };
  }
  if (err.code === 'P1001' || err.code === 'P1002' || err.code === 'P1008') {
    return ERROR_CODES.DATABASE_CONNECTION_ERROR;
  }
  if (typeof err.code === 'string' && err.code.startsWith('P2')) {
    return ERROR_CODES.DATABASE_ERROR;
  }

  return null;
};

const errorHandler = (err, req, res, _next) => {
  let number = ERROR_CODES.INTERNAL_SERVER_ERROR.number;
  let code = ERROR_CODES.INTERNAL_SERVER_ERROR.code;
  let statusCode = ERROR_CODES.INTERNAL_SERVER_ERROR.statusCode;
  let message = ERROR_CODES.INTERNAL_SERVER_ERROR.message;
  let details = null;

  if (err instanceof AppError) {
    number = err.number || ERROR_CODES.INTERNAL_SERVER_ERROR.number;
    code = err.code;
    statusCode = err.statusCode;
    message = err.message;
    details = err.details || null;
  } else if (err && err.name === 'TokenExpiredError') {
    number = ERROR_CODES.AUTH_TOKEN_EXPIRED.number;
    code = ERROR_CODES.AUTH_TOKEN_EXPIRED.code;
    statusCode = ERROR_CODES.AUTH_TOKEN_EXPIRED.statusCode;
    message = ERROR_CODES.AUTH_TOKEN_EXPIRED.message;
  } else if (err && err.name === 'JsonWebTokenError') {
    number = ERROR_CODES.AUTH_INVALID_TOKEN.number;
    code = ERROR_CODES.AUTH_INVALID_TOKEN.code;
    statusCode = ERROR_CODES.AUTH_INVALID_TOKEN.statusCode;
    message = ERROR_CODES.AUTH_INVALID_TOKEN.message;
  } else {
    const prismaMapped = translatePrismaError(err);
    if (prismaMapped) {
      number = prismaMapped.number;
      code = prismaMapped.code;
      statusCode = prismaMapped.statusCode;
      message = prismaMapped.message;
      details = prismaMapped.details || null;
    }
  }

  const rootError = err?.cause || err;
  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  logger[logLevel]('API request failed', {
    requestId: req.requestId || null,
    errorNumber: number,
    errorCode: code,
    statusCode,
    method: req.method,
    path: req.originalUrl,
    errorMessage: rootError?.message || message,
    stack: statusCode >= 500 ? rootError?.stack : undefined,
  });

  return res.status(statusCode).json({
    success: false,
    status: 'error',
    error: {
      number,
      code,
      statusCode,
      message,
      details,
      requestId: req.requestId || null,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
    },
  });
};

module.exports = {
  AppError,
  errorHandler,
};
