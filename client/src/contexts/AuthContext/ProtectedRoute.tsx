import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { loginRoute } from "../../app/pages";
import { appDispatch } from "../../app/hooks";
import { reset } from "../../features/auth/authSlice";
import { logout } from "../../api/services/Auth";

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }): any => {
    const dispatch = appDispatch()
    const { auth, isIntervalActive, hasStoredToken } = useAuthContext();
    if (!isIntervalActive() || auth.isLogout || !hasStoredToken()) {
        logout();
        dispatch(reset())
        return <Navigate to={loginRoute} replace />;
    }
    return children;
};