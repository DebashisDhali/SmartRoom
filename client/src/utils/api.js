import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || '/api/v1';
    // Fix common issue where user puts double slash in env var (e.g. .app//api)
    return url.replace(/([^:]\/)\/+/g, "$1");
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
