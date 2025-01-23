import { createContext, useContext } from 'react';
import { useAppSelector } from '../../app/hooks';
import { AuthState } from '../../features/auth/authSlice';

export type AuthType = 'info' | 'error' | 'success'

interface AuthContextInterface {
    auth: AuthState
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
    const auth = useAppSelector((state) => state.auth);

    return (
        <AuthContext.Provider value={{ auth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;