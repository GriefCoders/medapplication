import type { Role } from "@/shared/types/enums";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  siteId: string;
  roomNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}
