// src/app/api/auth/logout/route.ts
import { logout } from "@/server/auth/auth.service";
import { cookies } from "next/headers";

/** Resolved Next.js request-scoped cookie store type. */
type CookieStore = Awaited<ReturnType<typeof cookies>>;

/**
 * Removes authentication session cookies (`refresh_token` and `user_role`)
 * from the Next.js cookie store.
 *
 * @param cookieStore - Resolved Next.js request cookie store.
 */
function clearSessionCookies(cookieStore: CookieStore): void {
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_role");
}

/**
 * Handles user logout requests (`POST /api/auth/logout`) in the Next.js BFF layer.
 *
 * Execution flow:
 * 1. Reads the `refresh_token` cookie if present and attempts upstream token revocation via `logout`.
 * 2. Swallows upstream errors so local session cleanup is guaranteed even if the backend is unreachable
 *    or the token is already invalid/expired.
 * 3. Deletes `refresh_token` and `user_role` cookies and returns a `200 OK` confirmation payload.
 *
 * @returns A promise resolving to a Web Fetch `Response` confirming the logout operation.
 */
export async function POST(): Promise<Response> {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
        try {
            await logout(refreshToken);
        } catch {
            // Ignored intentionally so local session cleanup always completes.
        }
    }

    clearSessionCookies(cookieStore);

    return Response.json({ success: true, message: "Logged out" });
}