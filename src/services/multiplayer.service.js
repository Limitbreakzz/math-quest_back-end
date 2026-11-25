const crypto = require('crypto');
const ERROR_CODES = require('../constants/errorCodes');
const { AppError } = require('../middlewares/error.middleware');

const rooms = new Map();
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateRoomCode = () => {
  const bytes = crypto.randomBytes(6);
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
};

exports.createRoom = (input) => {
  const roomCode = generateRoomCode();
  const room = {
    roomCode,
    hostUserId: input.userId,
    categoryId: input.categoryId || 'arithmetic',
    difficulty: input.difficulty || 'MEDIUM',
    questionCount: input.questionCount || 10,
    timePerQuestion: input.timePerQuestion || 20,
    status: 'WAITING',
    questionIds: [],
    players: {
      [input.userId]: {
        userId: input.userId,
        displayName: input.displayName,
        characterId: input.characterId || 'char_nova',
        ready: true,
        score: 0,
        correctAnswers: 0,
        currentIndex: 0,
        finished: false,
      },
    },
    createdAt: new Date().toISOString(),
  };

  rooms.set(roomCode, room);
  return room;
};

exports.getRoom = (roomCode) => {
  const room = rooms.get(String(roomCode || '').toUpperCase());
  if (!room) {
    throw new AppError(ERROR_CODES.BATTLE_ROOM_NOT_FOUND);
  }
  return room;
};

exports.joinRoom = (roomCode, userId, displayName, characterId = 'char_nova') => {
  const room = exports.getRoom(roomCode);

  if (room.status !== 'WAITING') {
    throw new AppError(ERROR_CODES.BATTLE_MATCH_STARTED);
  }
  if (Object.keys(room.players).length >= 2 && !room.players[userId]) {
    throw new AppError(ERROR_CODES.BATTLE_ROOM_FULL);
  }

  room.players[userId] = {
    userId,
    displayName,
    characterId,
    ready: false,
    score: 0,
    correctAnswers: 0,
    currentIndex: 0,
    finished: false,
  };

  return room;
};

exports.setReady = (roomCode, userId, ready) => {
  const room = exports.getRoom(roomCode);
  if (room.players[userId]) {
    room.players[userId].ready = ready;
  }
  return room;
};

exports.startMatch = (roomCode, questionIds) => {
  const room = exports.getRoom(roomCode);
  room.questionIds = questionIds;
  room.status = 'IN_PROGRESS';
  return room;
};

exports.submitAnswer = (roomCode, userId, scoreDelta, correct, finished) => {
  const room = exports.getRoom(roomCode);
  const player = room.players[userId];

  if (player) {
    player.score += scoreDelta;
    if (correct) player.correctAnswers += 1;
    player.currentIndex += 1;
    player.finished = finished;
  }

  const playerList = Object.values(room.players);
  if (playerList.length >= 2 && playerList.every((p) => p.finished)) {
    room.status = 'FINISHED';
    const sorted = [...playerList].sort((a, b) => b.score - a.score);
    room.winnerUserId = sorted[0].score === sorted[1].score ? 'DRAW' : sorted[0].userId;
  }

  return room;
};
