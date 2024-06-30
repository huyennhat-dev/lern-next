// axiosInstance.ts
import envConfig from "@/configs/config";
import queryString from "query-string";
import Cookies from "js-cookie";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import requiresToken from "@/axios/requiresToken";

const axiosInstance = axios.create({
  baseURL: envConfig.NEXT_PUBLIC_API_ENDPOINT, // URL gốc của API
  timeout: 10000, // Thời gian chờ request
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
});

// Function để lấy access token từ localStorage hoặc từ state
const getAccessToken = (): string | null => localStorage.getItem("accessToken");

// Function để lưu access token vào localStorage hoặc state
const setAccessToken = (token: string): void =>
  localStorage.setItem("accessToken", token);

// Interceptor để thêm access token vào headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (requiresToken(config.url!.trim())) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý refresh token khi access token hết hạn
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Kiểm tra nếu lỗi là lỗi 401 (Unauthorized) và không phải là request để refresh token
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refreshToken");

      // Gọi API để refresh token
      try {
        const response = await axiosInstance.post("/auth/refresh-token", {
          token: refreshToken,
        });
        const newAccessToken = response.data.accessToken;

        // Lưu access token mới
        setAccessToken(newAccessToken);

        // Thêm access token mới vào headers của request gốc
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Thực hiện lại request gốc
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Xử lý lỗi refresh token (ví dụ: điều hướng tới trang đăng nhập)
        console.error("Unable to refresh token", refreshError);
        // Optional: Redirect to login page if refresh token fails
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
