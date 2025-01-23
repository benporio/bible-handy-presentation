import { HydratedUserDoc, ILoginInfo, IUser, IUserInfo, UserFactory, UserIdentifier } from "../models/User";
import { RefreshTokenFactory } from '../models/RefreshToken'
import { ServiceMessage, ServiceResult } from "../types/ActionResult";
import Logger from "../utils/Logger";
import PromiseUtil from '../utils/PromiseUtil'
import bcrypt from 'bcrypt'
import Authenticator, { whitelistedTokens } from '../configs/authentication'

class AuthService {

    public async register(user: IUser): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const { email, userName } = user;
        const validation = await this.validateIdentifier({ email, userName });
        if (!!validation && validation.status === 'error') return validation;
        const newUser: HydratedUserDoc = UserFactory.createUser(user);
        return await PromiseUtil.createPromise<ServiceResult>((resolve, reject) => {
            newUser.save()
            .then((userRes) => {
                resolve({
                    ...result,
                    status: 'success',
                    data: UserFactory.prepUserData(userRes as IUser),
                    message: 'User is registered sussessfully',
                });
            })
            .catch((error: any) => {
                if (!!error.stack && error.stack.includes('ValidationError')) {
                    resolve({
                        ...result,
                        status: 'error',
                        message: [{
                            type: 'error',
                            message: 'Cannot register user. Validation failure.',
                            details: error
                        }]
                    });
                } else {
                    reject(error);
                }
            });
        })
    }

    private async findUserByEmailPassword(email: string, password: string): Promise<IUser | null> {
        const existingUsers = await UserFactory.find({ email });
        const isValid = !!existingUsers && existingUsers.length===1 && bcrypt.compareSync(password, existingUsers[0].password);
        if (!isValid) {
            if (existingUsers.length > 1) Logger.error(`Email: ${email} has ${existingUsers.length} instances`)
            return null;
        }
        return existingUsers[0];
    }

    public async login(loginInfo: ILoginInfo): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const { email, password } = loginInfo
        const user = await this.findUserByEmailPassword(email, password);
        if (!!!user) {
            return {
                ...result,
                status: 'error',
                message: 'Login failed'
            };
        }
        const userData = UserFactory.prepUserData(user as IUser);
        const refreshToken = RefreshTokenFactory.createRefreshToken({ userId: user.id, sessionId: loginInfo.sessionId || '' })
        await RefreshTokenFactory.destroyRefreshToken(refreshToken.token)
        await RefreshTokenFactory.destroyRefreshTokens(user.id)
        return await PromiseUtil.createPromise<ServiceResult>((resolve, reject) => {
            refreshToken.save()
            .then((res) => {
                const newAccessToken = Authenticator.createAccessToken(user.id)
                whitelistedTokens.add(newAccessToken)
                resolve({
                    ...result,
                    status: 'success',
                    data: {
                        ...userData,
                        userId: user.id
                    },
                    message: 'Login successful',
                    accessToken: newAccessToken,
                    refreshToken: res.token,
                });
            })
            .catch((error: any) => {
                if (!!error.stack && error.stack.includes('ValidationError')) {
                    resolve({
                        ...result,
                        status: 'error',
                        message: [{
                            type: 'error',
                            message: 'Login failed',
                            details: error
                        }]
                    });
                } else {
                    reject(error);
                }
            });
        })
    }

    public async logout(userId: string, refreshToken: string): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const user = await UserFactory.findById(userId);
        if (!!!user) {
            return {
                ...result,
                status: 'error',
                message: 'User not found'
            };
        }
        await RefreshTokenFactory.destroyRefreshTokens(user.id);
        return {
            ...result,
            status: 'success',
            message: 'Logout',
        }
    }

    public async getUserData(userId: string, accessToken: string): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        if (!!!userId) {
            return {
                ...result,
                status: 'error',
                message: 'Unauthorized'
            };
        }
        const user = await UserFactory.findById(userId);
        if (!!!user) {
            return {
                ...result,
                status: 'error',
                message: 'Unauthorized'
            };
        }
        const userData = UserFactory.prepUserData(user as IUser);
        return {
            ...result,
            status: 'success',
            data: {
                ...userData,
                userId: user.id
            },
            message: 'Authorized',
            accessToken: accessToken
        }
    }

    public async validateIdentifier(userIdentifier: UserIdentifier): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const { email, userName } = userIdentifier
        const orOptions = []
        if (!!email) orOptions.push({ email })
        if (!!userName) orOptions.push({ userName })
        if (!!!orOptions.length) {
            return {
                ...result,
                status: 'error',
                message: 'No email or user name received to validate'
            };
        }
        const existingUsers= await UserFactory.find({ $or: orOptions });
        if (!!existingUsers && !!existingUsers.length) {
            const message: ServiceMessage[] = []
            existingUsers.map(user => {
                if (user.email === email) {
                    message.push({
                        type: 'error',
                        message: 'Email already in used'
                    })
                }
                if (user.userName === userName) {
                    message.push({
                        type: 'error',
                        message: 'User name already in used'
                    })
                }
            })
            return {
                ...result,
                status: 'error',
                data: false,
                message: message
            };
        }
        return {
            ...result,
            status: 'success',
            data: true,
            message: `${Object.keys(userIdentifier).join(' and ')} not in used`
        };
    }    
}

export default (new AuthService()) as AuthService;