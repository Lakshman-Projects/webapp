import morgan from "morgan";
import winston from "winston";
import fs from "fs";
import path from "path";

// Create the logs folder if it doesn't exist
const logsDirectory = path.join("logs");
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory, { recursive: true });
}

// Custom log format function
const logFormat = winston.format.printf(({ timestamp, level, message, method, url, status, responseTime }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]:`;
    if (method && url) {
        logMessage += ` ${method} ${url} ${status}`;
    }
    if (message) {
        logMessage += ` - ${message}`;
    }
    if (responseTime) {
        logMessage += ` (${responseTime} ms)`;
    }
    return logMessage;
});

// Create a Winston logger instance
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: () => new Date().toISOString() }),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            filename: "logs/app.log",
            level: "info",
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

// Middleware to attach log data to the request object
const attachLogData = (req, res, next) => {
    req.logData = {};
    const originalSend = res.send;
    res.send = function (body) {
        req.logData.status = res.statusCode;
        originalSend.call(this, body);
    };
    next();
};

// Custom Morgan middleware to log combined data after response
const morganMiddleware = morgan((tokens, req, res) => {
    const logData = {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        responseTime: tokens["response-time"](req, res),
        message: req.logData.message || "Request processed",
    };

    const logLevel = req.logData.level || (parseInt(logData.status) >= 500 ? "error" : (parseInt(logData.status) >= 400 ? "warn" : "info"));
    logger[logLevel]("", logData);

    return null; // Morgan won't log separately
}, { immediate: false });

// Helper function to log with request context
const logWithRequest = (req, level, message) => {
    req.logData = req.logData || {};
    req.logData.message = message;
    req.logData.level = level;
};

export { logger, morganMiddleware, attachLogData, logWithRequest };