import request from 'supertest';
import app, { apiV1BaseRoute } from '../../src/configs/app';
import HttpStatusCode from '../../src/constants/httpStatusCode';
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

const sampleUser = {
    firstName: 'Benedict',
    lastName: 'Sisland',
    userName: 'lsisland1',
    email: 'lsisland1@example.com',
    password: 'nP5_6|)1l='
}

const assessSecurityData = (responseBody: any) => {
    expect(responseBody.password).toBeUndefined();
}

describe(`POST ${apiV1BaseRoute}/auth/register`, () => {
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
    const { email, password } = sampleUser
    it('should login successfully', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/login`)
            .send({ email, password })
        expect(response.statusCode).toBe(HttpStatusCode.OK_200);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message');
    });

    it('should fail the login with invalid credentials', async () => {
        const response = await request(app)
            .post(`${apiV1BaseRoute}/auth/login`)
            .send({ ...{ email, password }, password: "nP5_6|)1l=x" })
        expect(response.statusCode).toBe(HttpStatusCode.UNAUTHORIZED_401);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('message');
    });
});

describe(`GET ${apiV1BaseRoute}/auth/validate`, () => {
    const { email, userName } = sampleUser
    it('should validate to false', async () => {
        const response = await request(app)
            .get(`${apiV1BaseRoute}/auth/validate`)
            .query({ email, userName })
        expect(response.statusCode).toBe(HttpStatusCode.OK_200);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message');
        expect(response.body.status).toBe('error');
        expect(response.body.data).toBe(false);
    });

    it('should validate to true', async () => {
        const response = await request(app)
            .get(`${apiV1BaseRoute}/auth/validate`)
            .query({ email: 'notusedemail@g.io', userName: 'notusedusername' })
        expect(response.statusCode).toBe(HttpStatusCode.OK_200);
        assessSecurityData(response.body)
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('message');
        expect(response.body.status).toBe('success');
        expect(response.body.data).toBe(true);
    });
});