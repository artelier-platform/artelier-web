// src/store/auth.ts
import { create } from "zustand";

export type AuthState = {
    role: "ADMIN" | "BUYER" | null;
    accessToken: string | null;
    expiresAt: number | null;
    isAuthenticated: boolean;

    setAuth: (
        token: string,
        role: "ADMIN" | "BUYER",
        expiresIn: number
    ) => void;

    updateAccessToken: (
        token: string,
        expiresIn: number
    ) => void;

    clearAuth: () => void;
}

export const AuthStateStore = create<AuthState>((set) => ({
    role: null,
    accessToken: null,
    expiresAt: null,
    isAuthenticated: false,

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

    clearAuth: () =>
        set({
            role: null,
            accessToken: null,
            expiresAt: null,
            isAuthenticated: false
        })
}));