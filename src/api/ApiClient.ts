import axios from 'axios';
import type { ApiError } from '../types/ApiError';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) =>
    {
        const token =  localStorage.getItem('token');

        if (token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError<ApiError>(error) && error.response) {
            const status = error.response.status;
            
            if (status === 401 || status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/'; 
            }
            
            const errorMessage = error.response.data.detail;
            console.error(`[API Error ${status}]: ${errorMessage}`);
        } else {
            console.error("Network Error: Backend is unreachable");
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;