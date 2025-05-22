import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { UserRole } from '../entity/user-entity.js';
import userRepository from '../repositories/user-repository.js';

export const authorizeRoles = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new AppError('Authentication required', 401);
      }

      const user = await userRepository.findById(req.user.userId);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (!roles.includes(user.role)) {
        throw new AppError('Access denied. Insufficient permissions.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 