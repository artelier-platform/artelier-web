// src/app/api/auth/login/route.ts
import { login } from "@/server/auth/auth.service";
import { cookies } from "next/headers";
import type { LoginRequest } from "@/types";
import { responseFromError } from "@/server/http";

/** Constant representing 30 days in seconds for cookie persistence. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Handles user authentication requests (`POST /api/auth/login`) within the Next.js BFF layer.
 *
 * Refactored to extract environment and timing constants, add strict type definitions,
 * and include defensive checks for optional token and role properties prior to cookie assignment.
 *
 * Execution flow:
 * 1. Parses the incoming JSON payload into a `LoginRequest` object.
 * 2. Invokes the upstream `login` service.
 * 3. On successful authentication (`200 OK`):
 *    - Conditionally sets the `refresh_token` HTTP-only secure cookie if present.
 *    - Conditionally sets the `user_role` cookie for client-side routing if present.
 *    - Sanitizes the response payload by stripping out the sensitive `refreshToken` property.
 * 4. On logical failure: Returns the upstream response with a `401 Unauthorized` status.
 * 5. On exceptions/network errors: Delegates error handling to `responseFromError`.
 *
 * @param request - The incoming Web Fetch API `Request` containing user credentials.
 * @returns A promise resolving to a Web Fetch `Response` containing sanitized session data or an error payload.
 */
export async function POST(request: Request): Promise<Response> {
    try {
        const body: LoginRequest = await request.json();
        const response = await login(body);

        if (response.success && response.data) {
            const cookieStore = await cookies();
            const isProduction = process.env.NODE_ENV === "production";

            if (response.data.refreshToken) {
                cookieStore.set("refresh_token", response.data.refreshToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: "lax",
                    path: "/",
                    maxAge: COOKIE_MAX_AGE,
                });
            }

            if (response.data.role) {
                cookieStore.set("user_role", response.data.role, {
                    httpOnly: false,
                    secure: isProduction,
                    sameSite: "lax",
                    path: "/",
                    maxAge: COOKIE_MAX_AGE,
                });
            }

            const { refreshToken: _, ...safeData } = response.data;

            return Response.json(
                {
                    ...response,
                    data: safeData,
                },
                { status: 200 }
            );
        }

        return Response.json(response, { status: 401 });
    } catch (error: unknown) {
        return responseFromError(error);
    }
}