import { create } from "zustand";
import { UserRole } from "@/types"

/**
 * Zustand store state and actions managing in-memory authentication credentials,
 * session expiration metadata, and initial hydration status.
 */
export type AuthState = {
    /** Active user role for the current session, or `null` when unauthenticated. */
    role: UserRole | null;
    /** Short-lived bearer access token held in memory, or `null` when absent. */
    accessToken: string | null;
    /** Epoch timestamp (in milliseconds) when `accessToken` expires, or `null` when unset. */
    expiresAt: number | null;
    /** Whether a valid authenticated session is currently active. */
    isAuthenticated: boolean;
    /** `true` once the initial session hydration attempt has finished (whether it succeeded or not). */
    isInitialized: boolean;

    /**
     * Initializes an authenticated session with access credentials, role, and token TTL.
     *
     * @param token - Bearer access token string.
     * @param role - Assigned {@link UserRole} for the authenticated user.
     * @param expiresIn - Access token lifetime in seconds.
     */
    setAuth: (
        token: string,
        role: UserRole,
        expiresIn: number
    ) => void;

    /**
     * Refreshes only the access token and its expiration timestamp while preserving
     * the existing user role and authentication state.
     *
     * @param token - New bearer access token string.
     * @param expiresIn - New access token lifetime in seconds.
     */
    updateAccessToken: (
        token: string,
        expiresIn: number
    ) => void;

    /**
     * Marks the initial session hydration check as complete.
     */
    setInitialized: () => void;

    /**
     * Clears active authentication credentials and resets `isAuthenticated` to `false`,
     * while intentionally leaving `isInitialized` as-is.
     */
    clearAuth: () => void;
};

/**
 * Computes the expiration epoch timestamp in milliseconds from a lifetime in seconds.
 *
 * @param expiresIn - Token lifetime in seconds.
 * @returns Expiration timestamp in milliseconds.
 */
function computeExpiresAt(expiresIn: number): number {
    return Date.now() + expiresIn * 1000;
}

/**
 * Global Zustand store holding authentication state (`AuthState`).
 */
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
            expiresAt: computeExpiresAt(expiresIn),
            isAuthenticated: true,
        }),

    updateAccessToken: (token, expiresIn) =>
        set({
            accessToken: token,
            expiresAt: computeExpiresAt(expiresIn),
        }),

    setInitialized: () => set({ isInitialized: true }),

    clearAuth: () =>
        set({
            role: null,
            accessToken: null,
            expiresAt: null,
            isAuthenticated: false,
        }),
}));