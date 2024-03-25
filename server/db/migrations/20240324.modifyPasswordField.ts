import dotenv from 'dotenv';
import { MongoClient, CollectionInfo } from 'mongodb';

dotenv.config({ path: '../../.env' });

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

async function modifyUsersSchema(client: MongoClient, dbName: string) {
    try {
        const db = client.db(dbName);
        const collectionName = 'users'
        const collections = await db.listCollections({ name: collectionName }).toArray();
        const validator = (collections[0] as CollectionInfo)?.options?.validator;
        validator.$jsonSchema.properties = {
            ...validator.$jsonSchema.properties,
            password: {
                ...validator.$jsonSchema.properties.password,
                minLength: 60,
            },
        }
        const result = await db.command({
            collMod: collectionName,
            validator,
            validationLevel: 'moderate'
        });
        console.log(`Validator updated for ${collectionName}:`, result);
    } catch (err) {
        console.error('ERROR:', err);
    }
}

async function main() {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        await modifyUsersSchema(client, dbName as string)
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await client.close();
    }
}

main();
