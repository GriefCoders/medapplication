import type { Site } from '@/entities/site';
import type { PaginationParams } from '@/shared/types/pagination';

export interface Equipment {
  id: string;
  name: string;
  description?: string | null;
  inventoryNumber?: string | null;
  siteId: string;
  site: Site;
  serialNumber?: string | null;
  state?: string | null;
  roomNumber?: string | null;
}

export interface CreateEquipmentDto {
  name: string;
  description?: string;
  inventoryNumber?: string;
  siteId: string;
  serialNumber?: string;
  state?: string;
  roomNumber?: string;
}

export interface UpdateEquipmentDto {
  name?: string;
  description?: string;
  inventoryNumber?: string;
  siteId?: string;
  serialNumber?: string;
  state?: string;
  roomNumber?: string;
}

export interface EquipmentFilters extends PaginationParams {
  siteId?: string;
  state?: string;
  roomNumber?: string;
}

