// staff-dashboard/src/services/adminApi.js
import axios from 'axios';

const adminApi = axios.create({
    baseURL: 'http://localhost:5001/api', // Points to your existing Boxingly backend
});

adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminAuthToken'); // Use a different token key
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default adminApi;