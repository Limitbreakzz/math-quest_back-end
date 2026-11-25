const prisma = require('../prisma');

const GameSessionModel = {
  create: (data) => prisma.gameSession.create({ data }),

  findByUser: (userId, limit = 50) =>
    prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),

  countAll: () => prisma.gameSession.count(),

  groupByMode: () =>
    prisma.gameSession.groupBy({
      by: ['gameMode'],
      _count: { _all: true },
    }),
};

module.exports = GameSessionModel;
