import request from 'supertest';
import app from '../src/configs/app';

describe("GET /", () => {
    it('responds with "BHP App is running"', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('BHP App is running');
    });
});