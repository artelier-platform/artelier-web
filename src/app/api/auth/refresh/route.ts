// src/app/api/auth/refresh/route.ts
import { refresh } from "@/server/auth/auth.service";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
        return Response.json(
            { success: false, message: "No refresh token" },
            { status: 401 }
        );
    }

    const response = await refresh(refreshToken);

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