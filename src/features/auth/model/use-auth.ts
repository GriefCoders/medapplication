import { routes } from "@/app/routes/routes";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import { AUTH_TOKEN } from "@/shared/types/token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginUser, registerUser } from "../api";
import type { AuthResponse } from "./types";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.LOGIN],
    mutationFn: loginUser,
    onSuccess: (response: AuthResponse) => {
      localStorage.clear();
      localStorage.setItem(AUTH_TOKEN.ACCESS, response.tokens.accessToken);
      localStorage.setItem(AUTH_TOKEN.REFRESH, response.tokens.refreshToken);

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.ME] });
      navigate(routes.main.home);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH.REGISTER],
    mutationFn: registerUser,
    onSuccess: (response) => {
      toast.success("Вы успешно зарегистрировались");

      localStorage.clear();
      localStorage.setItem(AUTH_TOKEN.ACCESS, response.tokens.accessToken);
      localStorage.setItem(AUTH_TOKEN.REFRESH, response.tokens.refreshToken);

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.ME] });
      navigate(routes.main.home);
    },
    onError: (error) => {
      throw error;
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  return () => {
    localStorage.clear();
    navigate(routes.auth.login);
  };
};
