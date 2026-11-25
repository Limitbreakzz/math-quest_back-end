const crypto = require('crypto');

const rooms = new Map();

const generatePin = () => {
  let pin;
  do {
    pin = String(crypto.randomInt(100000, 999999));
  } while (rooms.has(pin));
  return pin;
};

const serializeRoom = (room) => {
  const players = Object.values(room.players).sort((a, b) => b.score - a.score);
  const currentQuestion = room.questions[room.currentIndex] || null;
  const answeredCount = Object.keys(room.currentAnswers).length;

  // Build option distribution when in REVEAL
  const optionCounts = {};
  if (currentQuestion && Array.isArray(currentQuestion.options)) {
    for (const opt of currentQuestion.options) {
      optionCounts[opt.id] = 0;
    }
  }
  for (const ans of Object.values(room.currentAnswers)) {
    if (ans.optionId && optionCounts[ans.optionId] !== undefined) {
      optionCounts[ans.optionId] += 1;
    }
  }

  return {
    pin: room.pin,
    hostUserId: room.hostUserId,
    hostName: room.hostName,
    categoryId: room.categoryId,
    difficulty: room.difficulty,
    questionCount: room.questionCount,
    timePerQuestion: room.timePerQuestion,
    status: room.status, // LOBBY | QUESTION | REVEAL | PODIUM
    currentIndex: room.currentIndex,
    totalQuestions: room.questions.length || room.questionCount,
    questionStartedAt: room.questionStartedAt,
    currentQuestion:
      room.status === 'QUESTION' && currentQuestion
        ? {
            id: currentQuestion.id,
            promptTh: currentQuestion.promptTh,
            promptEn: currentQuestion.promptEn,
            options: currentQuestion.options,
            points: currentQuestion.points,
          }
        : room.status === 'REVEAL' && currentQuestion
          ? currentQuestion
          : null,
    answeredCount,
    answeredPlayerIds: Object.keys(room.currentAnswers),
    optionCounts,
    players,
    createdAt: room.createdAt,
  };
};

exports.createRoom = (input) => {
  const pin = generatePin();
  const room = {
    pin,
    hostUserId: input.hostUserId,
    hostName: input.hostName || 'Host',
    categoryId: input.categoryId || 'arithmetic',
    difficulty: input.difficulty || 'MEDIUM',
    questionCount: input.questionCount || 8,
    timePerQuestion: input.timePerQuestion || 20,
    status: 'LOBBY',
    currentIndex: 0,
    questionStartedAt: null,
    questions: [],
    currentAnswers: {},
    players: {
      [input.hostUserId]: {
        playerId: input.hostUserId,
        displayName: input.hostName || 'Host',
        characterId: input.characterId || 'char_nova',
        outfitId: input.outfitId || 'outfit_starter',
        accessoryId: input.accessoryId || undefined,
        isHost: true,
        score: 0,
        lastDelta: 0,
        lastCorrect: null,
        correctAnswers: 0,
        streak: 0,
      },
    },
    createdAt: new Date().toISOString(),
  };

  rooms.set(pin, room);
  return serializeRoom(room);
};

exports.getRoom = (pin) => {
  const room = rooms.get(String(pin || '').trim());
  if (!room) {
    throw new Error('Room not found');
  }
  return serializeRoom(room);
};

exports.joinRoom = (pin, input) => {
  const room = rooms.get(String(pin || '').trim());
  if (!room) {
    throw new Error('Room not found');
  }
  if (room.status !== 'LOBBY' && !room.players[input.playerId]) {
    throw new Error('Game already started');
  }
  if (Object.keys(room.players).length >= 50 && !room.players[input.playerId]) {
    throw new Error('Room is full');
  }

  if (!room.players[input.playerId]) {
    room.players[input.playerId] = {
      playerId: input.playerId,
      displayName: input.displayName,
      characterId: input.characterId || 'char_nova',
      outfitId: input.outfitId || 'outfit_starter',
      accessoryId: input.accessoryId || undefined,
      isHost: false,
      score: 0,
      lastDelta: 0,
      lastCorrect: null,
      correctAnswers: 0,
      streak: 0,
    };
  }

  return serializeRoom(room);
};

