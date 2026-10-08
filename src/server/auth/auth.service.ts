// src/server/auth/auth.service.ts
import { api } from "@/lib/api";
import type { AuthData, ApiResponse, LoginRequest, RegisterRequest } from "@/types";

export async function login(
    body: LoginRequest
): Promise<ApiResponse<AuthData>> {
    const { data } = await api.post<ApiResponse<AuthData>>("auth/login", body);
    return data;
}

export async function register(
    body: RegisterRequest
): Promise<ApiResponse<AuthData>> {
    const { data } = await api.post<ApiResponse<AuthData>>("auth/register", body);
    return data;
}

export async function refresh(
    refreshToken: string
): Promise<ApiResponse<AuthData>> {
    const { data } = await api.post<ApiResponse<AuthData>>("auth/refresh", {
        refreshToken,
    });
    return data;
}

export async function logout(
    refreshToken: string
): Promise<ApiResponse<never>> {
    const { data } = await api.post<ApiResponse<never>>("auth/logout", {
        refreshToken,
    });
    return data;
}