import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '../../.env' });

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;
const collectionName = 'users';

const schema = {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['firstName', 'lastName', 'userName', 'email', 'password'],
            properties: {
                firstName: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                lastName: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                userName: {
                    bsonType: 'string',
                    pattern: '^[A-Za-z0-9]+$',
                    description: 'must be a string and match the regular expression pattern'
                },
                email: {
                    bsonType: 'string',
                    pattern: '^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$',
                    description: 'must be a string and match the regular expression pattern'
                },
                password: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
            }
        }
    }
};

async function createCollectionWithSchema(client: MongoClient, dbName: string, collectionName: string, schema: any) {
    try {
        const db = client.db(dbName);
        await db.createCollection(collectionName, schema);
        console.log(`Collection ${collectionName} created with schema.`);
    } catch (err) {
        console.error('Error creating collection:', err);
    }
}

async function main() {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        await createCollectionWithSchema(client, dbName as string, collectionName, schema);
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await client.close();
    }
}

main();
