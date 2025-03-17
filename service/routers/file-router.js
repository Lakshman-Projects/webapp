import express from 'express';
import validateUUID from '../middlewares/idChecker.js';
import { uploadMiddleware } from '../middlewares/upload.js';
import { uploadFileHandler, getFileHandler, deleteFileHandler } from '../controllers/file-controller.js';

const fileRouter = express.Router();

// POST request to upload a file
fileRouter.post('/', uploadMiddleware, uploadFileHandler);

// GET request to retrieve the file's s3 URL
fileRouter.get('/:id', validateUUID, getFileHandler);

// DELETE request to delete a file
fileRouter.delete('/:id', validateUUID, deleteFileHandler);

// Other requests
fileRouter.get('/', (req, res) => {
    res.status(400).send();
});

fileRouter.delete('/', (req, res) => {
    res.status(400).send();
});

fileRouter.all('*', (req, res) => {
    res.status(405).send();
});

export default fileRouter;
