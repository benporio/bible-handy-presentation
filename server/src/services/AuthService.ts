import { HydratedUserDoc, ILoginInfo, IUser, IUserInfo, UserFactory, UserIdentifier } from "../models/User";
import { ServiceMessage, ServiceResult } from "../types/ActionResult";
import Logger from "../utils/Logger";
import PromiseUtil from '../utils/PromiseUtil'
import TimeUtil from '../utils/TimeUtil'
import bcrypt from 'bcrypt'

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
                    message: 'User is registered sussessfully'
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

    public async login(loginInfo: ILoginInfo): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const { email, password } = loginInfo
        const existingUsers= await UserFactory.find({ email });
        const isValid = !!existingUsers && existingUsers.length===1 && bcrypt.compareSync(password, existingUsers[0].password);
        if (!isValid) {
            if (existingUsers.length > 1) Logger.error(`Email: ${email} has ${existingUsers.length} instances`)
            return {
                ...result,
                status: 'error',
                message: 'Login failed'
            };
        }
        return {
            ...result,
            status: 'success',
            data: UserFactory.prepUserData(existingUsers[0] as IUser),
            message: 'Login successful'
        };
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