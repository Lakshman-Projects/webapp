import request from 'supertest';
import express from 'express';
import initialize from "../app.js";
import { logger } from '../middlewares/logger.js';

let app;
let server;
const startTime = Date.now();

beforeAll(async () => {
    logger.info("Initializing the integration test suite");

    app = express();    
    await initialize(app);
});

afterAll(async () => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    logger.info(`Integration test suite completed in ${duration} seconds`);
    
    setInterval(() => {
        process.exit(0);
    }, 2000);
});

describe('GET /healthz', () => {

    it('should return 200 OK if the record is inserted successfully', async () => {
        logger.info("Starting test: GET /healthz should return 200 OK");
        const response = await request(app).get('/healthz');

        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
        logger.info("Completed test: GET /healthz returned 200 OK");
    });

    it('should return 400 Bad Request if the request includes a payload', async () => {
        logger.info("Starting test: GET /healthz with payload should return 400");
        const response = await request(app).get('/healthz').send({ some: 'payload' });

        expect(response.statusCode).toBe(400);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
        logger.info("Completed test: GET /healthz with payload returned 400");
    });

    it('should return 405 Method Not Allowed for non-GET methods(post, put, delete, patch, head, options)', async () => {
        const methods = ['post', 'put', 'delete', 'patch', 'head', 'options'];

        for (const method of methods) {
            logger.info(`Starting test: ${method.toUpperCase()} /healthz should return 405`);
            const response = await request(app)[method]('/healthz');

            expect(response.statusCode).toBe(405);
            expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
            expect(response.body).toEqual({});
            logger.info(`Completed test: ${method.toUpperCase()} /healthz returned 405`);
        }
    });

    it('should return 400 Bad Request if query parameters are present', async () => {
        logger.info("Starting test: GET /healthz with query params should return 400");
        const response = await request(app).get('/healthz?id=99');

        expect(response.statusCode).toBe(400);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
        logger.info("Completed test: GET /healthz with query params returned 400");
    });

    it('should return 404 Not Found if any unknown path is requested', async () => {
        logger.info("Starting test: GET /healx should return 404");
        const response = await request(app).get('/healx');

        expect(response.statusCode).toBe(404);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
        logger.info("Completed test: GET /healx returned 404");
    });

    it('should not include any payload in the response', async () => {
        logger.info("Starting test: GET /healthz should return empty payload");
        const response = await request(app).get('/healthz');

        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
        logger.info("Completed test: GET /healthz returned empty payload");
    });
});
