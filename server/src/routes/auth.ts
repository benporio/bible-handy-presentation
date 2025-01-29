import { Router, NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { HttpResponseData } from '../types/ActionResult'
import { CustomRequest } from "../configs/authentication";
import { authentication } from "../configs/authentication";
import Endpoint from "../constants/endpoint";

export const auth = Router();

auth.get(Endpoint.AUTH_VALIDATE, (req: Request, res: Response, next: NextFunction) => {
    AuthController.validate(req.query)
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

auth.post(Endpoint.AUTH_REGISTER, (req: Request, res: Response, next: NextFunction) => {
    AuthController.register(req.body)
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

auth.post(Endpoint.AUTH_LOGIN, (req: Request, res: Response, next: NextFunction) => {
    req.sessionID
    AuthController.login({
        ...req.body
    })
    .then((actionResponse: HttpResponseData) => {
        if (actionResponse.status === 'success') {
            if (!!actionResponse.refreshToken) {
                res.cookie('refreshToken', actionResponse.refreshToken, {
                    httpOnly: true,
                    // secure: process.env.NODE_ENV === 'production', // Set to true in production
                })
            }
        } else {
            res.clearCookie('refreshToken')
        }
        if (!!actionResponse.refreshToken) delete actionResponse.refreshToken;
        res.status(actionResponse.statusCode).json(actionResponse);
    })
    .catch(e => {
        next(e)
    });
});

auth.get(Endpoint.AUTH_ACCESS_TOKEN, authentication, (req: Request, res: Response, next: NextFunction) => {
    const { userId, accessToken } = (req as CustomRequest)
    AuthController.getUserData(userId, <string>accessToken)
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

auth.post(Endpoint.AUTH_LOGOUT, authentication, (req, res) => {
    // Destroy the session
    const refreshToken = req.cookies.refreshToken;
    const { userId } = (req as CustomRequest)
    AuthController.logout(userId, <string>refreshToken)
    .finally(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Clear any cookies related to the session
            res.clearCookie('connect.sid'); // Replace with your session cookie name
            res.clearCookie('refreshToken')
            res.status(200).json({ message: 'Logged out successfully' });
        });
    })
});