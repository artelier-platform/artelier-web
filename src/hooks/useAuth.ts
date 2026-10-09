// src/hooks/useAuth.ts
import { AuthData, LoginRequest, RegisterRequest, ApiResponse } from "@/types";
import { AuthStateStore } from "@/store/auth";
import { refreshSession } from "@/lib/auth-refresh";

export function useAuth() {
    const role = AuthStateStore((s) => s.role);
    const isAuthenticated = AuthStateStore((s) => s.isAuthenticated);
    const isInitialized = AuthStateStore((s) => s.isInitialized);
    const expiresAt = AuthStateStore((s) => s.expiresAt);
    const setAuth = AuthStateStore((s) => s.setAuth);
    const clearAuth = AuthStateStore((s) => s.clearAuth);

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

    /** true si la sesión se refrescó. Comparte la petición con el resto de la app. */
    async function refresh(): Promise<boolean> {
        return (await refreshSession()) !== null;
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
        isInitialized,
        expiresAt,
        login,
        register,
        logout,
        refresh
    };
}
