import { HydratedUserDoc, IUser, UserFactory } from "../models/User";
import { ServiceResult } from "../types/ActionResult";
import PromiseUtil, { PromiseResolver, PromiseRejecter, PromiseErrorHandler } from '../utils/PromiseUtil'

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
            .then(userRes => {
                resolve({
                    ...result,
                    status: 'success',
                    data: userRes,
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
}

export default (new AuthService()) as AuthService;