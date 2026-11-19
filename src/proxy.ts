import { NextRequest, NextResponse } from "next/server";

/** Cookie keys read by the route guard to inspect session and role state. */
const COOKIE_NAMES = {
    refreshToken: "refresh_token",
    userRole: "user_role",
} as const;

/** Application route paths and protected path prefixes evaluated by the guard. */
const ROUTES = {
    home: "/",
    login: "/login",
    adminPrefix: "/admin",
    accountPrefix: "/account",
} as const;

/**
 * Evaluates incoming requests for protected route access (`/account` and `/admin`)
 * based on session and role cookies.
 *
 * - Redirects unauthenticated requests to `/login`.
 * - Redirects non-`ADMIN` users attempting to access `/admin` routes to `/`.
 *
 * @param request - Incoming Next.js request object.
 * @returns A `NextResponse` redirect or continuation response.
 */
export function proxy(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;

    const refreshToken = request.cookies.get(COOKIE_NAMES.refreshToken)?.value;
    const userRole = request.cookies.get(COOKIE_NAMES.userRole)?.value;

    const isAuthenticated = Boolean(refreshToken);
    const isAdminRoute = pathname.startsWith(ROUTES.adminPrefix);
    const isAccountRoute = pathname.startsWith(ROUTES.accountPrefix);

    if ((isAccountRoute || isAdminRoute) && !isAuthenticated) {
        return NextResponse.redirect(new URL(ROUTES.login, request.url));
    }

    if (isAdminRoute && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL(ROUTES.home, request.url));
    }

    return NextResponse.next();
}

/** Next.js route matcher configuration restricting execution to `/account` and `/admin` paths. */
export const config = {
    matcher: ["/account/:path*", "/admin/:path*"],
};