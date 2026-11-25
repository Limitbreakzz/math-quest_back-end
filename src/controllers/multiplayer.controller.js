const multiplayerService = require('../services/multiplayer.service');

const ALLOWED_DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

exports.createRoom = async (req, res) => {
  try {
    const {
      userId,
      displayName,
      characterId,
      categoryId,
      difficulty,
      questionCount,
      timePerQuestion,
    } = req.body || {};

    if (typeof userId !== 'string' || userId.length < 1) {
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

    if (characterId !== undefined && typeof characterId !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'รหัสตัวละครไม่ถูกต้อง',
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

    if (
      questionCount !== undefined &&
      (!Number.isInteger(questionCount) || questionCount < 3 || questionCount > 20)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'จำนวนข้อต้องเป็นจำนวนเต็มระหว่าง 3 ถึง 20 ข้อ',
      });
    }

    if (
      timePerQuestion !== undefined &&
      (!Number.isInteger(timePerQuestion) || timePerQuestion < 10 || timePerQuestion > 60)
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'เวลาต่อข้อต้องเป็นจำนวนเต็มระหว่าง 10 ถึง 60 วินาที',
      });
    }

    const room = multiplayerService.createRoom({
      userId,
      displayName,
      characterId,
      categoryId,
      difficulty,
      questionCount,
      timePerQuestion,
    });

    res.json({
      status: 'success',
      message: 'Battle room created successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error creating battle room:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { userId, displayName, characterId } = req.body || {};

    if (typeof userId !== 'string' || userId.length < 1) {
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

    if (characterId !== undefined && typeof characterId !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'รหัสตัวละครไม่ถูกต้อง',
      });
    }

    const room = multiplayerService.joinRoom(
      String(req.params.roomCode),
      userId,
      displayName,
      characterId
    );

    res.json({
      status: 'success',
      message: 'Joined battle room successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error joining battle room:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = multiplayerService.getRoom(String(req.params.roomCode));

    res.json({
      status: 'success',
      message: 'Battle room retrieved successfully',
      data: room,
    });
  } catch (error) {
    console.error('Error fetching battle room:', error);

    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
