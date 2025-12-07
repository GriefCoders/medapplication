import { QUERY_KEYS } from "@/shared/api/query-keys";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Equipment, CreateEquipmentDto, UpdateEquipmentDto } from "../model";
import type { Repair } from "@/entities/repair";
import {
  searchEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentHistory,
} from "./equipment";

export const useSearchEquipment = (
  query?: string,
  options?: Omit<UseQueryOptions<Equipment[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EQUIPMENT.SEARCH, query],
    queryFn: () => searchEquipment(query),
    refetchOnMount: true,
    staleTime: 30000,
    ...options,
  });
};

export const useGetEquipmentById = (
  id: string,
  options?: Omit<UseQueryOptions<Equipment>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EQUIPMENT.BY_ID, id],
    queryFn: () => getEquipmentById(id),
    refetchOnMount: true,
    staleTime: 0,
    ...options,
  });
};

export const useCreateEquipment = (
  options?: Omit<UseMutationOptions<Equipment, Error, CreateEquipmentDto>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEquipment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EQUIPMENT.SEARCH] });
    },
    ...options,
  });
};

export const useUpdateEquipment = (
  options?: Omit<UseMutationOptions<Equipment, Error, { id: string; payload: UpdateEquipmentDto }>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEquipmentDto }) =>
      updateEquipment(id, payload),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData([QUERY_KEYS.EQUIPMENT.BY_ID, variables.id], data);
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EQUIPMENT.SEARCH] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EQUIPMENT.HISTORY, variables.id] }),
      ]);
    },
    ...options,
  });
};

export const useDeleteEquipment = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EQUIPMENT.SEARCH] });
    },
    ...options,
  });
};

export const useGetEquipmentHistory = (
  id: string,
  options?: Omit<UseQueryOptions<Repair[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EQUIPMENT.HISTORY, id],
    queryFn: () => getEquipmentHistory(id),
    ...options,
  });
};

