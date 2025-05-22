import { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { AccessType } from '../entity/request-entity.js';
import { UserRole } from '../entity/user-entity.js';
import { StatusCodes } from 'http-status-codes'

const validateRequest: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.type,
        message: err.msg
      }))
    });
    return;
  }
  next();
};

export const validateRegistration = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest
] as RequestHandler[];

export const validateLogin = [
  body('usernameOrEmail')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
  validateRequest
] as RequestHandler[];

export const validateSoftwareCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Software name is required')
    .isLength({ min: 2 })
    .withMessage('Software name must be at least 2 characters long'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('accessLevels')
    .isArray()
    .withMessage('Access levels must be an array')
    .custom((value: string[]) => {
      const validLevels: AccessType[] = ['Read', 'Write', 'Admin'];
      return value.every(level => validLevels.includes(level as AccessType));
    })
    .withMessage('Invalid access levels. Must be Read, Write, or Admin'),
  validateRequest
] as RequestHandler[];

export const validateAccessRequest = [
  body('softwareId')
    .isInt()
    .withMessage('Software ID must be a number'),
  body('accessType')
    .isIn(['Read', 'Write', 'Admin'])
    .withMessage('Access type must be Read, Write, or Admin'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason is required')
    .isLength({ min: 10 })
    .withMessage('Reason must be at least 10 characters long'),
  validateRequest
] as RequestHandler[];

export const validateRequestStatus = [
  body('status')
    .isIn(['Approved', 'Rejected'])
    .withMessage('Status must be either Approved or Rejected'),
  validateRequest
] as RequestHandler[]; 