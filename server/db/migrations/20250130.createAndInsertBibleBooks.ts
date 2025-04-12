import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import Logger from '../../src/utils/Logger';
import bibleBooks from '../seeds/bibleBooks';

dotenv.config({ path: '../../.env' });

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;
const collectionName = 'bibleBooks';

const schema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['code', 'name', 'numberOfChapters', 'order'],
            properties: {
                code: {
                    bsonType: 'string',
                    pattern: '^[1-3]?[A-Z]+$',
                    description: 'must be a string and is required',
                },
                name: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                numberOfChapters: {
                    bsonType: 'number',
                    description: 'must be a number and is required',
                },
                order: {
                    bsonType: 'number',
                    description: 'must be a number and is required',
                },
                languages: {
                    bsonType: 'object',
                }
            }
        }
    }
};

async function createCollectionWithSchema(client: MongoClient, dbName: string, collectionName: string, schema: any) {
    try {
        const db = client.db(dbName);
        const collections = await db.listCollections({ name: collectionName }).toArray();
        if (collections.length > 0) {
            await db.collection(collectionName).drop();
            Logger.info(`Dropped existing collection ${collectionName}`);
        }
        await db.createCollection(collectionName, schema);
        await db.collection(collectionName).createIndex({ code: 1 }, { unique: true });
        Logger.info(`Collection ${collectionName} created with schema.`);
    } catch (err) {
        Logger.error('Error creating collection:', err);
        throw err;
    }
}

const insertBibleBooks = async (dbName: string, collectionName: string) => {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        Logger.info('Connected to MongoDB');
        const db = client.db(dbName);

        await db.collection(collectionName).insertMany(bibleBooks);
        Logger.info(`Inserted ${bibleBooks.length} record(s) to ${collectionName} collection.`);
    } catch (err) {
        Logger.error('ERROR:', err);
        throw err;
    } finally {
        await client.close();
    }
}

async function main() {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        Logger.info('Connected to MongoDB');
        await createCollectionWithSchema(client, dbName as string, collectionName, schema);
        await insertBibleBooks(dbName as string, collectionName);
    } catch (err) {
        Logger.error('ERROR:', err);
    } finally {
        await client.close();
    }
}

if (!!!process.env.FROM_DEV_SCRIPT) main();

export default main;