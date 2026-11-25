const kahootService = require('../services/kahoot.service');

const ALLOWED_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

exports.createRoom = async (req, res) => {
  try {
    const {
      hostUserId,
      hostName,
      characterId,
      outfitId,
      accessoryId,
      categoryId,
      difficulty,
      questionCount,
      timePerQuestion,
    } = req.body || {};

    if (typeof hostUserId !== 'string' || hostUserId.length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'กรุณาระบุรหัสผู้สร้างห้อง',
      });
    }

    if (typeof hostName !== 'string' || hostName.length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'กรุณาระบุชื่อผู้สร้างห้อง',
      });
    }

    if (difficulty !== undefined && !ALLOWED_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({
        status: 'error',
        message: 'ระดับความยากไม่ถูกต้อง',
      });
    }

    if (
      questionCount !== undefined &&
      (!Number.isInteger(questionCount) || questionCount < 3 || questionCount > 20)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'จำนวนข้อต้องอยู่ระหว่าง 3 ถึง 20 ข้อ',
      });
    }

    if (
      timePerQuestion !== undefined &&
      (!Number.isInteger(timePerQuestion) || timePerQuestion < 10 || timePerQuestion > 60)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'เวลาต่อข้อต้องอยู่ระหว่าง 10 ถึง 60 วินาที',
      });
    }

    const room = kahootService.createRoom({
      hostUserId,
      hostName,
      characterId,
      outfitId,
      accessoryId,
      categoryId,
      difficulty,
      questionCount,
      timePerQuestion,
    });

    res.json({
      status: 'success',
      message: 'Live quiz room created successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error creating live quiz room:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { playerId, displayName, characterId, outfitId, accessoryId } = req.body || {};

    if (typeof playerId !== 'string' || playerId.length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'กรุณาระบุรหัสผู้เล่น',
      });
    }

    if (typeof displayName !== 'string' || displayName.length < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'กรุณาระบุชื่อผู้เล่น',
      });
    }

    const room = kahootService.joinRoom(String(req.params.pin), {
      playerId,
      displayName,
      characterId,
      outfitId,
      accessoryId,
    });

    res.json({
      status: 'success',
      message: 'Joined live quiz room successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error joining live quiz room:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = kahootService.getRoom(String(req.params.pin));

    res.json({
      status: 'success',
      message: 'Live quiz room retrieved successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error fetching live quiz room:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
