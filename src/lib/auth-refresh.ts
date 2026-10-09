// src/lib/auth-refresh.ts
import { AuthStateStore } from "@/store/auth";
import type { ApiResponse, AuthData } from "@/types";

/**
 * El backend rota el refresh token (un solo uso). Si dos llamadas a /api/auth/refresh
 * salen a la vez, la segunda usa un token ya quemado, falla y desloguea al usuario.
 * Por eso todo el que necesite refrescar (hidratación, interceptor 401, useAuth)
 * pasa por aquí: mientras haya una petición en curso, todos comparten la misma promesa.
 */
let inflight: Promise<string | null> | null = null;

/** Devuelve el nuevo access token, o null si no se pudo refrescar. */
export function refreshSession(): Promise<string | null> {
    if (!inflight) {
        inflight = doRefresh().finally(() => {
            inflight = null;
        });
    }
    return inflight;
}

/** user_role no es httpOnly: sirve para saber si vale la pena intentar un refresh. */
export function hasSessionCookie(): boolean {
    return document.cookie.split("; ").some((c) => c.startsWith("user_role="));
}

async function doRefresh(): Promise<string | null> {
    try {
        const result = await fetch("/api/auth/refresh", { method: "POST" });
        const data: ApiResponse<AuthData> = await result.json();

        if (data.success && data.data?.token && data.data.role && data.data.expiresIn) {
            AuthStateStore.getState().setAuth(
                data.data.token,
                data.data.role,
                data.data.expiresIn
            );
            return data.data.token;
        }
    } catch {
        // red caída o respuesta no JSON: se trata como refresh fallido
    }

    return null;
}
