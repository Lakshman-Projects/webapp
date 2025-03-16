import { uploadFile, getFile } from "../services/file-service.js";

export const uploadFileHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send();
        }

        const fileData = await uploadFile(req.file);
        res.status(201).json(fileData);
    } catch (error) {
        res.status(500).send();
    }
};

export const getFileHandler = async (req, res) => {
    try {
        const fileId = req.params.id;
        const fileData = await getFile(fileId);
        res.status(200).json(fileData);
    } catch (error) {
        if (error.message === "File not found") {
            res.status(404).send();
        } else {
            res.status(500).send();
        }
    }
};