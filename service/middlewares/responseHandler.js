
const apiMiddleware = (req, res, next) => {
    // No payload is allowed
    if (req.method === "GET" && Object.keys(req.body || {}).length > 0) {
        return res.status(400).send();
    }

    // Only GET is allowed
    if (req.method !== "GET") {
        return res.status(405).send();
    }

    next();
};

// No 500 Internal Server Errors
const errorHandler = (err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(503).send();
};

export { apiMiddleware, errorHandler };
