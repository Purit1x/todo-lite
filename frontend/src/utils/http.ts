import axios, { type AxiosInstance } from 'axios';
import Cookies from "js-cookie";

const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // only redirect for non-auth request
        const currentPath = window.location.pathname;
        const isAuthRequest = error.config?.url?.includes('/auth/');

        if (error.response?.status === 401 && !isAuthRequest && currentPath !== '/login') {
            Cookies.remove("token");
            Cookies.remove("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default http;