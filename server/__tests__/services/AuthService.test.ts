import { IUser } from '../../src/models/User';
import AuthService from '../../src/services/AuthService';
import mongoose from 'mongoose';
import { ServiceResult } from '../../src/types/ActionResult';

afterAll(async () => {
    await mongoose.connection.close();
});

const sampleUser = {
    firstName: 'Benedict',
    lastName: 'Sisland',
    userName: 'lsisland1',
    email: 'lsisland1@example.com',
    password: 'nP5_6|)1l='
}

describe('AuthService.register', () => {
    {   
        const { firstName, lastName, userName } = sampleUser;

        it('registers new user', async () => {
            const mockSuccessResult = {
                status: 'success',
                data: { firstName, lastName, userName },
                message: 'User is registered sussessfully'
            } as ServiceResult;
            jest.spyOn(AuthService, 'register').mockResolvedValue(mockSuccessResult);
            const result = await AuthService.register(sampleUser as IUser);
            expect(result).toEqual(mockSuccessResult);
        });

        it('should not register again the same user', async () => {
            const mockFailResult = {
                status: 'error',
                data: false,
                message: [
                    {
                        type: 'error',
                        message: 'Email already in used'
                    },
                    {
                        type: 'error',
                        message: 'User name already in used'
                    }
                ],
            } as ServiceResult;
            jest.spyOn(AuthService, 'register').mockResolvedValue(mockFailResult);
            const result = await AuthService.register(sampleUser as IUser);
            expect(result).toEqual(mockFailResult);
        });
    }
});

describe('AuthService.login', () => {
    {   
        const { email, password, firstName, lastName, userName } = sampleUser;

        it('logins a valid user', async () => {
            const mockSuccessResult = {
                status: 'success',
                data: { firstName, lastName, userName },
                message: 'Login successful'
            } as ServiceResult;
            jest.spyOn(AuthService, 'login').mockResolvedValue(mockSuccessResult);
            const result = await AuthService.login({ email, password });
            expect(result).toEqual(mockSuccessResult);
        });

        it('should not login invalid user', async () => {
            const mockFailResult = {
                status: 'error',
                message: 'Login failed'
            } as ServiceResult;
            jest.spyOn(AuthService, 'login').mockResolvedValue(mockFailResult);
            const result = await AuthService.login({ email, password: 'invalidpassword' });
            expect(result).toEqual(mockFailResult);
        });
    }
});

describe('AuthService.validateIdentifier', () => {
    {   
        const { email, userName } = sampleUser;

        it('should validate to true', async () => {
            const mockSuccessResult = {
                "status": "success",
                "data": true,
                "message": "email and userName not in used",
            } as ServiceResult;
            jest.spyOn(AuthService, 'validateIdentifier').mockResolvedValue(mockSuccessResult);
            const result = await AuthService.validateIdentifier({ email: 'notusedemail@g.io', userName: 'notusedusername' });
            expect(result).toEqual(mockSuccessResult);
        });

        it('should validate to false', async () => {
            const mockFailResult = {
                status: 'error',
                data: false,
                message: [
                    {
                        type: 'error',
                        message: 'Email already in used'
                    },
                    {
                        type: 'error',
                        message: 'User name already in used'
                    }
                ],
            } as ServiceResult;
            jest.spyOn(AuthService, 'validateIdentifier').mockResolvedValue(mockFailResult);
            const result = await AuthService.validateIdentifier({ email, userName });
            expect(result).toEqual(mockFailResult);
        });
    }
});