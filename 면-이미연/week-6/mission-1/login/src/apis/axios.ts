import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
    type AxiosError,
} from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/keys";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    timeout: 15000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = (error.config || {}) as CustomInternalAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === "/v1/auth/refresh") {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
                        { refresh: refreshToken }
                    );

                    const newAccess = data?.data?.accessToken as string;
                    const newRefresh = data?.data?.refreshToken as string;

                    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccess);
                    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefresh);

                    axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
                    return newAccess;
                })()
                    .catch((e) => {
                        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                        throw e;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance.request(originalRequest);
        }

        return Promise.reject(error);
    }
);
