import request from 'supertest';
import app, { apiV1BaseRoute } from '../../src/configs/app';
import HttpStatusCode from '../../constants/httpStatusCode';
import mongoose from 'mongoose';
import seedUsers, { revert as revertSeedUsers } from '../../db/seeds/testUsers';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

beforeAll(async () => {
    await seedUsers();
});

afterAll(async () => {
    await revertSeedUsers();
    await mongoose.connection.close();
});

const assessSecurityData = (responseBody: any) => {
    expect(responseBody.password).toBeUndefined();
}

describe(`POST ${apiV1BaseRoute}/auth/register`, () => {
    const sampleUser = {
        firstName: 'Benedict',
        lastName: 'Sisland',
        userName: 'lsisland1',
        email: 'lsisland1@example.com',
        password: 'nP5_6|)1l\\='
    }
    it('should register the user', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/register`)
            .send(sampleUser)
        expect(response.statusCode).toBe(HttpStatusCode.CREATED_201);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message');
    });

    //when registering again the user
    it('should not register the user if existing', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/register`)
            .send(sampleUser)
        expect(response.statusCode).toBe(HttpStatusCode.BAD_REQUEST_400);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('message');
    });
});

describe(`POST ${apiV1BaseRoute}/auth/login`, () => {
    const sampleLogin = {
        email: 'lsisland1@example.com',
        password: 'nP5_6|)1l\\='
    }
    it('should login successfully', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/login`)
            .send(sampleLogin)
        expect(response.statusCode).toBe(HttpStatusCode.OK_200);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message');
    });

    it('should fail the login with invalid credentials', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/login`)
            .send({ ...sampleLogin, password: "nP5_6|)1l\\=x" })
        expect(response.statusCode).toBe(HttpStatusCode.UNAUTHORIZED_401);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('message');
    });
});