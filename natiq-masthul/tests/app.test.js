const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
    test('GET / should return success', async () => {
        const response = await request(app).get('/api');
        expect(response.status).toBe(200);
        expect(response.body.message).toContain('running');
    });

    test('GET /health should return healthy', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
    });
});
