// src/hooks/useAuth.ts
import { AuthData, LoginRequest, RegisterRequest, ApiResponse } from "@/types";
import { AuthStateStore } from '@/store/auth';

export function useAuth() {
    const { role, isAuthenticated, expiresAt } = AuthStateStore()
    const setAuth = AuthStateStore((s) => s.setAuth);
    const clearAuth = AuthStateStore((s) => s.clearAuth);
    const updateAccessToken = AuthStateStore((s) => s.updateAccessToken);

    async function login(request: LoginRequest): Promise<ApiResponse<AuthData>> {
        const result: ApiResponse<AuthData> =
            await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            }).then(res => res.json());

        if (result.success && result.data?.token && result.data?.role && result.data?.expiresIn) {
            setAuth(
                result.data.token,
                result.data.role,
                result.data.expiresIn
            );
        }

        return result;
    }

    async function register(request: RegisterRequest): Promise<ApiResponse<AuthData>> {
        const result: ApiResponse<AuthData> =
            await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            }).then(res => res.json());

        if (result.success && result.data?.token && result.data?.role && result.data?.expiresIn) {
            setAuth(
                result.data.token,
                result.data.role,
                result.data.expiresIn
            );
        }

        return result;
    }

    async function refresh(): Promise<ApiResponse<AuthData>> {
        const result: ApiResponse<AuthData> =
            await fetch("/api/auth/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json());

        if (result.success && result.data?.token && result.data?.expiresIn) {
            updateAccessToken(result.data.token, result.data.expiresIn);
        }

        return result;
    }

    async function logout(): Promise<ApiResponse<never>> {
        const result: ApiResponse<never> =
            await fetch("/api/auth/logout", {
                method: "POST"
            }).then((res) => res.json());

        if (result.success) clearAuth();

        return result;
    }

    return {
        role,
        isAuthenticated,
        expiresAt,
        login,
        register,
        logout,
        refresh
    };
}