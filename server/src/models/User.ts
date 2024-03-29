import { model, Schema, Model, Document, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcrypt'
import Log, { ILog, logSchema } from './Log'

export interface IUser extends Document {
    firstName: string
    lastName: string
    userName: string
    email: string
    password: string
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
    methods: {
        getFullName: function(): string {
            return `${this.firstName} ${this.lastName}`
        }
    },
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`;
            }
        }
    }
});

userSchema.pre<IUser>('save', function(next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(10)
    .then((salt: any) => bcrypt.hash(this.password, salt))
    .then((hash: any) => {
        this.password = hash;
        next();
    })
    .catch((err: any) => next(err));
});

export type HydratedUserDoc = HydratedDocument<IUser>

export default model<IUser, UserModel>('User', userSchema);