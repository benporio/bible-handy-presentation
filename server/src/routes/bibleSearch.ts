import { Router, NextFunction, Request, Response } from "express";
import authenticator, { authentication } from "../configs/authentication";
import Endpoint from "../constants/endpoint";
import BibleSearchController from "../controllers/BibleSearchController";
import { HttpResponseData } from "../types/ActionResult";

const bibleSearch = Router();

bibleSearch.get(Endpoint.BIBLE_SEARCH_FETCH_BOOKS, authentication, (req: Request, res: Response, next: NextFunction) => {
    BibleSearchController.retrieveBooks()
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

bibleSearch.get(Endpoint.BIBLE_SEARCH_FETCH_VERSIONS, authentication, (req: Request, res: Response, next: NextFunction) => {
    BibleSearchController.retrieveVersions()
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

bibleSearch.post(Endpoint.BIBLE_SEARCH_PASSAGE, authentication, authenticator.patchUserId, (req: Request, res: Response, next: NextFunction) => {
    BibleSearchController.retrievePassage(req.body)
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

bibleSearch.post(Endpoint.BIBLE_BROADCAST_PASSAGE, authentication, (req: Request, res: Response, next: NextFunction) => {
    BibleSearchController.broadcastPassage(req.body)
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

bibleSearch.post(Endpoint.BIBLE_PASSAGE_SAVE_PRESET, authentication, authenticator.patchUserId, (req: Request, res: Response, next: NextFunction) => {
    BibleSearchController.savePassagePreset(req.body)
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

bibleSearch.get(Endpoint.BIBLE_LOAD_BHP_USER, authentication, authenticator.patchUserId, (req: Request, res: Response, next: NextFunction) => {
    BibleSearchController.loadBhpUserData(req.body)
    .then((actionResponse: HttpResponseData) => res.status(actionResponse.statusCode).json(actionResponse))
    .catch(e => next(e));
});

export default bibleSearch;