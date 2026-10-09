// src/store/auth.ts
import { create } from "zustand";

export type AuthState = {
    role: "ADMIN" | "BUYER" | null;
    accessToken: string | null;
    expiresAt: number | null;
    isAuthenticated: boolean;
    /** true cuando ya terminó el intento de hidratar la sesión (con o sin éxito). */
    isInitialized: boolean;

    setAuth: (
        token: string,
        role: "ADMIN" | "BUYER",
        expiresIn: number
    ) => void;

    updateAccessToken: (
        token: string,
        expiresIn: number
    ) => void;

    setInitialized: () => void;

    clearAuth: () => void;
}

export const AuthStateStore = create<AuthState>((set) => ({
    role: null,
    accessToken: null,
    expiresAt: null,
    isAuthenticated: false,
    isInitialized: false,

    setAuth: (token, role, expiresIn) =>
        set({
            role,
            accessToken: token,
            expiresAt: Date.now() + expiresIn * 1000,
            isAuthenticated: true
        }),

    updateAccessToken: (token, expiresIn) =>
        set({
            accessToken: token,
            expiresAt: Date.now() + expiresIn * 1000
        }),

    setInitialized: () => set({ isInitialized: true }),

    clearAuth: () =>
        set({
            role: null,
            accessToken: null,
            expiresAt: null,
            isAuthenticated: false
        })
}));
