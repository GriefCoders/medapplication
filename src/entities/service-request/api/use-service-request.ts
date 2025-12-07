import { QUERY_KEYS } from "@/shared/api/query-keys";
import type { ServiceRequestStatus } from "@/shared/types/enums";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type {
  AssignServiceRequestDto,
  CreateServiceRequestDto,
  ServiceRequest,
  UpdateServiceRequestDto,
} from "../model";
import type { ServiceRequestStats } from "./service-request";
import {
  assignServiceRequest,
  createServiceRequest,
  deleteServiceRequest,
  getAllServiceRequests,
  getMyServiceRequests,
  getServiceRequestById,
  getServiceRequestStats,
  updateServiceRequest,
  updateServiceRequestStatus,
} from "./service-request";

export const useGetAllServiceRequests = (
  status?: ServiceRequestStatus,
  options?: Omit<UseQueryOptions<ServiceRequest[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL, status],
    queryFn: () => getAllServiceRequests(status),
    refetchOnMount: true,
    staleTime: 30000,
    ...options,
  });
};

export const useGetMyServiceRequests = (
  options?: Omit<UseQueryOptions<ServiceRequest[]>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
    queryFn: getMyServiceRequests,
    refetchOnMount: true,
    staleTime: 30000,
    ...options,
  });
};

export const useGetServiceRequestById = (
  id: string,
  options?: Omit<UseQueryOptions<ServiceRequest>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUEST.BY_ID, id],
    queryFn: () => getServiceRequestById(id),
    refetchOnMount: true,
    staleTime: 0,
    ...options,
  });
};

export const useGetServiceRequestStats = (
  options?: Omit<UseQueryOptions<ServiceRequestStats>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
    queryFn: getServiceRequestStats,
    refetchOnMount: true,
    staleTime: 30000,
    ...options,
  });
};

export const useCreateServiceRequest = (
  options?: Omit<
    UseMutationOptions<ServiceRequest, Error, CreateServiceRequestDto>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
        }),
      ]);
    },
    ...options,
  });
};

export const useUpdateServiceRequest = (
  options?: Omit<
    UseMutationOptions<
      ServiceRequest,
      Error,
      { id: string; payload: UpdateServiceRequestDto }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateServiceRequestDto;
    }) => updateServiceRequest(id, payload),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData(
        [QUERY_KEYS.SERVICE_REQUEST.BY_ID, variables.id],
        data
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
        }),
      ]);
    },
    ...options,
  });
};

export const useUpdateServiceRequestStatus = (
  options?: Omit<
    UseMutationOptions<
      ServiceRequest,
      Error,
      { id: string; status: ServiceRequestStatus; comment?: string }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: ServiceRequestStatus;
      comment?: string;
    }) => updateServiceRequestStatus(id, status, comment),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData(
        [QUERY_KEYS.SERVICE_REQUEST.BY_ID, variables.id],
        data
      );

      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERVICE_REQUEST.BY_ID, variables.id],
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
        }),
      ]);
    },
    ...options,
  });
};

export const useAssignServiceRequest = (
  options?: Omit<
    UseMutationOptions<
      ServiceRequest,
      Error,
      { id: string; payload: AssignServiceRequestDto }
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AssignServiceRequestDto;
    }) => assignServiceRequest(id, payload),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData(
        [QUERY_KEYS.SERVICE_REQUEST.BY_ID, variables.id],
        data
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
        }),
      ]);
    },
    ...options,
  });
};

export const useDeleteServiceRequest = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteServiceRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.ALL],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.MY],
        }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.SERVICE_REQUEST.STATS],
        }),
      ]);
    },
    ...options,
  });
};
