import { Router,ErrorRequestHandler } from 'express';
import v1Router from './v1/index.js';
import { errorHandler } from '../middleware/error-middleware.js';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.use('/v1', v1Router);

router.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'OK', timestamp: new Date().toISOString() });
});

router.use(errorHandler as ErrorRequestHandler);

export default router;