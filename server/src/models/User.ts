import { model, Schema, Model, Document, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcrypt'
import { HydratedLogDoc, ILog, LogFactory, logSchema } from './Log'

export type UserIdentifier = {
    email?: string
    userName?: string
}
export interface ILoginInfo {
    email: string
    password: string
    sessionId?: string
}
export interface IUserInfo {
    firstName: string
    lastName: string
    userName: string
}
export interface IUser extends IUserInfo, ILoginInfo, Document {
    log: ILog
}

type UserModel = Model<IUser>

export const userSchema: Schema<IUser, UserModel> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v: string) {
                return /^[A-Za-z0-9]+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    email: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(v: string) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    password: { type: String, required: true },
    log: { type: logSchema, required: true },
}, {
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`;
            }
        }
    }
});

userSchema.methods.getFullName = function(): string {
    return `${this.firstName} ${this.lastName}`
}

export const hashPassword = async (password: string, next?: CallbackWithoutResultAndOptionalError) => {
    return bcrypt.genSalt(10)
    .then((salt: any) => bcrypt.hash(password, salt))
    .then((hash: any) => {
        return hash;
    })
    .catch((err: any) => next && next(err));
}

userSchema.pre<IUser>('save', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();
    hashPassword(this.password, next).then(hashPassword => {
        this.password = hashPassword
        next()
    }).catch((err: any) => next(err));
});

userSchema.pre<IUser>('updateOne', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();
    hashPassword(this.password, next).then(hashPassword => {
        this.password = hashPassword
        next()
    }).catch((err: any) => next(err));
});

userSchema.pre<IUser>('updateMany', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();
    hashPassword(this.password, next).then(hashPassword => {
        this.password = hashPassword
        next()
    }).catch((err: any) => next(err));
});

userSchema.pre<IUser>('findOneAndUpdate', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();
    hashPassword(this.password, next).then(hashPassword => {
        this.password = hashPassword
        next()
    }).catch((err: any) => next(err));
});

export type HydratedUserDoc = HydratedDocument<IUser>


const User = model<IUser, UserModel>('User', userSchema, 'users');

export class UserFactory extends User {
    private constructor() {
        super();
    }
    public static createUser(user: IUserInfo | undefined): HydratedUserDoc {
        const newLog: HydratedLogDoc = LogFactory.createLog();
        if (!!user) {
            const newUser: HydratedUserDoc = new User({
                ...user,
                log: newLog
            });
            return newUser;
        }
        const newUser: HydratedUserDoc = new User({
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            log: newLog
        });
        return newUser;
    }
    public static prepUserData(user: IUser): IUserInfo {
        const { firstName, lastName, userName } = user;
        return { firstName, lastName, userName }
    }
}