import { Router, NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";

export const auth = Router();

auth.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    AuthController.register(req.body)
        .then(loginUser => res.status(201).json(loginUser))
        .catch(e => next(e));
});