import HttpStatusCode from "../constants/httpStatusCode";
import { BhpPreset } from "../models/BhpUser";
import { PassageSearch, PassageContent } from "../models/BibleBook";
import BibleSearchService from "../services/BibleSearchService";
import { ServiceResult, HttpResponseData, HttpResponseInfo } from "../types/ActionResult";
import Controller from './AbsContoller'

class BibleSearchController extends Controller {
    public async retrieveBooks(): Promise<HttpResponseData> {
        return this.adapter(
            async () => BibleSearchService.retrieveBooks(),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.OK_200 : HttpStatusCode.BAD_REQUEST_400,
                    }
                }
            }
        );
    }

    public async retrieveVersions(): Promise<HttpResponseData> {
        return this.adapter(
            async () => BibleSearchService.retrieveVersions(),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.OK_200 : HttpStatusCode.BAD_REQUEST_400,
                    }
                }
            }
        );
    }

    public async retrievePassage(requestBody: any): Promise<HttpResponseData> {
        return this.adapter(
            async () => BibleSearchService.retrievePassage(requestBody as PassageSearch),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.OK_200 : HttpStatusCode.BAD_REQUEST_400,
                    }
                }
            }
        );
    }

    public async broadcastPassage(requestBody: any): Promise<HttpResponseData> {
        return this.adapter(
            async () => BibleSearchService.broadcastPassage(requestBody as PassageContent),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.OK_200 : HttpStatusCode.BAD_REQUEST_400,
                    }
                }
            }
        );
    }

    public async savePassagePreset(requestBody: any): Promise<HttpResponseData> {
        return this.adapter(
            async () => BibleSearchService.savePassagePreset(requestBody as BhpPreset),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.OK_200 : HttpStatusCode.BAD_REQUEST_400,
                    }
                }
            }
        );
    }

    public async loadBhpUserData(requestBody: any): Promise<HttpResponseData> {
        return this.adapter(
            async () => BibleSearchService.loadBhpUserData(requestBody.userId),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.OK_200 : HttpStatusCode.BAD_REQUEST_400,
                    }
                }
            }
        );
    }
}

export default (new BibleSearchController()) as BibleSearchController;