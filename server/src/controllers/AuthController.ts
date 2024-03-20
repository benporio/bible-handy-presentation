import { HydratedUserDoc, IUser } from "../models/User";
import AuthService from "../services/AuthService";

class AuthController {
    public async register(requestBody: any): Promise<IUser> {
        const newUser: IUser = requestBody as IUser;
        return AuthService.register(newUser);
    }
}

export default (new AuthController()) as AuthController;