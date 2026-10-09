// src/app/api/auth/refresh/route.ts
import { isAxiosError } from "axios";
import { refresh } from "@/server/auth/auth.service";
import { cookies } from "next/headers";
import type { ApiResponse, AuthData } from "@/types";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        return Response.json(
            { success: false, message: "No refresh token" },
            { status: 401 }
        );
    }

    let response: ApiResponse<AuthData>;

    try {
        response = await refresh(refreshToken);
    } catch (error) {
        const status = isAxiosError(error) ? error.response?.status : undefined;

        // El backend rechazó el token (vencido, ya usado, usuario baneado): sesión terminada.
        if (status !== undefined && status >= 400 && status < 500) {
            cookieStore.delete("refresh_token");
            cookieStore.delete("user_role");

            return Response.json(
                { success: false, message: "Session expired" },
                { status: 401 }
            );
        }

        // Backend caído o error de red: NO borramos las cookies, el token sigue siendo válido.
        return Response.json(
            { success: false, message: "Auth service unavailable" },
            { status: 503 }
        );
    }

    if (response.success && response.data) {
        // Rotamos el refresh token (single-use según el backend)
        cookieStore.set("refresh_token", response.data.refreshToken!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        cookieStore.set("user_role", response.data.role!, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        const { refreshToken: _, ...safeData } = response.data;

        return Response.json({ ...response, data: safeData });
    }

    // Refresh falló — limpiar cookies
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_role");

    return Response.json(response, { status: 401 });
}
