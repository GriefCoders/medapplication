export interface AuthPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    email: string
    password: string
    name: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
}

export * from "./types";