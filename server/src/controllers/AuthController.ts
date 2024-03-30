import HttpStatusCode from "../../constants/httpStatusCode";
import { ILoginInfo, IUser } from "../models/User";
import AuthService from "../services/AuthService";
import { ServiceResult, HttpResponseData, HttpResponseInfo } from "../types/ActionResult";
import AbsController from './AbsContoller'

class AuthController extends AbsController {
    public async register(requestBody: any): Promise<HttpResponseData> {
        return this.adapter(
            async () => AuthService.register(requestBody as IUser),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.CREATED_201 : HttpStatusCode.BAD_REQUEST_400,
                    }
                }
            }
        );
    }
    public async login(requestBody: any): Promise<HttpResponseData> {
        return this.adapter(
            async () => AuthService.login(requestBody as ILoginInfo),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: actionResult.status === 'success' ? 
                            HttpStatusCode.OK_200 : HttpStatusCode.UNAUTHORIZED_401,
                    }
                }
            }
        );
    }
}

export default (new AuthController()) as AuthController;