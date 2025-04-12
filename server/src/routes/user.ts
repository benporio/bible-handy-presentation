import { Router, NextFunction, Request, Response } from "express";
import { authentication } from "../configs/authentication";
import HttpStatusCode from "../constants/httpStatusCode";
import Endpoint from "../constants/endpoint";

const user = Router();

user.get(Endpoint.USER_PROFILE, authentication, (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCode.OK_200).json('OK');
});

export default user;