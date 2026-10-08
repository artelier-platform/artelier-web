// src/app/api/auth/register/route.ts
import { register } from "@/server/auth/auth.service";
import { cookies } from "next/headers";
import type { RegisterRequest } from "@/types";

export async function POST(request: Request) {
    const body: RegisterRequest = await request.json();

    const response = await register(body);

    if (response.success && response.data) {
        const cookieStore = await cookies();

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

        return Response.json(
            { ...response, data: safeData },
            { status: 201 }
        );
    }

    return Response.json(response, {
        status: response.success ? 201 : 400,
    });
}