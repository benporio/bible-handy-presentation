import dotenv from 'dotenv';
import { MongoClient, CollectionInfo } from 'mongodb';

dotenv.config({ path: '../../.env' });

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

async function updateUsersSchema(client: MongoClient, dbName: string) {
    try {
        const db = client.db(dbName);
        const collectionName = 'users'
        const collections = await db.listCollections({ name: collectionName }).toArray();
        const validator = (collections[0] as CollectionInfo)?.options?.validator;
        if (!(validator.$jsonSchema.required as string[]).includes('log')) validator.$jsonSchema.required = [ ...validator.$jsonSchema.required, 'log' ]
        validator.$jsonSchema.properties = {
            ...validator.$jsonSchema.properties,
            log: {
                bsonType: 'object',
                properties: {
                    logDateCreated: { bsonType: ['date', 'null'] },
                    logCreatedByUserId: { bsonType: 'string' },
                    logDateUpdated: { bsonType: ['date', 'null'] },
                    logUpdatedByUserId: { bsonType: 'string' },
                    logDateDeleted: { bsonType: ['date', 'null'] },
                    logDeletedByUserId: { bsonType: 'string' },
                }
            }
        }
        const commandResult = await db.command({
            collMod: collectionName,
            validator,
            validationLevel: 'moderate'
        });
        console.log(`Validator updated for ${collectionName.toString()}:`, commandResult);
        const updateManyFilter = {}
        const updateResult = await db.collection(collectionName).updateMany(updateManyFilter, { $set: { log: {
            logDateCreated: null,
            logCreatedByUserId: '',
            logDateUpdated: null,
            logUpdatedByUserId: '',
            logDateDeleted: null,
            logDeletedByUserId: '',
        } }})
        console.log(`UpdateMany with filter ${updateManyFilter} for ${collectionName}:`, updateResult);
    } catch (err) {
        console.error('ERROR:', err);
    }
}

async function main() {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        await updateUsersSchema(client, dbName as string)
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await client.close();
    }
}

main();
