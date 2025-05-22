import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later',
    errors: err.errors || []
  };

  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = 'Validation Error';
    customError.errors = Object.values(err).map((item: any) => item.message);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    customError.statusCode = StatusCodes.CONFLICT;
    customError.message = 'Duplicate value entered';
    customError.errors = Object.values(err).map((item: any) => item.message);
  }

  if (err.name === 'JsonWebTokenError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.message = 'Token expired';
  }

  res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    errors: customError.errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}; 