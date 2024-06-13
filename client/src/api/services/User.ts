import { LoginInfo, User } from '../../features/auth/authSlice';
import { ApiResponse } from '../../types/Response';
import apiClient from '../apiClient';

export const loginUser = async (loginInfo: LoginInfo): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(`/auth/login`, loginInfo);
        return response as ApiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};

export const registerUser = async (signUpUser: User): Promise<ApiResponse> => {
    try {
        const response: unknown = await apiClient.post(`/auth/register`, signUpUser);
        return response as ApiResponse;
    } catch (error: any) {
        return error as ApiResponse;
    }
};