import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    const code = error.code || 'INTERNAL_ERROR';
    const errors = error.errors || {};

    error = new ApiError(statusCode, message, errors, code, err.stack);
  }

  logger.error(`API Error [${req.method} ${req.url}]:`, {
    statusCode: error.statusCode,
    message: error.message,
    code: error.code,
    details: error.errors,
  });

  const response = {
    success: false,
    message: error.message,
    error: {
      code: error.code || 'ERROR',
      details: error.errors || {},
      ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    },
  };

  res.status(error.statusCode).json(response);
};
