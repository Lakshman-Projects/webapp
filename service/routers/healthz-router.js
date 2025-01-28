import express from 'express';
import { getAppHealthz } from '../controllers/healthz-controller.js';

const healthzRouter = express.Router();

// GET request to monitor the health of the application instance
healthzRouter.get('/', getAppHealthz);

export default healthzRouter;
