import { logWithRequest } from "./logger.js";

const apiMiddleware = (req, res, next) => {
    // Only GET is allowed
    if (req.method !== "GET") {
        logWithRequest(req, "warn", `Method not allowed: ${req.method}`);
        return res.status(405).send();
    }

    // No payload is allowed
    if (parseInt(req.headers["content-length"] || "0", 10) > 0) {
        logWithRequest(req, "warn", "Payload not allowed");
        return res.status(400).send();
    }

    // No query parameters are allowed
    if (Object.keys(req.query).length > 0) {
        logWithRequest(req, "warn", "Query parameters not allowed");
        return res.status(400).send();
    }

    next();
};

// No 500 Internal Server Errors
const errorHandler = (err, req, res, next) => {
    req.logData = req.logData || { message: null, level: null };
    logWithRequest(req, "error", err.message || "Unhandled server error");
    res.status(503);
    if (!res.headersSent) {
        res.send();
    }
    console.error("Unhandled error:", err);
};

export { apiMiddleware, errorHandler };
