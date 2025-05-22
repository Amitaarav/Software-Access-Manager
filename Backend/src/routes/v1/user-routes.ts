import { Router } from 'express';
import { apiLimiter } from '../../middleware/rate-limit-middleware.js';
import { authenticate } from '../../middleware/auth-middleware.js';
import { authorizeRoles } from '../../middleware/role-middleware.js';
import * as userController from '../../controllers/user-controller.js';

const router = Router();

router.use(authenticate);

router.get('/profile', apiLimiter, userController.getUserProfile);
router.put('/profile', apiLimiter, userController.updateUserProfile);

router.use(authorizeRoles(['Admin']));
router.get('/statistics', apiLimiter, userController.getUserStatistics);
router.get('/search', apiLimiter, userController.searchUsers);
router.get('/by-role/:role', apiLimiter, userController.getUsersByRole);

router.put('/:userId/role', apiLimiter, userController.updateUserRole);
router.put('/:userId/status', apiLimiter, userController.toggleUserStatus);
router.get('/:userId', apiLimiter, userController.getUserById);
router.get('/', apiLimiter, userController.getAllUsers);

export default router; 