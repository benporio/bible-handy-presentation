import { Router, NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { HttpResponseData } from '../types/ActionResult'

export const auth = Router();

auth.post('/register', (req: Request, res: Response, next: NextFunction) => {
    AuthController.register(req.body)
        .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
        .catch(e => next(e));
});