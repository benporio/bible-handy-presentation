import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { loginRoute } from "../../app/pages";
import { appDispatch } from "../../app/hooks";
import { reset } from "../../features/auth/authSlice";

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }): any => {
    const dispatch = appDispatch()
    const { auth } = useAuthContext();
    console.log('ProtectedRoute... auth.isLoggedIn: ', auth.isLoggedIn)
    if (!auth.isLoggedIn) {
        dispatch(reset())
        console.log('NOT logged in auth: ', auth)
        return <Navigate to={loginRoute} replace />;
    }
    return children;
};