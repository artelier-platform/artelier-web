// src/app/api/auth/login/route.ts
import { login } from "@/server/auth/auth.service";
import { cookies } from "next/headers";
import type { LoginRequest } from "@/types";

export async function POST(request: Request) {
    const body: LoginRequest = await request.json();

    const response = await login(body);

    if (response.success && response.data) {
        const cookieStore = await cookies();

        cookieStore.set("refresh_token", response.data.refreshToken!, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        // Cookie de role legible por el middleware (no httpOnly)
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

    return Response.json(response, {
        status: response.success ? 200 : 401,
    });
}