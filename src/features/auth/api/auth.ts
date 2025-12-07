import { api } from "@/shared/api";
import type { LoginDto, RegisterDto, AuthResponse } from "../model/types";

export const loginUser = async (payload: LoginDto) => {
  const response = await api.post<AuthResponse>("/auth/signin", payload);
  return response.data;
};

export const registerUser = async (payload: RegisterDto) => {
  const response = await api.post<AuthResponse>("/auth/signup", payload);
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
  return response.data;
};

