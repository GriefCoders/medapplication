import { api } from "@/shared/api";
import type { User, CreateUserDto, UpdateUserDto } from "../model";

export const getCurrentUser = async () => {
  const response = await api.get<User>("/user/me");
  return response.data;
};

export const searchUsers = async (query?: string) => {
  const response = await api.get<User[]>("/user/search", {
    params: { query },
  });
  return response.data;
};

export const createUser = async (payload: CreateUserDto) => {
  const response = await api.post<User>("/user", payload);
  return response.data;
};

export const updateUser = async (id: string, payload: UpdateUserDto) => {
  const response = await api.patch<User>(`/user/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/user/${id}`);
};

