const prisma = require('../prisma');

const ProfileModel = {
  findById: (id) => prisma.profile.findUnique({ where: { id } }),

  findByUsername: (username) => prisma.profile.findUnique({ where: { username } }),

  findAll: () => prisma.profile.findMany({ orderBy: { createdAt: 'desc' } }),

  updateById: (id, data) => prisma.profile.update({ where: { id }, data }),

  deleteById: (id) => prisma.profile.delete({ where: { id } }),

  findLeaderboard: (orderBy, limit = 50) =>
    prisma.profile.findMany({
      where: { isActive: true },
      orderBy,
      take: limit,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        level: true,
        totalXp: true,
        totalScore: true,
        totalQuestionsAnswered: true,
        totalCorrectAnswers: true,
        multiplayerWins: true,
        equippedCharacterId: true,
        equippedOutfitId: true,
        equippedAccessoryId: true,
      },
    }),

  searchByName: (query, limit = 30) =>
    prisma.profile.findMany({
      where: {
        isActive: true,
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    }),
};

module.exports = ProfileModel;
