import { model, Schema, Model, Document, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';
import Logger from '../utils/Logger';
import PromiseUtil from '../utils/PromiseUtil';

export interface IBibleVersion extends Document {
    code: string
    name: string
    language: string
    id1: number
}

type BibleVersionModel = Model<IBibleVersion>

export const bibleVersionSchema: Schema<IBibleVersion, BibleVersionModel> = new Schema({
    code: { type: String },
    name: { type: String },
    language: { type: String },
    id1: { type: Number },
});

export type HydratedBibleVersionDoc = HydratedDocument<IBibleVersion>

const BibleVersion = model<IBibleVersion, BibleVersionModel>('BibleVersion', bibleVersionSchema, 'bibleVersions');

export class BibleVersionFactory {
    private constructor() {}
    public static async findAllVersions(): Promise<HydratedBibleVersionDoc[]> {
        return await PromiseUtil.createPromise<HydratedBibleVersionDoc[]>((resolve, reject) => {
            BibleVersion.find({}, { _id: 0 })
            .then((books) => resolve(books))
            .catch(err => {
                Logger.error(err)
                reject([])
            });
        })
    }
}