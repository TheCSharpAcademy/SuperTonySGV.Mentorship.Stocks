import axios from 'axios';

const API_URL = 'https://localhost:7257/api'; // Update this to your API URL

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const register = (userData: { username: string, email: string, password: string, polygonApiKey: string }) => {
    return api.post('/Users/register', userData);
};

export const login = (userData: { email: string, password: string }) => {
    return api.post('/Users/login', userData);
};

export const getStocks = () => {
    return api.get('/users/stocks');
};

export const updateStockList = async (stockList: string) => {
    return api.post('/users/stocks', { stockList });
};

export const getProfile = (token: string) => {
    return api.get('/users/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const updateProfile = (profileData: { email: string, polygonApiKey: string, setRequestLimit: boolean }, token: string) => {
    return api.post('/users/profile', profileData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getStockList = async () => {
    try {
        const response = await api.get('/users/stocks');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data);
            throw new Error('API Error: ' + (error.response?.data?.message || error.message));
        } else {
            console.error('Unexpected Error:', error);
            throw new Error('Unexpected Error: ' + (error as Error).message);
        }
    }
};