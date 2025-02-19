import request from 'supertest';
import express from 'express';
import initialize from "../app.js";


beforeAll(async () => {
    app = express();
    await initialize(app);
});

describe('GET /healthz', () => {

    it('should return 200 OK if the record is inserted successfully', async () => {
        const response = await request(app).get('/healthz');

        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
    });

    it('should return 400 Bad Request if the request includes a payload', async () => {
        const response = await request(app).get('/healthz').send({ some: 'payload' });

        expect(response.statusCode).toBe(400);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
    });

    it('should return 405 Method Not Allowed for non-GET methods(post, put, delete, patch, head, options)', async () => {
        const methods = ['post', 'put', 'delete', 'patch', 'head', 'options'];

        for (const method of methods) {
            const response = await request(app)[method]('/healthz');

            expect(response.statusCode).toBe(405);
            expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
            expect(response.body).toEqual({});
        }
    });

    it('should return 400 Bad Request if query parameters are present', async () => {
        const response = await request(app).get('/healthz?id=99');

        expect(response.statusCode).toBe(400);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
    });

    it('should return 404 Not Found if any unknown path is requested', async () => {
        const response = await request(app).get('/healx');

        expect(response.statusCode).toBe(404);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
    });

    it('should not include any payload in the response', async () => {
        const response = await request(app).get('/healthz');

        expect(response.statusCode).toBe(200);
        expect(response.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
        expect(response.body).toEqual({});
    });
});
