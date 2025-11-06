import type { UserGroup } from "@/entities/group/model";
import type { Role } from "@/entities/role/model";
import type { Filters, SearchPayload } from "@/shared/api/types";

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  isBlocked: boolean;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  person: Person;
  userGroups: UserGroup[];
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
  setUser: (user: User) => void;
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
