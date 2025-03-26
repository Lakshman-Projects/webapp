import express from 'express';
import validateUUID from '../middlewares/idChecker.js';
import { uploadMiddleware } from '../middlewares/upload.js';
import { logWithRequest } from '../middlewares/logger.js';
import { measureApiMetrics } from '../middlewares/statd-metrics.js';
import { uploadFileHandler, getFileHandler, deleteFileHandler } from '../controllers/file-controller.js';

const fileRouter = express.Router();

// HEAD request
fileRouter.head('/', (req, res) => {
    logWithRequest(req, "warn", `Method not allowed: ${req.method}`);
    res.status(405).send();
});

fileRouter.head('/:id', (req, res) => {
    logWithRequest(req, "warn", `Method not allowed: ${req.method}`);
    res.status(405).send();
});

// POST request to upload a file
fileRouter.post('/', measureApiMetrics, uploadMiddleware, uploadFileHandler);

// GET request to retrieve the file's s3 URL
fileRouter.get('/:id', measureApiMetrics, validateUUID, getFileHandler);

// DELETE request to delete a file
fileRouter.delete('/:id', measureApiMetrics, validateUUID, deleteFileHandler);

// Other requests
fileRouter.get('/', (req, res) => {
    logWithRequest(req, "warn", "File ID not provided");
    res.status(400).send();
});

fileRouter.delete('/', (req, res) => {
    logWithRequest(req, "warn", "File ID not provided");
    res.status(400).send();
});

fileRouter.all('*', (req, res) => {
    logWithRequest(req, "warn", `Method not allowed: ${req.method}`);
    res.status(405).send();
});

export default fileRouter;
