import { HydratedUserDoc, ILoginInfo, IUser, IUserInfo, UserFactory } from "../models/User";
import { ServiceResult } from "../types/ActionResult";
import Logger from "../utils/Logger";
import PromiseUtil from '../utils/PromiseUtil'
import bcrypt from 'bcrypt'

class AuthService {
    public async register(user: IUser): Promise<ServiceResult> {
        const result: ServiceResult = { status: 'error' }
        const { email } = user;
        const existingUser = await UserFactory.findOne({ email });
        if (existingUser!==null) return new Promise(resolve => resolve({
            ...result,
            status: 'error',
            message: 'Email already in used'
        }));
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
            if (existingUsers.length > 1) Logger.error(`Emmail: ${email} has ${existingUsers.length} instances`)
            return new Promise(resolve => resolve({
                ...result,
                status: 'error',
                message: 'Login failed'
            }));
        }
        return {
            ...result,
            status: 'success',
            data: UserFactory.prepUserData(existingUsers[0] as IUser),
            message: 'Login successful'
        };
    }    
}

export default (new AuthService()) as AuthService;