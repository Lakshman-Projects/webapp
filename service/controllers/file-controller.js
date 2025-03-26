import { uploadFile, getFile, deleteFile } from "../services/file-service.js";
import { logWithRequest } from "../middlewares/logger.js";

export const uploadFileHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send();
        }

        const fileData = await uploadFile(req.file);
        res.status(201).json(fileData);
    } catch (error) {
        logWithRequest(req, "error", error.message || "Unable to upload file");
        res.status(503).send();
    }
};

export const getFileHandler = async (req, res) => {
    try {
        const fileId = req.params.id;
        const fileData = await getFile(fileId);
        res.status(200).json(fileData);
    } catch (error) {
        if (error.message === "File not found") {
            logWithRequest(req, "warn", "File not found for the given ID");
            res.status(404).send();
        } else {
            logWithRequest(req, "error", error.message || "Unable to get file");
            res.status(503).send();
        }
    }
};

export const deleteFileHandler = async (req, res) => {
    try {
        const fileId = req.params.id;
        await deleteFile(fileId);
        res.status(204).send();
    } catch (error) {
        if (error.message === "File not found") {
            logWithRequest(req, "warn", "File not found for the given ID");
            res.status(404).send();
        } else {
            logWithRequest(req, "error", error.message || "Unable to delete file");
            res.status(503).send();
        }
    }
};