import { Router } from 'express';
import { authLimiter } from '../../middleware/rate-limit-middleware.js';
import { validateLogin, validateRegistration } from '../../middleware/validation-middleware.js';
import * as authController from '../../controllers/auth-controller.js';

const router = Router();

router.post('/register', authLimiter, validateRegistration, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/refresh-token', authLimiter, authController.refreshToken);
router.post('/logout', authLimiter, authController.logout);

export default router;