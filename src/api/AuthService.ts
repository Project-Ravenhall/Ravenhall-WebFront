import apiClient from './ApiClient';

export const LoginUser = async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data; // {User, Token}
}

export const SignupUser = async (username: string, password: string) => {
    const response = await apiClient.post('/auth/signup', { username, password });
    return response.data; // {User, Token}
}