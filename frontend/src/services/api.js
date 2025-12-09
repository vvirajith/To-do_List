import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'
    : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createTask = async (title, description) => {
    try {
        const response = await api.post('/tasks', { title, description });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getTasks = async () => {
    try {
        const response = await api.get('/tasks');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const completeTask = async (id) => {
    try {
        const response = await api.put(`/tasks/${id}/complete`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;