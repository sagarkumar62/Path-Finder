import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body);

    res.cookie('accessToken', result.accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', result.refreshToken, getRefreshTokenCookieOptions());

    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'User registered successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body);

    res.cookie('accessToken', result.accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', result.refreshToken, getRefreshTokenCookieOptions());

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Logged in successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clearOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as any,
    };

    res.clearCookie('accessToken', clearOptions);
    res.clearCookie('refreshToken', clearOptions);

    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const refreshToken = tokenFromCookie || tokenFromBody;

    const result = await authService.refresh(refreshToken);

    res.cookie('accessToken', result.accessToken, getAccessTokenCookieOptions());
    res.cookie('refreshToken', result.refreshToken, getRefreshTokenCookieOptions());

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: result.accessToken,
        },
        'Token refreshed successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const user = await authService.getCurrentUser(userId);

    res.status(200).json(new ApiResponse(200, { user }, 'User retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;
    const user = await authService.updateCurrentUser(userId, req.body);

    res.status(200).json(new ApiResponse(200, { user }, 'User updated successfully'));
  } catch (error) {
    next(error);
  }
};
