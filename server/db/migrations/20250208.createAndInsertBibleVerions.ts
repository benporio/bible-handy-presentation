import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import Logger from '../../src/utils/Logger';
import bibleVerions from '../seeds/bibleVerions';

dotenv.config({ path: '../../.env' });

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;
const collectionName = 'bibleVersions';

const schema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['code', 'name', 'language', 'id1'],
            properties: {
                id1: {
                    bsonType: 'number',
                    description: 'must be a number and is required',
                },
                code: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                name: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                language: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
            }
        }
    }
};

async function createCollectionWithSchema(client: MongoClient, dbName: string, collectionName: string, schema: any) {
    try {
        const db = client.db(dbName);
        const collections = await db.listCollections({ name: collectionName }).toArray();
        if (collections.length === 0) {
            await db.createCollection(collectionName, schema);
            await db.collection(collectionName).createIndex({ code: 1 }, { unique: true });
            Logger.info(`Collection ${collectionName} created with schema.`);
        } else {
            Logger.error(`Collection ${collectionName} already exists.`);
        }
    } catch (err) {
        Logger.error('Error creating collection:', err);
    }
}

const insertBibleBooks = async (dbName: string, collectionName: string) => {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        Logger.info('Connected to MongoDB');
        const db = client.db(dbName);

        await db.collection(collectionName).insertMany(bibleVerions);
        Logger.info(`Inserted ${bibleVerions.length} record(s) to ${collectionName} collection.`);
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