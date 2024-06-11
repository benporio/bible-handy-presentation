import { LoginInfo, User } from '../../features/auth/authSlice';
import { ApiResponse } from '../../types/Response';
import apiClient from '../apiClient';

export const loginUser = async (loginInfo: LoginInfo): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post(`/auth/login`, loginInfo);
        console.log(response)
        return response.data as ApiResponse;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (signUpUser: User): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post(`/auth/register`, signUpUser);
        return response.data;
    } catch (error) {
        throw error;
    }
};