import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AuthResponse, LoginDto, RegisterDto } from "../model/types";
import { loginUser, registerUser } from "./auth";

export const useLogin = (
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, LoginDto>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: loginUser,
    ...options,
  });
};

export const useRegister = (
  options?: Omit<
    UseMutationOptions<AuthResponse, Error, RegisterDto>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: registerUser,
    ...options,
  });
};
