import express from 'express';

const fileRouter = express.Router();

// POST request to upload a file
fileRouter.post('/', {});

// GET request to retrieve the file's s3 URL
fileRouter.get('/:id', {});

// DELETE request to delete a file
fileRouter.delete('/:id', {});

export default fileRouter;
