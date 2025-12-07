import type { Equipment } from '@/entities/equipment';

export interface Repair {
  id: string;
  date: string;
  equipmentId: string;
  equipment: Equipment;
}

export interface CreateRepairDto {
  date: string;
  equipmentId: string;
}

