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
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a Winston logger instance (with timestamp and log level)
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
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

// Custom Morgan log format
const morganFormat = ":date[iso] :method :url :status :res[content-length] - :response-time ms";

// Morgan middleware setup to log requests in custom format (standardized) to the file and console
const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message) => {
            logger.info(`HTTP REQUEST: ${message.trim()}`);
        },
    },
});

export { logger, morganMiddleware };
