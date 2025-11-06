import { api } from "@/shared/api";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  ChangePasswordPayload,
  UpdateUserPayload,
  User,
  UserSearchPayload,
} from "../model";

export const getUser = async () => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const searchGroupMembers = async (payload: UserSearchPayload) => {
  const response = await api.post<User[]>(
    `/users/group-members/search`,
    payload
  );
  return response.data;
};

export const updateUser = async (payload: UpdateUserPayload) => {
  const response = await api.patch<User>("/users/me", payload);
  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await api.post<User>("/users/reset-password", payload);
  return response.data;
};

export const useGetUser = (
  options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER.ME],
    queryFn: getUser,
    ...options,
  });
};

export const useSearchGroupMembers = (
  payload: UserSearchPayload,
  options?: Omit<UseQueryOptions<User[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER.GROUP_MEMBERS, payload],
    queryFn: () => searchGroupMembers(payload),
    ...options,
  });
};

export const useUpdateUser = (
  options?: Omit<
    UseMutationOptions<User, Error, UpdateUserPayload>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(payload),
    ...options,
  });
};

export const useChangePassword = (
  options?: Omit<
    UseMutationOptions<User, Error, ChangePasswordPayload>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    ...options,
  });
};
