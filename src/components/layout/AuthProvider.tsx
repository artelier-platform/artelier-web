// src/components/layout/AuthProvider.tsx
"use client";

import React, { useEffect } from "react";
import { AuthStateStore } from "@/store/auth";
import type { ApiResponse, AuthData } from "@/types";

import "@/lib/interceptors";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        async function hydrate() {
            try {
                const result = await fetch("/api/auth/refresh", { method: "POST" });
                const data: ApiResponse<AuthData> = await result.json();

                if (data.success && data.data?.token && data.data?.role && data.data?.expiresIn) {
                    AuthStateStore.getState().setAuth(
                        data.data.token,
                        data.data.role,
                        data.data.expiresIn
                    );
                } else {
                    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
                }
            } catch {
                await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
            }
        }

        void hydrate();
    }, []);

    return <>{children}</>;
}