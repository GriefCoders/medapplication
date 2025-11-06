import { routes } from "@/app/routes/routes";
import type { AuthResponse } from "@/features/auth/model";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { AUTH_TOKEN } from "../types/token";
import type { ErrorResponse } from "./types";

export const createApiClient = (baseURL: string) => {
  const apiClient = axios.create({ baseURL });

  const refresh = async (data: { refreshToken: string }) => {
    const response = await apiClient.post<AuthResponse>("/auth/refresh", data);
    return response.data;
  };

  apiClient.interceptors.request.use((instance) => {
    const accessToken = localStorage.getItem(AUTH_TOKEN.ACCESS);
    if (accessToken) {
      instance.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return instance;
  });

  let refreshTokenAttempts = 0;
  let isRefreshing = false;

  const showErrorNotification = (error: AxiosError) => {
    const errorData = error.response?.data as ErrorResponse | undefined;
    const message = errorData?.error || "Произошла ошибка";
    const description = Array.isArray(errorData?.message)
      ? errorData.message.join(", ")
      : errorData?.message || error.message || "Попробуйте позже";

    toast.error(message, { description });
  };

  const clearAuth = () => {
    localStorage.removeItem(AUTH_TOKEN.ACCESS);
    localStorage.removeItem(AUTH_TOKEN.REFRESH);
    delete apiClient.defaults.headers.common["Authorization"];
    window.location.href = routes.auth.login;
  };

  const resetRefreshState = () => {
    refreshTokenAttempts = 0;
    isRefreshing = false;
  };

  const waitForRefresh = (originalRequest: AxiosRequestConfig) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!isRefreshing) {
          clearInterval(interval);
          resolve(apiClient(originalRequest));
        }
      }, 100);
    });
  };

  const handleRefreshToken = async (
    originalRequest: AxiosRequestConfig & { _retry?: boolean }
  ) => {
    if (refreshTokenAttempts >= 1) {
      resetRefreshState();
      clearAuth();
      return Promise.reject(
        new Error("Превышено максимальное количество попыток обновления токена")
      );
    }

    if (isRefreshing) {
      return waitForRefresh(originalRequest);
    }

    originalRequest._retry = true;
    refreshTokenAttempts += 1;
    isRefreshing = true;

    try {
      const refreshTokenNow = localStorage.getItem(AUTH_TOKEN.REFRESH);
      if (!refreshTokenNow) {
        clearAuth();
        isRefreshing = false;
        return Promise.reject(new Error("Refresh token отсутствует"));
      }

      const response = await refresh({ refreshToken: refreshTokenNow });
      resetRefreshState();

      const { accessToken, refreshToken } = response;

      localStorage.setItem(AUTH_TOKEN.ACCESS, accessToken);
      localStorage.setItem(AUTH_TOKEN.REFRESH, refreshToken);

      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      resetRefreshState();

      if (refreshError instanceof AxiosError) {
        clearAuth();
        return Promise.reject(
          new Error("Сессия истекла, требуется повторная авторизация")
        );
      }

      return Promise.reject(refreshError);
    }
  };

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401) {
        if (originalRequest.url?.includes("/auth/refresh")) {
          resetRefreshState();
          clearAuth();
          return Promise.reject(new Error("Refresh token недействителен"));
        }

        if (!originalRequest._retry) {
          return handleRefreshToken(originalRequest);
        }
      }

      if (error.response?.status !== 401) {
        showErrorNotification(error);
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const api = createApiClient(import.meta.env.VITE_API_URL);
export const adminApi = createApiClient(import.meta.env.VITE_ADMIN_API_URL);
