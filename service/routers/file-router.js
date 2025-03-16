import express from 'express';
import validateUUID from '../middlewares/idChecker.js';
import { uploadFileHandler, getFileHandler, deleteFileHandler } from '../controllers/file-controller.js';

const fileRouter = express.Router();

// POST request to upload a file
fileRouter.post('/', uploadFileHandler);

// GET request to retrieve the file's s3 URL
fileRouter.get('/:id', validateUUID, getFileHandler);

// DELETE request to delete a file
fileRouter.delete('/:id', validateUUID, deleteFileHandler);

export default fileRouter;
