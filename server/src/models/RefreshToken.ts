import { model, Schema, Model, Document, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import Logger from '../utils/Logger';

export interface IRefreshToken extends Document {
    token: string
    userId: string
    sessionId: string
    expiryDate: Date
    isExpired: () => boolean
}

type RefreshTokenModel = Model<IRefreshToken>

export const refreshTokenSchema: Schema<IRefreshToken, RefreshTokenModel> = new Schema({
    token: { type: String },
    userId: { type: String },
    sessionId: { type: String },
    expiryDate: { type: Date },
}, {
    methods: {
        isExpired(): boolean {
            return this.expiryDate.getTime() < new Date().getTime();
        }
    },
    virtuals: {
        
    }
});

export type HydratedRefreshTokenDoc = HydratedDocument<IRefreshToken>

const RefreshToken = model<IRefreshToken, RefreshTokenModel>('RefreshToken', refreshTokenSchema);

type RefreshTokenRequiredProp = {
    userId: string
    sessionId: string
}

export class RefreshTokenFactory extends RefreshToken {
    private constructor() {
        super();
    }
    public static createRefreshToken({ userId, sessionId } : RefreshTokenRequiredProp): HydratedRefreshTokenDoc {
        const expiredAt = new Date()
        expiredAt.setSeconds(expiredAt.getSeconds() + (Number(process.env.REFRESH_EXPIRY_SEC) || 7 * 24 * 60 * 60));
        return new RefreshToken({
            token: uuidV4(),
            userId: userId,
            sessionId: sessionId,
            expiryDate: expiredAt,
        });
    }
    public static async destroyRefreshToken(token: string) {
        return RefreshToken.deleteMany({ token }).catch(err => Logger.error(err));
    }
    public static async destroyRefreshTokens(userId: string) {
        return RefreshToken.deleteMany({ userId }).catch(err => Logger.error(err));
    }
}