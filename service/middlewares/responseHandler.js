import { logWithRequest } from "./logger.js";

const apiMiddleware = (req, res, next) => {
    // Only GET is allowed
    if (req.method !== "GET") {
        logWithRequest(req, "warn", `Method not allowed: ${req.method}`);
        console.log(req.logData);
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

const apiFileMiddleware = (req, res, next) => {
    if (req.method === "HEAD") {
        logWithRequest(req, "warn", `Method not allowed: ${req.method}`);
        return res.status(405).send();
    }
    next();
}

// No 500 Internal Server Errors
const errorHandler = (err, req, res, next) => {
    logWithRequest(req, "error", err.message);
    console.error("Unhandled error:", err);
    res.status(503).send();
};

export { apiMiddleware, apiFileMiddleware, errorHandler };
