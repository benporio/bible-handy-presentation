import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useAppSelector } from '../../app/hooks';
import { AuthState, UserData } from '../../features/auth/authSlice';
import { getUserData } from '../../api/services/Auth';
import { ApiResponse } from '../../types/Response';
import Logger from '../../utils/Logger';
import StringConstant from '../../constants/stringConstant';
import { RootState } from '../../app/store';

export type AuthType = 'info' | 'error' | 'success'

interface AuthContextInterface {
    auth: AuthState
    validateToken<T>(authorizedCallback: (userData: UserData) => T, defaultCallback: () => T): Promise<T>
    isIntervalActive: () => boolean
    clearTokenCheckInterval: VoidFunction
    hasStoredToken: () => boolean
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const auth = useAppSelector<RootState, AuthState>((state) => state.auth);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

    const validateToken = useCallback((async function<T>(authorizedCallback: (userData: UserData) => T, defaultCallback: () => T): Promise<T> {
        Logger.debug('validateToken...')
        try {
            const userData: ApiResponse = await getUserData();
            if (!!userData) {
                return authorizedCallback(userData.data as UserData)
            }
        } catch (error) {
            Logger.error('Token validation failed', error)
        }
        return defaultCallback()
    }), []);

    const clearTokenCheckInterval = () => {
        Logger.debug('clearTokenCheckInterval...');
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    }

    useEffect(() => {
        if (auth.isLoggedIn) {
            intervalIdRef.current = setInterval(() => {
                Logger.debug('periodic token checking...');
                validateToken(
                    (userData) => {
                        return userData;
                    },
                    () => {
                        clearTokenCheckInterval();
                        return null;
                    }
                );
            }, Number(process.env.REACT_APP_TOKEN_CHECK_INTERVAL) || 60000);
        }

        return () => {
            clearTokenCheckInterval();
        }; // Cleanup interval on unmount
    }, [auth.isLoggedIn, validateToken]);

    const isIntervalActive = () => {
        const bool = intervalIdRef.current !== null
        if (bool) {
            Logger.debug('Token check interval is active');
        } else {
            Logger.debug('Token check interval is inactive');
        }
        return bool;
    };

    const hasStoredToken = () => localStorage.getItem(StringConstant.ACCESS_TOKEN_ALIAS) !== null

    return (
        <AuthContext.Provider value={{ auth, validateToken, isIntervalActive, clearTokenCheckInterval, hasStoredToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;