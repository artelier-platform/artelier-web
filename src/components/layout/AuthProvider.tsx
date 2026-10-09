// src/components/layout/AuthProvider.tsx
"use client";

import React, { useEffect } from "react";
import { AuthStateStore } from "@/store/auth";
import { hasSessionCookie, refreshSession } from "@/lib/auth-refresh";

import "@/lib/interceptors";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        async function hydrate() {
            // Sin cookie de sesión no hay nada que refrescar (visitante anónimo).
            if (hasSessionCookie()) {
                await refreshSession();
            }
            AuthStateStore.getState().setInitialized();
        }

        // En dev React ejecuta este efecto dos veces; refreshSession comparte la petición.
        void hydrate();
    }, []);

    return <>{children}</>;
}
