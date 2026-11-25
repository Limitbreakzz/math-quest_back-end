const gameService = require('../services/game.service');

const ALLOWED_GAME_MODES = ['QUIZ', 'SPEED', 'ADVENTURE', 'BATTLE', 'PUZZLE', 'DAILY'];
const ALLOWED_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

exports.getCategories = async (req, res) => {
  try {
    const categories = await gameService.getCategories();

    res.json({
      status: 'success',
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getRandomQuestions = async (req, res) => {
  try {
    const { categoryId, difficulty, count, puzzleOnly } = req.query;
    const questions = await gameService.getRandomQuestions({
      categoryId: typeof categoryId === 'string' ? categoryId : undefined,
      difficulty: typeof difficulty === 'string' ? difficulty : undefined,
      count: count ? Number(count) : 10,
      puzzleOnly: puzzleOnly === 'true',
    });

    res.json({
      status: 'success',
      message: 'Questions retrieved successfully',
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching random questions:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getAdventureWorlds = async (req, res) => {
  try {
    const worlds = await gameService.getAdventureWorlds(req.user?.id);

    res.json({
      status: 'success',
      message: 'Adventure worlds retrieved successfully',
      data: worlds,
    });
  } catch (error) {
    console.error('Error fetching adventure worlds:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.submitSession = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const {
      gameMode,
      categoryId,
      difficulty,
      stageId,
      score,
      totalQuestions,
      correctAnswers,
      maxCombo = 0,
      timeSpentSeconds = 0,
      isVictory,
    } = req.body || {};

    if (!ALLOWED_GAME_MODES.includes(gameMode)) {
      return res.status(400).json({
        status: 'error',
        message: 'โหมดการเล่นไม่ถูกต้อง',
      });
    }

    if (categoryId !== undefined && typeof categoryId !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'รหัสหมวดหมู่ไม่ถูกต้อง',
      });
    }

    if (difficulty !== undefined && !ALLOWED_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({
        status: 'error',
        message: 'ระดับความยากไม่ถูกต้อง',
      });
    }

    if (stageId !== undefined && typeof stageId !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'รหัสด่านไม่ถูกต้อง',
      });
    }

    if (!Number.isInteger(score) || score < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'คะแนนต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป',
      });
    }

    if (!Number.isInteger(totalQuestions) || totalQuestions < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'จำนวนข้อทั้งหมดต้องเป็นจำนวนเต็มตั้งแต่ 1 ขึ้นไป',
      });
    }

    if (!Number.isInteger(correctAnswers) || correctAnswers < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'จำนวนข้อที่ตอบถูกต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป',
      });
    }

    if (!Number.isInteger(maxCombo) || maxCombo < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'ค่าคอมโบสูงสุดต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป',
      });
    }

    if (!Number.isInteger(timeSpentSeconds) || timeSpentSeconds < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'เวลาที่ใช้ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป',
      });
    }

    if (isVictory !== undefined && typeof isVictory !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        message: 'สถานะชัยชนะไม่ถูกต้อง',
      });
    }

    const result = await gameService.recordSession(req.user.id, {
      gameMode,
      categoryId,
      difficulty,
      stageId,
      score,
      totalQuestions,
      correctAnswers,
      maxCombo,
      timeSpentSeconds,
      isVictory,
    });

    res.json({
      status: 'success',
      message: 'Game session recorded successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error recording game session:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'กรุณาเข้าสู่ระบบก่อนดำเนินการ',
      });
    }

    const sessions = await gameService.getUserSessions(req.user.id);

    res.json({
      status: 'success',
      message: 'Game history retrieved successfully',
      data: sessions,
    });
  } catch (error) {
    console.error('Error fetching user game sessions:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
