const http = require('http');
const { Server: SocketIOServer } = require('socket.io');
const { createApp } = require('./app');
const env = require('./utils/env');
const prisma = require('./prisma');
const logger = require('./utils/logger');
const { registerBattleSocket } = require('./services/socket.service');

const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: env.corsOrigins,
    credentials: true,
  },
});

registerBattleSocket(io);

server.listen(env.port, () => {
  logger.info('MathQuest API server started', {
    port: env.port,
    nodeEnv: env.nodeEnv,
    url: `http://localhost:${env.port}/api`,
  });
});

const shutdown = async (signal) => {
  logger.info('Graceful shutdown initiated', { signal });
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Database connection closed cleanly');
      process.exit(0);
    } catch (error) {
      logger.fatal('Error during database disconnect', { errorMessage: error.message });
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.fatal('Unhandled Promise Rejection', {
    errorMessage: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
  });
});

process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught Exception', {
    errorMessage: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
