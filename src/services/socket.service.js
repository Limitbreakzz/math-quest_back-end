const multiplayerService = require('./multiplayer.service');

const registerBattleSocket = (io) => {
  io.on('connection', (socket) => {
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
  });
};

module.exports = { registerBattleSocket };
