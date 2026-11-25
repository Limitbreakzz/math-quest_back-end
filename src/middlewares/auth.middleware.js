const jwt = require('jsonwebtoken');
const env = require('../utils/env');
const prisma = require('../prisma');
const ERROR_CODES = require('../constants/errorCodes');
const { AppError } = require('./error.middleware');

const requireAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError(ERROR_CODES.AUTH_MISSING_TOKEN));
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, env.jwtSecret);
    if (!decoded || !decoded.sub) {
      return next(new AppError(ERROR_CODES.AUTH_INVALID_TOKEN));
    }

    const profile = await prisma.profile.findUnique({
      where: { id: decoded.sub },
      select: { id: true, role: true, email: true, username: true, isActive: true },
    });

    if (!profile) {
      return next(new AppError(ERROR_CODES.AUTH_ACCOUNT_NOT_FOUND));
    }
    if (!profile.isActive) {
      return next(new AppError(ERROR_CODES.AUTH_ACCOUNT_DISABLED));
    }

    req.user = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      role: profile.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError(ERROR_CODES.AUTH_ACCESS_DENIED));
  }
  return next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};
