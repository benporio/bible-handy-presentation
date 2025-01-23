import jwt, { Secret, JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { RefreshTokenFactory } from '../models/RefreshToken';
import HttpStatusCode from '../../constants/httpStatusCode';
import { ServiceResult } from '../types/ActionResult';
import Logger from "../utils/Logger";
import Endpoint from '../../constants/endpoint';

export const SECRET_KEY: Secret = process.env?.JWT_SECRET || crypto.randomBytes(64).toString('hex');

export const blacklistedTokens = new Set();
export const whitelistedTokens = new Set();

export interface CustomRequest extends Request {
    accessToken: string | JwtPayload;
    userId: string;
}

type AccessTokenData = {
    userId: string;
}

class Authenticator {
    public createAccessToken(userId: string): string {
        return jwt.sign(
            { userId: userId }, 
            SECRET_KEY || crypto.randomBytes(64).toString('hex'), 
            {
                expiresIn: process.env?.JWT_ACCESS_EXPIRY || '15m'
            }
        );
    }

    public async createTokens(req: Request, res: Response) {
        const requestToken = req.cookies.refreshToken;
        if (!!!requestToken) return res.status(403).json({ message: "Refresh Token is required!" });
        try {
            const serviceResult: ServiceResult = req.body;
            const userId: string = serviceResult?.data?.userId || null;
            const sessionId: string = req.sessionID as string
            if (!!!userId || !!!sessionId) {
                return res.status(HttpStatusCode.UNAUTHORIZED_401).json({
                    status: 'error',
                    message: 'Unauthorized'
                });
            }
            const refreshToken = RefreshTokenFactory.createRefreshToken({ userId: userId, sessionId: sessionId })
            refreshToken.save()
            .then((token) => {
                res.json({
                    accessToken: this.createAccessToken(userId),
                    ...serviceResult
                });
            })
            .catch((error: any) => {
                if (!!error.stack && error.stack.includes('ValidationError')) {
                    // resolve({
                    //     ...result,
                    //     status: 'error',
                    //     message: [{
                    //         type: 'error',
                    //         message: 'Login failed',
                    //         details: error
                    //     }]
                    // });
                } else {
                    throw error;
                }
            });
            // const refreshToken = await RefreshTokenFactory.findOne({ where: { token: requestToken } });
            
            // return res.status(HttpStatusCode.OK_200).json({
            //     accessToken: newAccessToken,
            // });
        } catch (err) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).send({ message: err });
        }
    }

    public async refreshToken(req: Request, res: Response, next: NextFunction) {
        const requestToken = req.cookies.refreshToken;
        if (!!!requestToken) return res.status(403).json({ message: "Refresh Token is required!" });
        try {
            const refreshToken = await RefreshTokenFactory.findOne({ token: requestToken });
            if (!refreshToken) {
                res.status(403).json({ message: "Refresh token is not in database!" });
                return;
            }
            if (refreshToken.isExpired()) {
                refreshToken.deleteOne({ where: { id: refreshToken.id } });
                res.status(403).json({
                    message: "Refresh token was expired. Please make a new signin request",
                });
                return;
            }
            const userId = refreshToken.userId;
            const newAccessToken = this.createAccessToken(userId);
            Logger.debug(`newAccessToken: ${newAccessToken}`);
            whitelistedTokens.add(newAccessToken);
            (req as CustomRequest).accessToken = newAccessToken;
            (req as CustomRequest).userId = userId;
            next()
        } catch (err) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).send({ message: err });
        }
    }
}

const authenticator = new Authenticator()

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.header('Authorization')?.replace('Bearer ', '');
        Logger.debug(`AccessToken: ${accessToken}`)
        if (!!!accessToken || accessToken === 'null') {
            throw new Error('Unauthorized!');
        }
        if (blacklistedTokens.has(accessToken) || !whitelistedTokens.has(accessToken)) {
            throw new Error('Unauthorized!');
        }
        if (req.url === Endpoint.AUTH_LOGOUT) {
            blacklistedTokens.add(accessToken)
        }
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        if (!!!decoded) {
            throw new Error('Unauthorized!');
        }
        const userId: string = (decoded as AccessTokenData).userId;
        if (!!!userId) {
            throw new Error('Unauthorized!');
        }
        (req as CustomRequest).accessToken = accessToken;
        (req as CustomRequest).userId = userId;
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            Logger.debug('Expired token');
            await authenticator.refreshToken(req, res, next)
        } else res.status(401).send(`Please authenticate. Err: ${err}`);
    }
};

export default authenticator;