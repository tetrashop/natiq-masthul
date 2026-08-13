const request = require('supertest');
const app = require('../../src/app');

describe('API Tests', () => {
    test('GET /api/v1 should return API info', async () => {
        const response = await request(app).get('/api/v1');
        expect(response.status).toBe(200);
        expect(response.body.message).toContain('TetraShop API');
        expect(response.body.status).toBe('running');
    });

    test('GET /health should return health status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
        expect(response.body).toHaveProperty('uptime');
        expect(response.body).toHaveProperty('memory');
    });

    test('GET /api/v1/ping should return pong', async () => {
        const response = await request(app).get('/api/v1/ping');
        expect(response.status).toBe(200);
        expect(response.body.pong).toBe(true);
    });

    test('GET /nonexistent should return 404', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Not Found');
    });
});
