// src/app/api/auth/refresh/route.ts
import { isAxiosError } from "axios";
import { refresh } from "@/server/auth/auth.service";
import { cookies } from "next/headers";
import type { ApiResponse, AuthData } from "@/types";

/** Cookie lifetime in seconds (30 days). */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Resolved Next.js request-scoped cookie store type. */
type CookieStore = Awaited<ReturnType<typeof cookies>>;

/**
 * Removes authentication cookies (`refresh_token` and `user_role`) from the response cookie jar.
 *
 * @param cookieStore - Resolved Next.js request cookie store.
 */
function clearAuthCookies(cookieStore: CookieStore): void {
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_role");
}

/**
 * Persists rotated `refresh_token` (`httpOnly`) and `user_role` cookies after a successful refresh.
 *
 * @param cookieStore - Resolved Next.js request cookie store.
 * @param data - Authentication payload returned by the upstream refresh service.
 */
function setAuthCookies(cookieStore: CookieStore, data: AuthData): void {
    const isProduction = process.env.NODE_ENV === "production";

    if (data.refreshToken) {
        cookieStore.set("refresh_token", data.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        });
    }

    if (data.user?.role) {
        cookieStore.set("user_role", data.user.role, {
            httpOnly: false,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        });
    }
}

/**
 * Handles session renewal requests (`POST /api/auth/refresh`) in the Next.js BFF layer
 * using the `httpOnly` `refresh_token` cookie.
 *
 * Execution flow:
 * 1. Reads `refresh_token` from cookies; returns `401 Unauthorized` if missing.
 * 2. Calls the upstream `refresh` service:
 *    - On 4xx upstream errors: clears auth cookies and returns `401` (`Session expired`).
 *    - On 5xx or network failures: preserves cookies and returns `503` (`Auth service unavailable`).
 * 3. On success (`200 OK`): rotates cookies, strips `refreshToken` from the JSON response, and returns `safeData`.
 * 4. On unsuccessful API envelope: clears auth cookies and returns the response with `401`.
 *
 * @returns A promise resolving to a Web Fetch `Response` object.
 */
export async function POST(): Promise<Response> {
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

        if (status !== undefined && status >= 400 && status < 500) {
            clearAuthCookies(cookieStore);

            return Response.json(
                { success: false, message: "Session expired" },
                { status: 401 }
            );
        }

        return Response.json(
            { success: false, message: "Auth service unavailable" },
            { status: 503 }
        );
    }

    if (response.success && response.data) {
        setAuthCookies(cookieStore, response.data);
        const { refreshToken: _, ...safeData } = response.data;

        return Response.json({ ...response, data: safeData });
    }

    clearAuthCookies(cookieStore);

    return Response.json(response, { status: 401 });
}