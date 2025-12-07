import type { Equipment } from "@/entities/equipment";
import type { Site } from "@/entities/site";
import type { User } from "@/entities/user";
import type { ServiceRequestStatus } from "@/shared/types/enums";
import type { PaginationParams } from "@/shared/types/pagination";

export interface ServiceRequest {
  id: string;
  senderId: string;
  sender: User;
  assigneeId?: string | null;
  assignee?: User | null;
  summary: string;
  equipmentId?: string | null;
  equipment?: Equipment | null;
  description?: string | null;
  type?: string | null;
  priority?: string | null;
  status: ServiceRequestStatus;
  comment?: string | null;
  siteId: string;
  site: Site;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequestDto {
  summary: string;
  description?: string;
  type?: string;
  priority?: string;
  equipmentId?: string;
}

export interface UpdateServiceRequestDto {
  summary?: string;
  description?: string;
  type?: string;
  priority?: string;
  equipmentId?: string;
  status?: ServiceRequestStatus;
  comment?: string;
}

export interface AssignServiceRequestDto {
  assigneeId: string;
}

export interface ServiceRequestFilters extends PaginationParams {
  status?: ServiceRequestStatus;
  siteId?: string;
  senderId?: string;
  assigneeId?: string;
  type?: string;
  priority?: string;
}
