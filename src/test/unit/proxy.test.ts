import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { config, proxy } from "@/proxy";

const BASE_URL = "http://localhost:3000";

type Cookies = Partial<Record<"refresh_token" | "user_role", string>>;

/** Builds a NextRequest for `path` carrying the given cookies. */
function buildRequest(path: string, cookies: Cookies = {}): NextRequest {
    const cookieHeader = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ");

    return new NextRequest(`${BASE_URL}${path}`, {
        headers: cookieHeader ? { cookie: cookieHeader } : {},
    });
}

/** True when the response is a redirect to `path`. */
function expectRedirectTo(response: Response, path: string): void {
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${BASE_URL}${path}`);
}

/** True when the proxy let the request continue untouched. */
function expectPassThrough(response: Response): void {
    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("location")).toBeNull();
}

describe("proxy: matcher", () => {
    it("only runs on /account and /admin paths", () => {
        expect(config.matcher).toEqual(["/account/:path*", "/admin/:path*"]);
    });
});

describe("proxy: anonymous user (no refresh_token)", () => {
    it("redirects /account to /login", () => {
        expectRedirectTo(proxy(buildRequest("/account")), "/login");
    });

    it("redirects /admin to /login (auth check runs before role check)", () => {
        expectRedirectTo(proxy(buildRequest("/admin")), "/login");
    });

    it("redirects nested protected paths to /login", () => {
        expectRedirectTo(proxy(buildRequest("/admin/products")), "/login");
        expectRedirectTo(proxy(buildRequest("/account/orders")), "/login");
    });

    it("redirects to /login even if a user_role cookie is present without a token", () => {
        const response = proxy(buildRequest("/admin", { user_role: "ADMIN" }));
        expectRedirectTo(response, "/login");
    });
});

describe("proxy: authenticated BUYER", () => {
    const buyer: Cookies = { refresh_token: "token", user_role: "BUYER" };

    it("allows /account", () => {
        expectPassThrough(proxy(buildRequest("/account", buyer)));
    });

    it("redirects /admin to /", () => {
        expectRedirectTo(proxy(buildRequest("/admin", buyer)), "/");
    });

    it("redirects nested /admin paths to /", () => {
        expectRedirectTo(proxy(buildRequest("/admin/products", buyer)), "/");
    });

    it("treats a missing user_role as non-admin", () => {
        const response = proxy(buildRequest("/admin", { refresh_token: "token" }));
        expectRedirectTo(response, "/");
    });
});

describe("proxy: authenticated ADMIN", () => {
    const admin: Cookies = { refresh_token: "token", user_role: "ADMIN" };

    it("allows /admin", () => {
        expectPassThrough(proxy(buildRequest("/admin", admin)));
    });

    it("allows /admin/products", () => {
        expectPassThrough(proxy(buildRequest("/admin/products", admin)));
    });

    it("allows /account", () => {
        expectPassThrough(proxy(buildRequest("/account", admin)));
    });
});