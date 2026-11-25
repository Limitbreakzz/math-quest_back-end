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
    questionCount: input.questionCount || 6,
    timePerQuestion: input.timePerQuestion || 20,
    status: 'WAITING',
    questionIds: [],
    questions: [],
    players: {
      [input.userId]: {
        userId: input.userId,
        displayName: input.displayName,
        characterId: input.characterId || 'char_nova',
        outfitId: input.outfitId || 'outfit_starter',
        accessoryId: input.accessoryId || undefined,
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

exports.joinRoom = (
  roomCode,
  userId,
  displayName,
  characterId = 'char_nova',
  outfitId = 'outfit_starter',
  accessoryId = undefined
) => {
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
    outfitId,
    accessoryId,
    ready: false,
    score: 0,
    correctAnswers: 0,
    currentIndex: 0,
    finished: false,
  };

  return room;
};

exports.leaveRoom = (roomCode, userId) => {
  const code = String(roomCode || '').toUpperCase();
  const room = rooms.get(code);
  if (!room) return null;

  delete room.players[userId];
  const remaining = Object.keys(room.players);
  if (remaining.length === 0) {
    rooms.delete(code);
    return null;
  }

  if (room.hostUserId === userId) {
    room.hostUserId = remaining[0];
  }
  if (room.status === 'IN_PROGRESS') {
    room.status = 'FINISHED';
    room.winnerUserId = remaining[0];
  }
  return room;
};

exports.setReady = (roomCode, userId, ready) => {
  const room = exports.getRoom(roomCode);
  if (room.players[userId]) {
    room.players[userId].ready = ready;
  }
  return room;
};

exports.startMatch = (roomCode, questionIds, questions = []) => {
  const room = exports.getRoom(roomCode);
  room.questionIds = Array.isArray(questionIds) ? questionIds : [];
  room.questions = Array.isArray(questions) ? questions : [];
  room.status = 'IN_PROGRESS';
  return room;
};

exports.submitAnswer = (roomCode, userId, scoreDelta, correct, finished) => {
  const room = exports.getRoom(roomCode);
  const player = room.players[userId];

  if (player) {
    player.score += Number(scoreDelta) || 0;
    if (correct) player.correctAnswers += 1;
    player.currentIndex += 1;
    player.finished = Boolean(finished);
  }

  const playerList = Object.values(room.players);
  if (playerList.length >= 2 && playerList.every((p) => p.finished)) {
    room.status = 'FINISHED';
    const sorted = [...playerList].sort((a, b) => b.score - a.score);
    room.winnerUserId = sorted[0].score === sorted[1].score ? 'DRAW' : sorted[0].userId;
  }

  return room;
};
