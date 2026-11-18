// src/app/api/auth/register/route.ts
import { register } from "@/server/auth/auth.service";
import { cookies } from "next/headers";
import type { RegisterRequest } from "@/types";
import { responseFromError } from "@/server/http";

/** Constant representing 30 days in seconds for cookie persistence. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Handles user registration requests (`POST /api/auth/register`) within the Next.js BFF layer.
 *
 * Includes constants extraction, strict type safety, defensive optional checks for tokens/roles,
 * and proper handling of successful resource creation status codes (`201 Created`).
 *
 * Execution flow:
 * 1. Parses the incoming JSON payload into a `RegisterRequest` object.
 * 2. Invokes the upstream `register` service.
 * 3. On successful registration (`201 Created` via success flag and data):
 *    - Conditionally sets the `refresh_token` HTTP-only secure cookie if present.
 *    - Conditionally sets the `user_role` cookie for client-side routing if present.
 *    - Sanitizes the response payload by stripping out the sensitive `refreshToken` property.
 * 4. On logical failure: Returns the upstream response with a status based on success (`201` or `400`).
 * 5. On exceptions/network errors: Delegates error handling to `responseFromError`.
 *
 * @param request - The incoming Web Fetch API `Request` containing registration details.
 * @returns A promise resolving to a Web Fetch `Response` containing sanitized session data or an error payload.
 */
export async function POST(request: Request): Promise<Response> {
    try {
        const body: RegisterRequest = await request.json();
        const response = await register(body);

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
                { status: 201 }
            );
        }

        return Response.json(response, {
            status: response.success ? 201 : 400,
        });
    } catch (error: unknown) {
        return responseFromError(error);
    }
}