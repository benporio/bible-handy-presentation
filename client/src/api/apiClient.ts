import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 1000,
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
        if (axios.isCancel(error)) {
            window.console.log('Request canceled', error.message);
        }
        if (!!error?.response?.data) return Promise.reject(error?.response?.data);
        return Promise.reject(error);
    }
);

export default apiClient;