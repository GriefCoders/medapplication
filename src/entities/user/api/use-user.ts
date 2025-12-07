import { QUERY_KEYS } from "@/shared/api/query-keys";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { User, CreateUserDto, UpdateUserDto } from "../model";
import { getCurrentUser, searchUsers, createUser, updateUser, deleteUser } from "./user";

export const useGetCurrentUser = (
  options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER.ME],
    queryFn: getCurrentUser,
    ...options,
  });
};

export const useSearchUsers = (
  query?: string,
  options?: Omit<UseQueryOptions<User[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER.SEARCH, query],
    queryFn: () => searchUsers(query),
    refetchOnMount: true,
    staleTime: 30000,
    ...options,
  });
};

export const useCreateUser = (
  options?: Omit<UseMutationOptions<User, Error, CreateUserDto>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.SEARCH] });
    },
    ...options,
  });
};

export const useUpdateUser = (
  options?: Omit<UseMutationOptions<User, Error, { id: string; payload: UpdateUserDto }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDto }) => updateUser(id, payload),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData([QUERY_KEYS.USER.BY_ID, variables.id], data);
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.SEARCH] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.ME] }),
      ]);
    },
    ...options,
  });
};

export const useDeleteUser = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.SEARCH] });
    },
    ...options,
  });
};

