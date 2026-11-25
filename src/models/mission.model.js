const prisma = require('../prisma');

const MissionModel = {
  findActiveMissions: () => prisma.mission.findMany({ where: { isActive: true } }),

  findPlayerMissions: (userId, periodKeys) =>
    prisma.playerMission.findMany({
      where: { userId, periodKey: { in: periodKeys } },
      include: { mission: true },
    }),

  findAllAchievements: () => prisma.achievement.findMany(),

  findPlayerAchievements: (userId) =>
    prisma.playerAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    }),
};

module.exports = MissionModel;
