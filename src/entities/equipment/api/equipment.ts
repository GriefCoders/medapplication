import { api } from "@/shared/api";
import type { Equipment, CreateEquipmentDto, UpdateEquipmentDto } from "../model";
import type { Repair } from "@/entities/repair";

export const searchEquipment = async (query?: string) => {
  const response = await api.get<Equipment[]>("/equipment", {
    params: { query },
  });
  return response.data;
};

export const getEquipmentById = async (id: string) => {
  const response = await api.get<Equipment>(`/equipment/${id}`);
  return response.data;
};

export const createEquipment = async (payload: CreateEquipmentDto) => {
  const response = await api.post<Equipment>("/equipment", payload);
  return response.data;
};

export const updateEquipment = async (id: string, payload: UpdateEquipmentDto) => {
  const response = await api.put<Equipment>(`/equipment/${id}`, payload);
  return response.data;
};

export const deleteEquipment = async (id: string) => {
  await api.delete(`/equipment/${id}`);
};

export const getEquipmentHistory = async (id: string) => {
  const response = await api.get<Repair[]>(`/equipment/${id}/history`);
  return response.data;
};

