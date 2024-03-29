import HttpStatusCode from "../../constants/httpStatusCode";
import { IUser } from "../models/User";
import AuthService from "../services/AuthService";
import { ServiceResult, HttpResponseData } from "../types/ActionResult";

class AuthController {
    public async register(requestBody: any): Promise<HttpResponseData> {
        try {
            const newUser: IUser = requestBody as IUser;
            const actionResult: ServiceResult = await AuthService.register(newUser)
                .catch(e => {
                    throw e
                });
            return {
                statusCode: actionResult.status === 'success' ? 
                    HttpStatusCode.CREATED_201 : HttpStatusCode.BAD_REQUEST_400,
                ...actionResult,
            }
        } catch (error) {
            console.log(error)
            return {
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
                status: 'error',
                data: error,
                message: 'Unhandled error'
            }
        }
    }
}

export default (new AuthController()) as AuthController;