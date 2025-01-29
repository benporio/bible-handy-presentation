import HttpStatusCode from "../constants/httpStatusCode";
import { ServiceResult, HttpResponseData, HttpResponseInfo } from "../types/ActionResult";
import Logger from "../utils/Logger";

type AdapterOptions = {
    actionResultPostInfo?: (actionResult: ServiceResult) => HttpResponseInfo 
}

const defaultAdapterOptions = {
    actionResultPostInfo: (actionResult: ServiceResult) => {
        return { statusCode: actionResult.status === 'success' ? HttpStatusCode.OK_200 : HttpStatusCode.BAD_REQUEST_400 }
    }
}

export default class Controller {
    protected async adapter(
        serviceMethod: () => Promise<ServiceResult>, 
        { actionResultPostInfo = defaultAdapterOptions.actionResultPostInfo }: AdapterOptions
    ): Promise<HttpResponseData> {
        try {
            const actionResult: ServiceResult = await serviceMethod()
                .catch(e => {
                    throw e
                });
            const responseData: HttpResponseData = {
                ...(actionResultPostInfo(actionResult)),
                ...actionResult,
            }
            Logger.debug(responseData);
            return responseData;
        } catch (error) {
            Logger.error(error);
            return {
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
                status: 'error',
                data: error,
                message: 'Unhandled error'
            }
        }
    }
}