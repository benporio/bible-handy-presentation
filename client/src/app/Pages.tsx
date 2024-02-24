import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";

export const Pages = [
    {
        id: 0,
        route: '/login',
        page: <Login />,
    },
    {
        id: 1,
        route: '/register',
        page: <Register />,
    },
]