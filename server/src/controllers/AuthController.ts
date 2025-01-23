import HttpStatusCode from "../../constants/httpStatusCode";
import { ILoginInfo, IUser } from "../models/User";
import AuthService from "../services/AuthService";
import { ServiceResult, HttpResponseData, HttpResponseInfo } from "../types/ActionResult";
import Controller from './AbsContoller'

class AuthController extends Controller {
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
    public async validate(requestParam: any): Promise<HttpResponseData> {
        return this.adapter(
            async () => AuthService.validateIdentifier(requestParam as ILoginInfo),
            {
                actionResultPostInfo: (actionResult: ServiceResult): HttpResponseInfo => {
                    return {
                        statusCode: HttpStatusCode.OK_200,
                    }
                }
            }
        );
    }
    public async getUserData(userId: string, accessToken: string): Promise<HttpResponseData> {
        return this.adapter(
            async () => AuthService.getUserData(userId, accessToken),
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
    public async logout(userId: string, refreshToken: string): Promise<HttpResponseData> {
        return this.adapter(
            async () => AuthService.logout(userId, refreshToken),
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