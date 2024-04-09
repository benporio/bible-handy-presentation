import { Router, NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { HttpResponseData } from '../types/ActionResult'

export const auth = Router();

auth.get('/validate', (req: Request, res: Response, next: NextFunction) => {
    AuthController.validate(req.query)
        .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
        .catch(e => next(e));
});

auth.post('/register', (req: Request, res: Response, next: NextFunction) => {
    AuthController.register(req.body)
        .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
        .catch(e => next(e));
});

auth.post('/login', (req: Request, res: Response, next: NextFunction) => {
    AuthController.login(req.body)
        .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
        .catch(e => next(e));
});