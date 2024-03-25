import Log from "../models/Log";
import User, { HydratedUserDoc, IUser } from "../models/User";
import { ActionResult } from "../types/ActionResult";
import PromiseUtil, { PromiseResolver, PromiseRejecter, PromiseErrorHandler } from '../utils/PromiseUtil'

class AuthService {
    public async register(user: IUser): Promise<ActionResult> {
        const result: ActionResult = { status: 'error' }
        const { email } = user;
        const existingUser = await User.findOne({ email });
        if (existingUser!==null) return new Promise(resolve => resolve({
            ...result,
            status: 'error',
            message: 'Email already in used'
        }));
        const newUser: HydratedUserDoc = new User(user);
        newUser.log = new Log({
            logDateCreated: null,
            logCreatedByUserId: '',
            logDateUpdated: null,
            logUpdatedByUserId: '',
            logDateDeleted: null,
            logDeletedByUserId: '',
        })
        return await PromiseUtil.createPromise<ActionResult>((resolve, reject) => {
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
                            messages: 'Cannot register user. Validation failure.',
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