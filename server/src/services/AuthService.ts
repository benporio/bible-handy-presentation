import User, { HydratedUserDoc, IUser } from "../models/User";

class AuthService {
    public async register(user: IUser): Promise<IUser> {
        try {
            const newUser: HydratedUserDoc = new User(user);
            newUser.save()
                .then(result => console.log(result))
                .catch(e => {
                    console.log(e._message, e.errors)
                });
            return user;
        } catch (error) {
            console.log(error)
        }
        return user
    }
}

export default (new AuthService()) as AuthService;