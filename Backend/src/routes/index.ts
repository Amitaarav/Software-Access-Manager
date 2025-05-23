import { Router,ErrorRequestHandler } from 'express';
import v1Router from './v1/index.js';
import { errorHandler } from '../middleware/error-middleware.js';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../database/data-source.js';

const router = Router();

router.use('/v1', v1Router);

// Healthy and unhealthy checks
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    // checks if database connection is alive
    await AppDataSource.query('SELECT 1'); // SELECT 1 is one of the fastest queries to check if the database is alive
    // It does not access any table, does not return any meaningful data
    // it just confirms the database can execute queries
    
    res.status(StatusCodes.OK).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'running'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

router.use(errorHandler as ErrorRequestHandler);

export default router;