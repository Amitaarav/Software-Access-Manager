import { Router } from 'express';
import { apiLimiter } from '../../middleware/rate-limit-middleware.js';
import { authenticate } from '../../middleware/auth-middleware.js';
import { authorizeRoles } from '../../middleware/role-middleware.js';
import { validateAccessRequest, validateRequestStatus } from '../../middleware/validation-middleware.js';
import * as requestController from '../../controllers/request-controller.js';

const router = Router();

router.use(authenticate);

router.post('/', apiLimiter, validateAccessRequest, requestController.createRequest);
router.get('/my-requests', apiLimiter, requestController.getUserRequests);
router.get('/:requestId/history', apiLimiter, requestController.getRequestHistory);

router.use(authorizeRoles(['Manager', 'Admin']));
router.get('/pending', apiLimiter, requestController.getPendingRequests);
router.put('/:id/status', apiLimiter, validateRequestStatus, requestController.updateRequestStatus);

export default router;