import { Router, NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { ActionResponse } from '../types/ActionResult'

export const auth = Router();

auth.post('/register', (req: Request, res: Response, next: NextFunction) => {
    AuthController.register(req.body)
        .then((actionResponse: ActionResponse) => res.status(actionResponse.statusCode).json(actionResponse))
        .catch(e => next(e));
});