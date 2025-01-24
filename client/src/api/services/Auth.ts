import StringConstant from '../../constants/stringConstant';
import { LoginInfo, User } from '../../features/auth/authSlice';
import { ApiResponse, AuthResponse } from '../../types/Response';
import apiClient from '../apiClient';

export const login = async (loginInfo: LoginInfo): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(`/auth/login`, loginInfo);
        const apiResponse: ApiResponse = response as ApiResponse;
        const authResponse: AuthResponse = apiResponse.data as AuthResponse
        if (!!authResponse.accessToken) { 
            localStorage.setItem(StringConstant.ACCESS_TOKEN_ALIAS, JSON.stringify(authResponse.accessToken)); 
        }
        return apiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};

export const register = async (signUpUser: User): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(`/auth/register`, signUpUser);
        return response as ApiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};

export const getUserData = async (): Promise<ApiResponse> => { 
    const response: unknown = await apiClient.get(`/auth/access-token`);
    const apiResponse: ApiResponse = response as ApiResponse;
    const authResponse: AuthResponse = apiResponse.data as AuthResponse
    if (!!authResponse.accessToken) { 
        localStorage.setItem(StringConstant.ACCESS_TOKEN_ALIAS, JSON.stringify(authResponse.accessToken)); 
    }
    return apiResponse;
}

export const logout = async (): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(`/auth/logout`);
        localStorage.clear()
        return response as ApiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};