import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issueMap: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path.join('.');
          issueMap[path || 'body'] = issue.message;
        });

        next(ApiError.badRequest('Validation failed', issueMap, 'VALIDATION_ERROR'));
      } else {
        next(error);
      }
    }
  };
};
