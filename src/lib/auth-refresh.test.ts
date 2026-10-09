// src/lib/auth-refresh.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refreshSession } from "./auth-refresh";
import { AuthStateStore } from "@/store/auth";

const okBody = {
    success: true,
    data: { token: "new-token", role: "BUYER", expiresIn: 900 },
};

describe("refreshSession", () => {
    beforeEach(() => {
        AuthStateStore.getState().clearAuth();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("comparte una sola petición entre llamadas simultáneas", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ json: async () => okBody });
        vi.stubGlobal("fetch", fetchMock);

        const [a, b] = await Promise.all([refreshSession(), refreshSession()]);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(a).toBe("new-token");
        expect(b).toBe("new-token");
        expect(AuthStateStore.getState().isAuthenticated).toBe(true);
    });

    it("devuelve null y no autentica si el refresh falla", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({ json: async () => ({ success: false }) })
        );

        expect(await refreshSession()).toBeNull();
        expect(AuthStateStore.getState().isAuthenticated).toBe(false);
    });

    it("devuelve null si la red falla", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

        expect(await refreshSession()).toBeNull();
    });

    it("permite un refresh nuevo cuando el anterior terminó", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ json: async () => okBody });
        vi.stubGlobal("fetch", fetchMock);

        await refreshSession();
        await refreshSession();

        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
