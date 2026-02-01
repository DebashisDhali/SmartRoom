import axios from 'axios';

const getBaseUrl = () => {
    // If VITE_API_URL is set (e.g. for Vercel), use it. 
    // Otherwise fallback to /api/v1 (which relies on vite.config.js proxy locally)
    let url = import.meta.env.VITE_API_URL || '/api/v1';
    
    // Ensure no double slashes, but keep the http:// or https:// protocol if present
    // Robust regex to fix things like https://domain.com//api
    return url.replace(/([^:]\/)\/+/g, "$1");
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
