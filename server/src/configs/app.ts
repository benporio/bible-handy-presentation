import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import express, { Express, NextFunction, Request, Response } from 'express';
import errorhandler from 'strong-error-handler';
import { auth } from '../routes/auth';
import { user } from '../routes/user';
import mongoose from 'mongoose';
import morganMiddleware from './morganMiddleware';
import Logger from '../utils/Logger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import Keycloak, { KeycloakConfig } from 'keycloak-connect';
import * as redis from 'redis';
import RedisStore from 'connect-redis';
import { v4 as uuidV4 } from 'uuid';
import Endpoint from '../constants/endpoint'
import cors from 'cors'

dotenv.config();

mongoose.connect(process.env.MONGODB_URL as string);
mongoose.set('debug', process.env.MODE !== 'PROD');

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        Logger.debug('Mongoose connection closed.');
        process.exit(0);
    } catch (error) {
        Logger.error('Error closing Mongoose connection:', error);
        process.exit(1);
    }
});

// Create Redis store
// let redisClient = redis.createClient();

// const kcConfig = {
//     clientId: 'myclient',
//     bearerOnly: true,
//     serverUrl: `http://localhost:8080`,
//     realm: 'myrealm',
//     realmPublicKey: 'testonlypublickey'
// } as unknown as KeycloakConfig;

// let keycloak = new Keycloak({
//     store: new RedisStore({ client: redisClient })
// }, kcConfig);

const app: Express = express();

app.use(session({
    secret: process.env.SESSION_SECRET || uuidV4(),
    resave: false,
    saveUninitialized: true,
}));

// app.use(keycloak.middleware());

// middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// middleware for json body parsing
app.use(bodyParser.json({ limit: '5mb' }));

app.use(cookieParser());

app.use(morganMiddleware);

if (process.env.MODE !== 'PROD') {
    app.use(cors({
        origin: 'http://localhost:3001',
        credentials: true, // Allow credentials
    }));
}

export const apiV1BaseRoute: string = '/api/v1'

app.use(`${apiV1BaseRoute}${Endpoint.AUTH}`, auth);
app.use(`${apiV1BaseRoute}${Endpoint.USER}`, user);

if (process.env.MODE === 'PROD') {
    const CLIENT_BUILD_DIR: string = 'build';
    
    // This code makes sure that any request that does not matches a static file
    // in the build folder, will just serve index.html. Client side routing is
    // going to make sure that the correct content will be loaded.
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
            next();
        } else {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.sendFile(path.join(__dirname, CLIENT_BUILD_DIR, 'index.html'));
        }
    });
    
    // serve react app
    app.use(express.static(path.join(__dirname, CLIENT_BUILD_DIR)));

    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Expose-Headers", "x-total-count");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
        res.header("Access-Control-Allow-Headers", "Content-Type,authorization");
        next();
    });
} else {
    app.use(cors({
        origin: 'http://localhost:3001',
        credentials: true, // Allow credentials
    }));
}

app.use(errorhandler({
    debug: process.env.MODE !== 'PROD',
    log: true,
}));

export default app