import { validate as isUuid } from 'uuid';
import { logWithRequest } from "./logger.js";

const validateUUID = (req, res, next) => {
    const { id } = req.params;

    if (!isUuid(id)) {
        logWithRequest(req, "error", "Request with invalid UUID");
        return res.status(400).send();
    }

    next();
};

export default validateUUID;
