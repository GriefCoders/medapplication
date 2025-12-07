import type { Site } from "@/entities/site";
import type { Filters, SearchPayload } from "@/shared/api/types";
import type { Role } from "@/shared/types/enums";
import type { PaginationParams } from "@/shared/types/pagination";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  roomNumber?: string | null;
  siteId: string;
  site: Site;
  person?: Person;
}

export interface Person {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  presignedURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStore {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User) => void;
  setIsLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  siteId: string;
  roomNumber?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
  role?: Role;
  siteId?: string;
  roomNumber?: string;
}

export interface UserFiltersNew extends PaginationParams {
  role?: Role;
  siteId?: string;
}

export interface UserFilters extends Filters {
  email?: string;
  groupIds?: string[];
  query?: string;
}

export type UserSearchPayload = SearchPayload<UserFilters>;

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  avatar?: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};