exports.startGame = (pin, questions) => {
  const room = rooms.get(String(pin || '').trim());
  if (!room) {
    throw new Error('Room not found');
  }
  room.questions = Array.isArray(questions) ? questions : [];
  room.currentIndex = 0;
  room.currentAnswers = {};
  room.status = 'QUESTION';
  room.questionStartedAt = Date.now();

  for (const player of Object.values(room.players)) {
    player.score = 0;
    player.lastDelta = 0;
    player.lastCorrect = null;
    player.correctAnswers = 0;
    player.streak = 0;
  }

  return serializeRoom(room);
};

exports.submitAnswer = (pin, playerId, optionId) => {
  const room = rooms.get(String(pin || '').trim());
  if (!room) {
    throw new Error('Room not found');
  }
  if (room.status !== 'QUESTION') {
    return serializeRoom(room);
  }
  const player = room.players[playerId];
  const currentQ = room.questions[room.currentIndex];
  if (!player || !currentQ || room.currentAnswers[playerId]) {
    return serializeRoom(room);
  }

  const totalMs = room.timePerQuestion * 1000;
  const elapsedMs = Math.max(0, Date.now() - (room.questionStartedAt || Date.now()));
  const remainingRatio = Math.max(0, Math.min(1, (totalMs - elapsedMs) / totalMs));
  const isCorrect = optionId === currentQ.correctOptionId;

  let pointsEarned = 0;
  if (isCorrect) {
    player.streak += 1;
    player.correctAnswers += 1;
    const speedBonus = Math.round(500 * remainingRatio);
    const streakBonus = Math.min(300, Math.max(0, player.streak - 1) * 100);
    pointsEarned = 500 + speedBonus + streakBonus;
    player.score += pointsEarned;
  } else {
    player.streak = 0;
  }

  player.lastDelta = pointsEarned;
  player.lastCorrect = isCorrect;

  room.currentAnswers[playerId] = {
    optionId,
    isCorrect,
    pointsEarned,
  };

  // Auto-reveal if every player in the room has answered
  const totalPlayers = Object.keys(room.players).length;
  if (Object.keys(room.currentAnswers).length >= totalPlayers) {
    room.status = 'REVEAL';
  }

  return serializeRoom(room);
};

exports.revealQuestion = (pin) => {
  const room = rooms.get(String(pin || '').trim());
  if (!room) {
    throw new Error('Room not found');
  }
  if (room.status === 'QUESTION') {
    for (const player of Object.values(room.players)) {
      if (!room.currentAnswers[player.playerId]) {
        player.streak = 0;
        player.lastDelta = 0;
        player.lastCorrect = false;
      }
    }
    room.status = 'REVEAL';
  }
  return serializeRoom(room);
};

exports.nextQuestion = (pin) => {
  const room = rooms.get(String(pin || '').trim());
  if (!room) {
    throw new Error('Room not found');
  }

  const nextIdx = room.currentIndex + 1;
  if (nextIdx >= room.questions.length) {
    room.status = 'PODIUM';
    return serializeRoom(room);
  }

  room.currentIndex = nextIdx;
  room.currentAnswers = {};
  room.status = 'QUESTION';
  room.questionStartedAt = Date.now();
  for (const player of Object.values(room.players)) {
    player.lastDelta = 0;
    player.lastCorrect = null;
  }
  return serializeRoom(room);
};

exports.leaveRoom = (pin, playerId) => {
  const code = String(pin || '').trim();
  const room = rooms.get(code);
  if (!room) return null;

  delete room.players[playerId];
  const remaining = Object.keys(room.players);
  if (remaining.length === 0) {
    rooms.delete(code);
    return null;
  }
  if (room.hostUserId === playerId) {
    room.hostUserId = remaining[0];
    room.players[remaining[0]].isHost = true;
  }
  return serializeRoom(room);
};
