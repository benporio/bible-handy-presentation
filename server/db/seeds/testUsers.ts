import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import Logger from '../../src/utils/Logger';

dotenv.config({ path: '../../.env' });

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;
const collectionName = 'users';

export default async () => {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        Logger.debug('Connected to MongoDB');
        const db = client.db(dbName);
        const users: any[] = [
            {
                "firstName": "Creight",
                "lastName": "McLanaghan",
                "userName": "cmclanaghan0",
                "email": "cmclanaghan0@webnode.com",
                "password": "$2a$04$Co7QxqJwX2mw6LqadOeHkuqUVQQhRYUDIj0taMJmvW1WpicSajv2m"
            },
            {
                "firstName": "Kimberly",
                "lastName": "Courtonne",
                "userName": "kcourtonne1",
                "email": "kcourtonne1@thetimes.co.uk",
                "password": "$2a$04$k53exOXqcOYhY47CpcYjgeOy9f0Zh4RF3dU2pwJrmMXmIKZZdMdb6"
            },
            {
                "firstName": "Wolfgang",
                "lastName": "Kidner",
                "userName": "wkidner2",
                "email": "wkidner2@webeden.co.uk",
                "password": "$2a$04$98/d4TAdkn81l8j5Q3uIp.6g6EkTrkcHuGkRX3RPZyzDRMw2FuOl6"
            },
            {
                "firstName": "Emmaline",
                "lastName": "Ovanesian",
                "userName": "eovanesian3",
                "email": "eovanesian3@tumblr.com",
                "password": "$2a$04$yRIFAyXrWuzsTabMfZWDYedwGSIu414k15MZ2TVdAu3OK9TvCqciy"
            },
            {
                "firstName": "Dev",
                "lastName": "Beri",
                "userName": "dberi4",
                "email": "dberi4@uol.com.br",
                "password": "$2a$04$ZqX9yS4zNlBga8vc4R/Ble3yU75eGtXeuarbBWHyEzTXFOB94i0cS"
            }
        ]

        // MODIFICATION STARTS

        users.forEach(user => {
            user['log'] = {
                logDateCreated: null,
                logCreatedByUserId: '',
                logDateUpdated: null,
                logUpdatedByUserId: '',
                logDateDeleted: null,
                logDeletedByUserId: '',
            }
        })

        // MODIFICATION ENDS

        await db.collection('users').insertMany(users);
        Logger.info(`Inserted ${users.length} record(s) to ${collectionName} collection.`);
    } catch (err) {
        Logger.error('ERROR:', err);
    } finally {
        await client.close();
    }
}

export const revert = async () => {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        Logger.debug('Connected to MongoDB');
        const db = client.db(dbName);
        const result = await db.collection('users').deleteMany({});
        Logger.info(`Deleted ${result.deletedCount} record(s) from ${collectionName} collection.`);
    } catch (err) {
        Logger.error('ERROR:', err);
    } finally {
        await client.close();
    }
}