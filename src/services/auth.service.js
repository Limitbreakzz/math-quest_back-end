const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const env = require('../utils/env');
const ERROR_CODES = require('../constants/errorCodes');
const { AppError } = require('../middlewares/error.middleware');

const signToken = (profile) =>
  jwt.sign(
    { sub: profile.id, role: profile.role, email: profile.email },
    env.jwtSecret,
    { expiresIn: '7d' }
  );

const ensureStarterInventory = async (tx, userId) => {
  await tx.playerInventory.createMany({
    data: [
      { userId, itemId: 'char_nova' },
      { userId, itemId: 'outfit_starter' },
    ],
    skipDuplicates: true,
  });
};

exports.register = async ({ email, username, displayName }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

  const existing = await prisma.profile.findFirst({
    where: { OR: [{ email: normalizedEmail }, { username: cleanUsername }] },
  });
  if (existing) {
    throw new AppError(ERROR_CODES.AUTH_DUPLICATE_ACCOUNT);
  }

  const profile = await prisma.$transaction(async (tx) => {
    const created = await tx.profile.create({
      data: {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        username: cleanUsername,
        displayName: displayName.trim(),
        role: 'USER',
        coins: 250n,
      },
    });
    await ensureStarterInventory(tx, created.id);
    return created;
  });

  return { token: signToken(profile), profile };
};

exports.login = async ({ email }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const profile = await prisma.profile.findFirst({
    where: { email: normalizedEmail },
  });

  if (!profile) {
    throw new AppError(ERROR_CODES.AUTH_ACCOUNT_NOT_FOUND);
  }
  if (!profile.isActive) {
    throw new AppError(ERROR_CODES.AUTH_ACCOUNT_DISABLED);
  }

  return { token: signToken(profile), profile };
};

exports.loginDemo = async (role = 'USER') => {
  const isAdmin = String(role).toUpperCase() === 'ADMIN';
  const username = isAdmin ? 'admin_master' : 'hero_math';
  const email = isAdmin ? 'admin@mathquest.game' : 'player@mathquest.game';
  const displayName = isAdmin ? 'ผู้ดูแลระบบ MathQuest' : 'นักผจญภัยคณิตศาสตร์';

  let profile = await prisma.profile.findUnique({ where: { username } });
  if (!profile) {
    profile = await prisma.$transaction(async (tx) => {
      const created = await tx.profile.create({
        data: {
          id: crypto.randomUUID(),
          username,
          displayName,
          email,
          role: isAdmin ? 'ADMIN' : 'USER',
          level: 2,
          totalXp: 280n,
          coins: 450n,
          dailyLoginStreak: 3,
        },
      });
      await ensureStarterInventory(tx, created.id);
      return created;
    });
  }

  return { token: signToken(profile), profile };
};
