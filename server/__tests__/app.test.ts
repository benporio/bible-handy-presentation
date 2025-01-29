import request from 'supertest';
import app from '../src/configs/app';
import HttpStatusCode from '../src/constants/httpStatusCode';
import mongoose from 'mongoose';

afterAll(async () => {
    await mongoose.connection.close();
});

describe("GET /", () => {
    it('responds with "BHP App is running"', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(HttpStatusCode.OK_200);
        expect(response.text).toBe('BHP App is running');
    });
});