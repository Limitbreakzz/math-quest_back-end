const multiplayerService = require('./multiplayer.service');
const kahootService = require('./kahoot.service');

const registerBattleSocket = (io) => {
  io.on('connection', (socket) => {
    // -------------------------------------------------------------------------
    // 1v1 Battle Room Events
    // -------------------------------------------------------------------------
    socket.on('room:join', ({ roomCode }) => {
      try {
        const room = multiplayerService.getRoom(roomCode);
        socket.join(room.roomCode);
        io.to(room.roomCode).emit('room:update', room);
      } catch (error) {
        socket.emit('room:error', { message: error.message || 'Room not found' });
      }
    });

    socket.on('room:ready', ({ roomCode, userId, ready }) => {
      try {
        const room = multiplayerService.setReady(roomCode, userId, ready);
        io.to(room.roomCode).emit('room:update', room);
      } catch (error) {
        socket.emit('room:error', { message: error.message || 'Failed to update ready state' });
      }
    });

    socket.on('room:start', ({ roomCode, questionIds, questions }) => {
      try {
        const room = multiplayerService.startMatch(roomCode, questionIds, questions);
        io.to(room.roomCode).emit('room:update', room);
      } catch (error) {
        socket.emit('room:error', { message: error.message || 'Failed to start match' });
      }
    });

    socket.on('room:answer', ({ roomCode, userId, scoreDelta, correct, finished }) => {
      try {
        const room = multiplayerService.submitAnswer(roomCode, userId, scoreDelta, correct, finished);
        io.to(room.roomCode).emit('room:update', room);
      } catch (error) {
        socket.emit('room:error', { message: error.message || 'Failed to submit answer' });
      }
    });

    socket.on('room:leave', ({ roomCode, userId }) => {
      try {
        const code = String(roomCode || '').toUpperCase();
        socket.leave(code);
        const room = multiplayerService.leaveRoom(code, userId);
        if (room) {
          io.to(code).emit('room:update', room);
        }
      } catch (error) {
        socket.emit('room:error', { message: error.message || 'Failed to leave room' });
      }
    });

    // -------------------------------------------------------------------------
    // Kahoot-style Live Quiz Room Events
    // -------------------------------------------------------------------------
    socket.on('kahoot:join', ({ pin }) => {
      try {
        const room = kahootService.getRoom(pin);
        const channel = `kahoot_${room.pin}`;
        socket.join(channel);
        io.to(channel).emit('kahoot:update', room);
      } catch (error) {
        socket.emit('kahoot:error', { message: error.message || 'Live quiz room not found' });
      }
    });

    socket.on('kahoot:start', ({ pin, questions }) => {
      try {
        const room = kahootService.startGame(pin, questions);
        io.to(`kahoot_${room.pin}`).emit('kahoot:update', room);
      } catch (error) {
        socket.emit('kahoot:error', { message: error.message || 'Failed to start live quiz' });
      }
    });

    socket.on('kahoot:answer', ({ pin, playerId, optionId }) => {
      try {
        const room = kahootService.submitAnswer(pin, playerId, optionId);
        io.to(`kahoot_${room.pin}`).emit('kahoot:update', room);
      } catch (error) {
        socket.emit('kahoot:error', { message: error.message || 'Failed to submit answer' });
      }
    });

    socket.on('kahoot:reveal', ({ pin }) => {
      try {
        const room = kahootService.revealQuestion(pin);
        io.to(`kahoot_${room.pin}`).emit('kahoot:update', room);
      } catch (error) {
        socket.emit('kahoot:error', { message: error.message || 'Failed to reveal answer' });
      }
    });

    socket.on('kahoot:next', ({ pin }) => {
      try {
        const room = kahootService.nextQuestion(pin);
        io.to(`kahoot_${room.pin}`).emit('kahoot:update', room);
      } catch (error) {
        socket.emit('kahoot:error', { message: error.message || 'Failed to advance question' });
      }
    });

    socket.on('kahoot:leave', ({ pin, playerId }) => {
      try {
        const code = String(pin || '').trim();
        socket.leave(`kahoot_${code}`);
        const room = kahootService.leaveRoom(code, playerId);
        if (room) {
          io.to(`kahoot_${code}`).emit('kahoot:update', room);
        }
      } catch (error) {
        socket.emit('kahoot:error', { message: error.message || 'Failed to leave live quiz' });
      }
    });
  });
};

module.exports = { registerBattleSocket };
