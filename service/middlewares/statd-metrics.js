import StatsD from 'node-statsd';
import { performance } from 'perf_hooks';
import { logger } from './logger.js';

const statsd = new StatsD({ host: 'localhost', port: 8125 });

// Middleware to measure API call duration and count
const measureApiMetrics = (req, res, next) => {
    const start = performance.now();
    let apiPath = req.originalUrl;
    if (req.params && req.params.id) {
        apiPath = apiPath.replace("/" + req.params.id, '');
    }

    const apiName = req.method + apiPath.replace(/\//g, '_') || 'root';
    console.log(`API call: ${apiName}`);

    res.on('finish', () => {
        const duration = performance.now() - start;
        statsd.increment(`api.${apiName}.count`);
        statsd.timing(`api.${apiName}.duration`, duration);
    });

    next();
};

// Function to measure database query duration
const measureDbQuery = async (queryFn, queryName = 'unknown') => {
    const start = performance.now();
    try {
        const result = await queryFn();
        const duration = performance.now() - start;
        statsd.timing(`db.query.${queryName}.duration`, duration);
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        statsd.timing(`db.query.${queryName}.duration`, duration);
        logger.error(`DB query ${queryName} failed in ${duration.toFixed(2)}ms: ${error.message}`, { stack: error.stack });
        throw error;
    }
};

// Function to measure S3 call duration
const measureS3Call = async (s3Fn, operationName = 'unknown') => {
    const start = performance.now();
    try {
        const result = await s3Fn();
        const duration = performance.now() - start;
        statsd.timing(`s3.call.${operationName}.duration`, duration);
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        statsd.timing(`s3.call.${operationName}.duration`, duration);
        logger.error(`S3 call ${operationName} failed in ${duration.toFixed(2)}ms: ${error.message}`, { stack: error.stack });
        throw error;
    }
};

export { statsd, measureApiMetrics, measureDbQuery, measureS3Call };