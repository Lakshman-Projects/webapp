import { uploadFile } from "../services/file-service.js";

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