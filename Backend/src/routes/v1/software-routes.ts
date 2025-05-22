import { Router } from 'express';
import { apiLimiter } from '../../middleware/rate-limit-middleware.js';
import { authenticate } from '../../middleware/auth-middleware.js';
import { authorizeRoles } from '../../middleware/role-middleware.js';
import { validateSoftwareCreation } from '../../middleware/validation-middleware.js';
import * as softwareController from '../../controllers/software-controller.js';

const router = Router();

router.use(authenticate);

router.get('/', apiLimiter, softwareController.getAllSoftware);
router.get('/:id', apiLimiter, softwareController.getSoftwareById);

router.use(authorizeRoles(['Admin']));
router.post('/', apiLimiter, validateSoftwareCreation, softwareController.createSoftware);
router.put('/:id', apiLimiter, validateSoftwareCreation, softwareController.updateSoftware);
router.delete('/:id', apiLimiter, softwareController.deleteSoftware);

export default router;