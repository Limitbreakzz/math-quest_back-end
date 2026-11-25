const prisma = require('../prisma');

const AdventureModel = {
  findActiveWorldsWithStages: () =>
    prisma.adventureWorld.findMany({
      where: { isActive: true },
      orderBy: { worldNumber: 'asc' },
      include: {
        stages: {
          orderBy: { stageNumber: 'asc' },
        },
      },
    }),

  findUserStageProgress: (userId) =>
    prisma.playerStageProgress.findMany({ where: { userId } }),
};

module.exports = AdventureModel;
