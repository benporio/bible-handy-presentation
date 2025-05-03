import Endpoint from '../../constants/endpoint';
import StringConstant from '../../constants/stringConstant';
import { LoginInfo, User } from '../../features/auth/authSlice';
import { ApiResponse, AuthResponse } from '../../types/Response';
import apiClient from '../apiClient';

const handlingToken = (response: ApiResponse) => {
    const authResponse: AuthResponse = response.data as AuthResponse
    if (!!authResponse.accessToken) { 
        localStorage.setItem(StringConstant.ACCESS_TOKEN_ALIAS, JSON.stringify(authResponse.accessToken)); 
    }
}

export const login = async (loginInfo: LoginInfo): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(Endpoint.AUTH_LOGIN, loginInfo);
        const apiResponse: ApiResponse = response as ApiResponse;
        handlingToken(apiResponse)
        return apiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};

export const register = async (signUpUser: User): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(Endpoint.AUTH_REGISTER, signUpUser);
        const apiResponse: ApiResponse = response as ApiResponse;
        handlingToken(apiResponse)
        return apiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};

export const getUserData = async (): Promise<ApiResponse> => { 
    const response: unknown = await apiClient.get(Endpoint.AUTH_ACCESS_TOKEN);
    const apiResponse: ApiResponse = response as ApiResponse;
    const authResponse: AuthResponse = apiResponse.data as AuthResponse
    if (!!authResponse.accessToken) { 
        localStorage.setItem(StringConstant.ACCESS_TOKEN_ALIAS, JSON.stringify(authResponse.accessToken)); 
    }
    return apiResponse;
}

export const logout = async (): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(Endpoint.AUTH_LOGOUT);
        localStorage.clear()
        return response as ApiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};