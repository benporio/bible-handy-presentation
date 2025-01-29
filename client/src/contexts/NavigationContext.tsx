import { createBrowserHistory, Update } from 'history';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, type Location } from 'react-router-dom';
import { logout } from '../api/services/Auth';
import { loginRoute } from '../app/pages';
import { reset } from '../features/auth/authSlice';
import { useAuthContext } from './AuthContext/AuthContext';
import { appDispatch } from '../app/hooks';

export interface NavigationBundle {
    from: Location | undefined;
    to: Location | undefined;
}

export const defaultNavigationBundle = {
    from: undefined,
    to: undefined,
};

export const NavigationContext = createContext<NavigationBundle>(
    defaultNavigationBundle
);

type NavigationProviderProps = {
    children: React.ReactNode;
};

const history = createBrowserHistory();

const NavigationProvider: React.FC<NavigationProviderProps> = ({
    children,
}: NavigationProviderProps) => {
    const [from, setFrom] = useState<Location | undefined>(undefined);
    const [to, setTo] = useState<Location | undefined>(undefined);
    const location = useLocation();
    const { auth, isIntervalActive, hasStoredToken } = useAuthContext();
     const dispatch = appDispatch()
    
    useEffect(() => {
        setFrom(location);
    }, [location]);
    
    useEffect(() => {
        const toLoginPage = async () => {
            await logout();
            dispatch(reset())
            return <Navigate to={loginRoute} replace />;
        }
        history.listen((update: Update) => {
            if (update.action === 'POP') {
                if (!isIntervalActive() || auth.isLogout || !hasStoredToken()) {
                    return toLoginPage();
                }
                setTo(update.location);
            }
        });
    }, []);
    
    const navigationBundle: NavigationBundle = useMemo(() => {
        return {
            from,
            to,
        };
    }, [from, to]);
    
    return (
        <NavigationContext.Provider value={navigationBundle}>
        {children}
        </NavigationContext.Provider>
    );
};

export default NavigationProvider;