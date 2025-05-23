import axios, { AxiosError } from 'axios';
import StringConstant from '../constants/stringConstant';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '',
    timeout: Number(process.env.REACT_APP_AXIOS_TIMEOUT),
    withCredentials: true,
});

// const refreshToken = async () => {
//     try {
//         const resp = await apiClient.get('auth/access-token');
//         return resp.data.accessToken;
//     } catch (e) {
//         Logger.debug("Error",e);   
//     }
// };

apiClient.interceptors.request.use(
    (config) => {
        // Modify the request config here, e.g., add authentication headers
        const token = localStorage.getItem(StringConstant.ACCESS_TOKEN_ALIAS)
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        if (!!response?.data?.accessToken) {
            localStorage.setItem(StringConstant.ACCESS_TOKEN_ALIAS, response.data.accessToken);
        }
        return response.data
    },
    (error: AxiosError) => {
        if (!!error?.response?.data) {
            return Promise.reject(error?.response?.data);
        }
        return Promise.reject(error);
    }
    // async (error: AxiosError) => {
    //     const originalRequest: any = error.config;
    //     if (error.response?.status === 403 && !originalRequest?._retry) {
    //         originalRequest._retry = true;
    //         const accessToken = await refreshToken();
    //         if (!!accessToken) {
    //             localStorage.setItem(StringConstant.ACCESS_TOKEN_ALIAS, accessToken);
    //             apiClient.defaults.headers.common[
    //                 "Authorization"
    //             ] = `Bearer ${accessToken}`;
    //             return apiClient(originalRequest);
    //         }
    //     }
    //     if (axios.isCancel(error)) {
    //         window.Logger.debug('Request canceled', error.message);
    //     }
    //     if (!!error?.response?.data) return Promise.reject(error?.response?.data);
    //     return Promise.reject(error);
    // }
);

export default apiClient;