import { model, Schema, Model, Document, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';
import Logger from '../utils/Logger';
import PromiseUtil from '../utils/PromiseUtil';
import { IBibleVersion } from './BibleVersion';

export interface IBibleBook extends Document {
    code: string
    name: string
    numberOfChapters: number
    order: number
    languages: { [key: string]: string }
}

export type Passage = {
    version: IBibleVersion
    book: IBibleBook
    chapter: number
    verses: number[]
    description?: string
}

export type VerseMessage = {
    verse: number
    content: string
    parts?: { id: string, className: string, innerText: string }[]
}

export type PassageMessage = {
    passageLabel: string
    verseMessages: VerseMessage[]
}

export type PassageContent = {
    message: string,
    passage: Passage | null
    parts?: { id: string, className: string, innerText: string }[]
}

export type PassageSearch = {
    userId: string
    passage: Passage
    searchControl?: {
        broadcast?: boolean
    }
}

type BibleBookModel = Model<IBibleBook>

export const bibleBookSchema: Schema<IBibleBook, BibleBookModel> = new Schema({
    code: { type: String },
    name: { type: String },
    numberOfChapters: { type: Number },
    order: { type: Number },
    languages: { type: Map, of: String },
});

export type HydratedBibleBookDoc = HydratedDocument<IBibleBook>

const BibleBook = model<IBibleBook, BibleBookModel>('BibleBook', bibleBookSchema, 'bibleBooks');

export class BibleBookFactory {
    private constructor() {}
    public static async findAllBooks(): Promise<HydratedBibleBookDoc[]> {
        return await PromiseUtil.createPromise<HydratedBibleBookDoc[]>((resolve, reject) => {
            BibleBook.find({}, { _id: 0 })
            .then((books) => {
                books?.sort((a, b) => a.order - b.order)
                resolve(books)
            })
            .catch(err => {
                Logger.error(err)
                reject([])
            });
        })
    }
}