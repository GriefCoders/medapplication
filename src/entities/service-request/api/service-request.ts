import { api } from "@/shared/api";
import type { ServiceRequestStatus } from "@/shared/types/enums";
import type {
  ServiceRequest,
  CreateServiceRequestDto,
  UpdateServiceRequestDto,
  AssignServiceRequestDto,
} from "../model";

export interface ServiceRequestStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  byPriority?: { [priority: string]: number };
  bySite?: { [siteId: string]: number };
}

export const getAllServiceRequests = async (status?: ServiceRequestStatus) => {
  const response = await api.get<ServiceRequest[]>("/service-requests", {
    params: { status },
  });
  return response.data;
};

export const getMyServiceRequests = async () => {
  const response = await api.get<ServiceRequest[]>("/service-requests/my");
  return response.data;
};

export const getServiceRequestById = async (id: string) => {
  const response = await api.get<ServiceRequest>(`/service-requests/${id}`);
  return response.data;
};

export const getServiceRequestStats = async () => {
  const response = await api.get<ServiceRequestStats>("/service-requests/stats");
  return response.data;
};

export const createServiceRequest = async (payload: CreateServiceRequestDto) => {
  const response = await api.post<ServiceRequest>("/service-requests", payload);
  return response.data;
};

export const updateServiceRequest = async (id: string, payload: UpdateServiceRequestDto) => {
  const response = await api.put<ServiceRequest>(`/service-requests/${id}`, payload);
  return response.data;
};

export const updateServiceRequestStatus = async (id: string, status: ServiceRequestStatus) => {
  const response = await api.patch<ServiceRequest>(`/service-requests/${id}/status`, { status });
  return response.data;
};

export const assignServiceRequest = async (id: string, payload: AssignServiceRequestDto) => {
  const response = await api.post<ServiceRequest>(`/service-requests/${id}/assign`, payload);
  return response.data;
};

