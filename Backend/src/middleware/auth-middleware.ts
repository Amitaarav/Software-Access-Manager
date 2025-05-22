import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../entity/user-entity.js";
import { StatusCodes } from "http-status-codes"; 
import { config } from '../config/config.js';
import { AppError } from '../utils/app-error.js';

interface DecodedToken {
  id: number;
  userId: number;
  username?: string;
  role?: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: number };
    req.user = { id: decoded.userId, userId: decoded.userId };
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const authorizeRoles = (roles: UserRole[]) => {
    return(req: Request, res: Response, next: NextFunction): void | Promise<void>  => {
    if (!req.user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        error: "Authentication Required",
        message: "You must be logged in to access this resource" 
      });
      return;
    }

    if (!req.user?.role || !roles.includes(req.user.role)) {
      res.status(StatusCodes.FORBIDDEN).json({ 
        error: "Access Denied",
        message: `This action requires one of the following roles: ${roles.join(", ")}` 
      });
      return;
    }

    next();
  };
};