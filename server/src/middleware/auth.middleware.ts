import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & { _id: string };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication token missing. Please log in.');
    }

    const decoded = verifyAccessToken(token);

    const userExists = await User.findById(decoded.userId).lean();
    if (!userExists) {
      throw ApiError.unauthorized('User associated with this token no longer exists.');
    }

    req.user = {
      ...decoded,
      _id: decoded.userId,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      next(ApiError.unauthorized('Invalid or expired authentication token.'));
    } else {
      next(error);
    }
  }
};
