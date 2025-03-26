import multer from "multer";
import { logWithRequest } from "./logger.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            logWithRequest(req, 'error', `Invalid file type[${file.mimetype}]. Only JPEG, JPG, and PNG are allowed.`);
            cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
        }
    }
});

export const uploadMiddleware = (req, res, next) => {
    upload.single('profilePic')(req, res, (err) => {
        if (err) {
            return res.status(400).send();
        }
        next();
    });
};