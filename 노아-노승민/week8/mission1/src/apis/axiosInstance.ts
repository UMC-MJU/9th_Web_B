import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL + "/v1",
  withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 → refresh 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("no refresh token");

        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
          { refreshToken }
        );

        const newAccess = res.data.data.accessToken;
        const newRefresh = res.data.data.refreshToken;

        localStorage.setItem("accessToken", newAccess);
        if (newRefresh) {
          localStorage.setItem("refreshToken", newRefresh);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        // refresh 실패 → 강제 로그아웃
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
    }

    return Promise.reject(error);
  }
);
