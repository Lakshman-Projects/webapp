
const apiMiddleware = (req, res, next) => {


    next();
};

// No 500 Internal Server Errors
const errorHandler = (err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(503).send();
};

export { apiMiddleware, errorHandler };
