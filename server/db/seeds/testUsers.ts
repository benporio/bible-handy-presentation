import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '../../.env' });

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;
const collectionName = 'users';

(async () => {
    const client = new MongoClient(url as string);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        const users = [{
            "firstName": "Guendolen",
            "lastName": "Clifforth",
            "userName": "gclifforth0",
            "email": "gclifforth0@europa.eu",
            "password": "vF5*?7OJjd!Ip"
        }, {
            "firstName": "Lorenza",
            "lastName": "Sisland",
            "userName": "lsisland1",
            "email": "lsisland1@example.com",
            "password": "nP5_6|)1l\\="
        }, {
            "firstName": "Ingeberg",
            "lastName": "Bonifazio",
            "userName": "ibonifazio2",
            "email": "ibonifazio2@unc.edu",
            "password": "rG2'v|'P"
        }, {
            "firstName": "Elisabeth",
            "lastName": "Verma",
            "userName": "everma3",
            "email": "everma3@uiuc.edu",
            "password": "xT4'yFDS78U"
        }, {
            "firstName": "Ertha",
            "lastName": "Woodburn",
            "userName": "ewoodburn4",
            "email": "ewoodburn4@blogspot.com",
            "password": "gC0+Mc?F_B"
        }]
        await db.collection('users').insertMany(users);
        console.log(`Inserted ${users.length} record(s) to ${collectionName} collection.`);
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await client.close();
    }
})()