import { api } from "@/shared/api";
import { useMutation } from "@tanstack/react-query";
import type { AuthPayload, AuthResponse, RegisterPayload } from "../model";

export const loginUser = async (payload: AuthPayload) => {
  const response = await api.post<AuthResponse>("/auth/sign-in", payload);
  return response.data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await api.post<AuthResponse>("/auth/sign-up", payload);
  return response.data;
};

export const signOutUser = async () => {
  const response = await api.post("/auth/sign-out");
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post<AuthResponse>("/auth/refresh");
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await api.post(`/auth/sign-up/confirm/${token}`);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/users/password/forgot", { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post(`/users/password/reset/${token}`, {
    password,
  });
  return response.data;
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = (token: string) => {
  return useMutation({
    mutationFn: (password: string) => resetPassword(token, password),
  });
};
