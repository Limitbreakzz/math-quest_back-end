const prisma = require('../prisma');
const MissionModel = require('../models/mission.model');
const ERROR_CODES = require('../constants/errorCodes');
const { AppError } = require('../middlewares/error.middleware');
const { calculateLevelFromXp } = require('./game.service');

const getCurrentPeriodKeys = () => {
  const now = new Date();
  const dailyKey = now.toISOString().slice(0, 10);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  const weeklyKey = `${now.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
  return { dailyKey, weeklyKey };
};

exports.getMissionsAndAchievements = async (userId) => {
  const { dailyKey, weeklyKey } = getCurrentPeriodKeys();
  const [missions, playerMissions, achievements, playerAchievements] = await Promise.all([
    MissionModel.findActiveMissions(),
    MissionModel.findPlayerMissions(userId, [dailyKey, weeklyKey]),
    MissionModel.findAllAchievements(),
    MissionModel.findPlayerAchievements(userId),
  ]);

  const pmMap = Object.fromEntries(playerMissions.map((item) => [item.missionId, item]));
  const paMap = Object.fromEntries(playerAchievements.map((item) => [item.achievementId, item]));

  return {
    missions: missions.map((mission) => ({
      ...mission,
      currentValue: pmMap[mission.id]?.currentValue || 0,
      isCompleted: pmMap[mission.id]?.isCompleted || false,
      isClaimed: pmMap[mission.id]?.isClaimed || false,
    })),
    achievements: achievements.map((achievement) => ({
      ...achievement,
      currentValue: paMap[achievement.id]?.currentValue || 0,
      unlocked: paMap[achievement.id]?.unlocked || false,
      claimed: paMap[achievement.id]?.claimed || false,
    })),
  };
};

exports.claimMission = async (userId, missionId) => {
  const { dailyKey, weeklyKey } = getCurrentPeriodKeys();

  return prisma.$transaction(async (tx) => {
    const mission = await tx.mission.findUnique({ where: { id: missionId } });
    if (!mission) throw new AppError(ERROR_CODES.MISSION_NOT_FOUND);

    const periodKey = mission.missionType === 'DAILY' ? dailyKey : weeklyKey;
    const progress = await tx.playerMission.findUnique({
      where: { userId_missionId_periodKey: { userId, missionId, periodKey } },
    });

    if (!progress || !progress.isCompleted) {
      throw new AppError(ERROR_CODES.MISSION_NOT_COMPLETED);
    }
    if (progress.isClaimed) {
      throw new AppError(ERROR_CODES.MISSION_ALREADY_CLAIMED);
    }

    await tx.playerMission.update({
      where: { id: progress.id },
      data: { isClaimed: true },
    });

    const profile = await tx.profile.findUniqueOrThrow({ where: { id: userId } });
    const newXp = profile.totalXp + BigInt(mission.rewardXp);
    const newCoins = profile.coins + BigInt(mission.rewardCoins);

    const updatedProfile = await tx.profile.update({
      where: { id: userId },
      data: {
        totalXp: newXp,
        level: calculateLevelFromXp(newXp),
        coins: newCoins,
      },
    });

    await tx.coinTransaction.create({
      data: {
        userId,
        amount: mission.rewardCoins,
        balanceAfter: newCoins,
        transactionType: 'MISSION_REWARD',
        referenceId: missionId,
        description: `Mission reward: ${mission.titleEn}`,
      },
    });

    return {
      profile: updatedProfile,
      rewardXp: mission.rewardXp,
      rewardCoins: mission.rewardCoins,
    };
  });
};
