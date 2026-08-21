import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyAccessToken } from './utils/jwt';
import { logger } from './utils/logger';
import { env } from './config/env';

export const PROGRESS_EVENTS = {
  UPDATED: 'progress:updated',
  MILESTONE_COMPLETED: 'progress:milestone-completed',
  MILESTONE_STARTED: 'progress:milestone-started',
  PHASE_COMPLETED: 'progress:phase-completed',
  SUMMARY_UPDATED: 'progress:summary-updated',
  SKILL_ACQUIRED: 'progress:skill-acquired',
} as const;

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  const allowedOrigins = (env.FRONTEND_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .concat(['http://localhost:3000', 'http://127.0.0.1:3000'])
    .filter(Boolean);

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, '');
        if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes('*')) {
          return callback(null, cleanOrigin);
        }
        return callback(null, cleanOrigin);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
    transports: ['websocket', 'polling'],
  });

  // JWT Socket Authentication Middleware
  io.use((socket, next) => {
    try {
      let token =
        socket.handshake.auth?.token ||
        (socket.handshake.headers?.authorization
          ? socket.handshake.headers.authorization.replace(/^Bearer\s+/i, '')
          : undefined) ||
        (socket.handshake.query?.token as string | undefined);

      if (!token && socket.handshake.headers?.cookie) {
        const cookieHeader = socket.handshake.headers.cookie;
        const match = cookieHeader.match(/accessToken=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }

      if (token) {
        const decoded = verifyAccessToken(token);
        socket.data.userId = decoded.userId;
        return next();
      }

      const userId = socket.handshake.auth?.userId || (socket.handshake.query?.userId as string);
      if (userId) {
        socket.data.userId = userId;
        return next();
      }

      logger.warn(`[Socket] Connection rejected: Token or userId missing`);
      return next(new Error('Authentication error: Credentials missing'));
    } catch (err: any) {
      logger.warn(`[Socket] Authentication failed: ${err.message}`);
      next(new Error(`Authentication error: ${err.message}`));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    if (userId) {
      const userRoom = `user:${userId}`;
      socket.join(userRoom);
      logger.info(`[Socket] Client connected | User: ${userId} | Joined Room: ${userRoom} | Socket: ${socket.id}`);

      socket.on('disconnect', (reason) => {
        logger.info(`[Socket] Client disconnected | User: ${userId} | Reason: ${reason}`);
      });
    }
  });

  logger.info(`[Socket] Socket.io server initialized.`);
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet.');
  }
  return io;
};

export const emitProgressEvent = (userId: string, event: string, payload: any): void => {
  if (!io) {
    logger.warn(`[Socket] Cannot emit event '${event}': Socket.io not initialized`);
    return;
  }
  const userRoom = `user:${userId}`;
  io.to(userRoom).emit(event, payload);
  logger.info(`[Socket] Emitted event '${event}' to room '${userRoom}'`);
};
