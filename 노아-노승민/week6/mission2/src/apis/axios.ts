import axios from "axios";

// 기본 axios 인스턴스 생성
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
  (response) => response, // 응답 성공 시 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 감지 
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken 가져오기
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error(" RefreshToken 없음");

        // refresh 요청 보내기
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
          { refreshToken }
        );

        // 새 accessToken 발급
        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // 저장소 갱신
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 원래 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error(" 토큰 재발급 실패:", refreshError);

        // 토큰 만료 → 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userName");

        window.location.href = "/login";
      }
    }

    // 그 외 에러는 그대로 throw
    return Promise.reject(error);
  }
);
