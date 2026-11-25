const prisma = require('../prisma');
const CategoryModel = require('../models/category.model');
const QuestionModel = require('../models/question.model');
const GameSessionModel = require('../models/gameSession.model');
const AdventureModel = require('../models/adventure.model');
const ERROR_CODES = require('../constants/errorCodes');
const { AppError } = require('../middlewares/error.middleware');

const calculateLevelFromXp = (totalXp) => {
  let level = 1;
  let threshold = 200n;
  let increment = 250n;

  while (totalXp >= threshold) {
    level += 1;
    threshold += increment;
    increment += 100n;
  }

  return level;
};

exports.calculateLevelFromXp = calculateLevelFromXp;

exports.getCategories = () => CategoryModel.findActive();

exports.getRandomQuestions = async ({ categoryId, difficulty, count = 10, puzzleOnly = false }) => {
  const pool = await QuestionModel.findFiltered({ categoryId, difficulty, puzzleOnly });
  const shuffled = [...pool];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const limit = Math.min(Math.max(1, count), shuffled.length);
  return shuffled.slice(0, limit);
};

exports.getAdventureWorlds = async (userId) => {
  const worlds = await AdventureModel.findActiveWorldsWithStages();
  const progressList = userId ? await AdventureModel.findUserStageProgress(userId) : [];
  const progress = Object.fromEntries(progressList.map((item) => [item.stageId, item]));
  return { worlds, progress };
};

exports.getUserSessions = (userId) => GameSessionModel.findByUser(userId);

exports.recordSession = async (userId, input) => {
  const total = Math.max(1, input.totalQuestions);
  const correct = Math.min(total, Math.max(0, input.correctAnswers));
  const incorrect = total - correct;
  const accuracy = Math.round((correct / total) * 10000) / 100;
  const diffMultiplier = input.difficulty === 'HARD' ? 3 : input.difficulty === 'MEDIUM' ? 2 : 1;

  const xpEarned = 30 + correct * 15 * diffMultiplier + input.maxCombo * 5;
  const coinsEarned = 15 + correct * 6 * diffMultiplier + (accuracy === 100 ? 25 : 0);
  const isVictory = input.isVictory !== undefined ? input.isVictory : accuracy >= 60;

  return prisma.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({ where: { id: userId } });
    if (!profile) {
      throw new AppError(ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const session = await tx.gameSession.create({
      data: {
        userId,
        gameMode: input.gameMode,
        categoryId: input.categoryId,
        difficulty: input.difficulty || 'MEDIUM',
        stageId: input.stageId,
        score: input.score,
        totalQuestions: total,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        maxCombo: input.maxCombo,
        accuracy,
        timeSpentSeconds: input.timeSpentSeconds,
        xpEarned,
        coinsEarned,
        isVictory,
      },
    });

    const prevLevel = profile.level;
    const newTotalXp = profile.totalXp + BigInt(xpEarned);
    const newLevel = calculateLevelFromXp(newTotalXp);
    const leveledUp = newLevel > prevLevel;
    const levelUpBonusCoins = leveledUp ? (newLevel - prevLevel) * 75 : 0;
    const newCoins = profile.coins + BigInt(coinsEarned + levelUpBonusCoins);

    const updatedProfile = await tx.profile.update({
      where: { id: userId },
      data: {
        level: newLevel,
        totalXp: newTotalXp,
        coins: newCoins,
        totalGamesPlayed: { increment: 1 },
        totalQuestionsAnswered: { increment: total },
        totalCorrectAnswers: { increment: correct },
        totalIncorrectAnswers: { increment: incorrect },
        totalScore: { increment: BigInt(input.score) },
        bestStreak: Math.max(profile.bestStreak, input.maxCombo),
        multiplayerMatches: input.gameMode === 'BATTLE' ? { increment: 1 } : undefined,
        multiplayerWins: input.gameMode === 'BATTLE' && isVictory ? { increment: 1 } : undefined,
      },
    });

    await tx.coinTransaction.create({
      data: {
        userId,
        amount: coinsEarned,
        balanceAfter: newCoins - BigInt(levelUpBonusCoins),
        transactionType: 'GAME_REWARD',
        referenceId: session.id,
        description: `Reward from ${input.gameMode}`,
      },
    });

    if (levelUpBonusCoins > 0) {
      await tx.coinTransaction.create({
        data: {
          userId,
          amount: levelUpBonusCoins,
          balanceAfter: newCoins,
          transactionType: 'LEVEL_UP',
          referenceId: `LEVEL_${newLevel}`,
          description: `Level up bonus to Lv.${newLevel}`,
        },
      });
    }

    let starsEarned;
    if (input.stageId && isVictory) {
      starsEarned = accuracy >= 95 ? 3 : accuracy >= 75 ? 2 : 1;
      const existing = await tx.playerStageProgress.findUnique({
        where: { userId_stageId: { userId, stageId: input.stageId } },
      });

      await tx.playerStageProgress.upsert({
        where: { userId_stageId: { userId, stageId: input.stageId } },
        update: {
          stars: Math.max(existing?.stars || 0, starsEarned),
          bestScore: Math.max(existing?.bestScore || 0, input.score),
          bestAccuracy: Math.max(Number(existing?.bestAccuracy || 0), accuracy),
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId,
          stageId: input.stageId,
          stars: starsEarned,
          bestScore: input.score,
          bestAccuracy: accuracy,
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    return {
      session,
      profile: updatedProfile,
      xpEarned,
      coinsEarned,
      leveledUp,
      newLevel,
      levelUpBonusCoins,
      starsEarned,
    };
  });
};
