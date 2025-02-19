
const apiMiddleware = (req, res, next) => {
    // Only GET is allowed
    if (req.method !== "GET") {
        return res.status(405).send();
    }

    // No payload is allowed
    if (parseInt(req.headers["content-length"] || "0", 10) > 0) {
        return res.status(400).send();
    }

    // No query parameters are allowed
    if (Object.keys(req.query).length > 0) {
        return res.status(400).send();
    }

    next();
};

// No 500 Internal Server Errors
const errorHandler = (err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(503).send();
};

export { apiMiddleware, errorHandler };
