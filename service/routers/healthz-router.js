import express from 'express';
import { getAppHealthz } from '../controllers/healthz-controller.js';
import { measureApiMetrics } from '../middlewares/statd-metrics.js';

const healthzRouter = express.Router();

// GET request to monitor the health of the application instance
healthzRouter.get('/', measureApiMetrics, getAppHealthz);

export default healthzRouter;
