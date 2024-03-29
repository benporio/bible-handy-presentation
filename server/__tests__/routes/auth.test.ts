import request from 'supertest';
import app, { apiV1BaseRoute } from '../../src/configs/app';

describe(`POST ${apiV1BaseRoute}/auth/register`, () => {
    const sampleUser = {
        "firstName": "Benedict",
        "lastName": "Sisland",
        "userName": "lsisland1",
        "email": "lsisland1@example.com",
        "password": "nP5_6|)1l\\="
    }
    it('should register the user', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/register`)
            .send(sampleUser)
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message');
    });

    //when registering again the user
    it('should not register the user if existing', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/register`)
            .send(sampleUser)
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('message');
    });
});