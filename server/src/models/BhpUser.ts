import { model, Schema, Model, Document, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import Logger from '../utils/Logger';
import { PassageContent } from './BibleBook';
import { UserFactory } from './User';

export interface IBhpUserInfo {
    bibleSearchPresets?: { title: string, logDate: Date, passageContent: PassageContent }[]
    bibleSearchHistory?: { logDate: Date, passageContent: PassageContent }[]
}

export interface IBhpUser extends IBhpUserInfo, Document {
    userId: string
}

export type BhpPreset = {
    userId: string
    logDate: Date
    title: string
    passageContent: PassageContent
}

export type BhpHistory = {
    userId: string
    logDate: Date
    passageContent: PassageContent
}

export type BhpPresetReturn = {
    title: string
    logDate: Date
    passageContent: PassageContent
}

export type BhpHistoryReturn = {
    logDate: Date
    passageContent: PassageContent
}

type BhpUserModel = Model<IBhpUser>

export const bhpUserSchema: Schema<IBhpUser, BhpUserModel> = new Schema({
    userId: { type: String },
    bibleSearchPresets: { type: [{ title: String, logDate: Date, passageContent: Object }], default: [] },
    bibleSearchHistory: { type: [{ logDate: Date, passageContent: Object }], default: [] },
}, {
    methods: {
        
    },
    virtuals: {
        
    }
});

export type HydratedBhpUserDoc = HydratedDocument<IBhpUser>

const BhpUser = model<IBhpUser, BhpUserModel>('BhpUser', bhpUserSchema, 'bhpUsers');

export class BhpUserFactory {
    private constructor() { }

    public static async savePreset(bhpPreset : BhpPreset): Promise<BhpPresetReturn | null> {
        try {
            const { userId, title, passageContent } = bhpPreset
            const bhpUsers = await BhpUser.find({ userId })
            const logDate = new Date();
            if (!bhpUsers || !bhpUsers.length) {
                Logger.info(`Creating new bhpUser with id ${userId}`)
                await BhpUser.create({ userId, bibleSearchPresets: [{ title, logDate, passageContent }] })
                return { title, logDate, passageContent };
            }
            await BhpUser.findOneAndUpdate(
                { userId: userId },
                { $addToSet: { bibleSearchPresets: { title, logDate, passageContent } } },
                { new: true }
            )
            return { title, logDate, passageContent };
        } catch (error) {
            Logger.error(error)
        }
        return null
    }

    public static async saveHistory(bhpHistory : BhpHistory): Promise<BhpHistoryReturn | null> {
        try {
            const { userId, passageContent } = bhpHistory
            const bhpUsers = await BhpUser.find({ userId })
            const logDate = new Date();
            if (!bhpUsers || !bhpUsers.length) {
                Logger.info(`Creating new bhpUser with id ${userId}`)
                await BhpUser.create({ userId, bibleSearchHistory: [{ logDate, passageContent }] })
                return { logDate, passageContent };
            }
            await BhpUser.findOneAndUpdate(
                { userId: userId },
                { $addToSet: { bibleSearchHistory: { logDate, passageContent } } },
                { new: true }
            )
            return { logDate, passageContent };
        } catch (error) {
            Logger.error(error)
        }
        return null
    }

    public static async createUser(userId : string): Promise<void> {
        const bhpUsers = await BhpUser.find({ userId })
        if (!bhpUsers || !bhpUsers.length) {
            Logger.info(`Creating new bhpUser with id ${userId}`)
            await BhpUser.create({ userId })
        } else {
            Logger.info(`BhpUser ${userId} already exists`)
        }
    }

    public static async loadUser(userId : string): Promise<IBhpUserInfo> {
        try {
            const bhpUsers = await BhpUser.find({ userId })
            if (!bhpUsers || !bhpUsers.length) {
                Logger.error(`User ${userId} not found`)
                return {
                    bibleSearchPresets: [],
                    bibleSearchHistory: []
                };
            }
            const [ { bibleSearchPresets, bibleSearchHistory } ] = bhpUsers;
            bibleSearchPresets?.sort((a, b) => b.logDate.getTime() - a.logDate.getTime())
            bibleSearchHistory?.sort((a, b) => b.logDate.getTime() - a.logDate.getTime())
            return { bibleSearchPresets, bibleSearchHistory };
        } catch (error) {
            Logger.error(error)
        }
        return {
            bibleSearchPresets: [],
            bibleSearchHistory: []
        };
    }
}