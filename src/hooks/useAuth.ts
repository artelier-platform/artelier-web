import { AuthData, LoginRequest, RegisterRequest, ApiResponse } from "@/types";
import { AuthStateStore } from "@/store/auth";
import { refreshSession } from "@/lib/auth-refresh";

/**
 * Sends a JSON POST request to the specified endpoint and parses the JSON response.
 *
 * @template TResponse - Expected parsed response payload type.
 * @template TBody - Request payload type serialized as JSON.
 * @param url - Target API endpoint URL.
 * @param body - Optional request payload to serialize.
 * @returns A promise resolving to the parsed response payload.
 */
async function postJson<TResponse, TBody = undefined>(
    url: string,
    body?: TBody
): Promise<TResponse> {
    const response = await fetch(url, {
        method: "POST",
        ...(body !== undefined
            ? {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
            : {}),
    });

    return response.json() as Promise<TResponse>;
}

/**
 * Persists session credentials in AuthStateStore when a BFF auth response
 * succeeds and includes all required token, role, and expiration fields.
 *
 * @param result - API response returned by /api/auth/login or /api/auth/register.
 * @param setAuth - Store action used to persist session state.
 */
function storeSession(
    result: ApiResponse<AuthData>,
    setAuth: (accessToken: string, role: NonNullable<AuthData["user"]>["role"], expiresIn: number) => void
): void {
    const data = result.data;
    if (result.success && data?.accessToken && data.user?.role && data.expiresIn) {
        setAuth(data.accessToken, data.user.role, data.expiresIn);
    }
}

/**
 * Custom React hook providing authentication state selectors and session lifecycle actions
 * (login, register, refresh, logout) backed by AuthStateStore and BFF auth endpoints.
 *
 * @returns An object containing reactive session state and authentication action handlers.
 */
export function useAuth() {
    /** Current user role from the auth store, if authenticated. */
    const role = AuthStateStore((s) => s.role);
    /** Whether the user currently has an active authenticated session. */
    const isAuthenticated = AuthStateStore((s) => s.isAuthenticated);
    /** Whether initial session hydration/initialization has completed. */
    const isInitialized = AuthStateStore((s) => s.isInitialized);
    /** Session expiration timestamp (in epoch milliseconds or store-defined units). */
    const expiresAt = AuthStateStore((s) => s.expiresAt);
    /** Store action to persist access token, role, and expiration metadata. */
    const setAuth = AuthStateStore((s) => s.setAuth);
    /** Store action to reset authentication state upon logout. */
    const clearAuth = AuthStateStore((s) => s.clearAuth);

    /**
     * Authenticates a user via the BFF login endpoint and stores the resulting session state.
     *
     * @param request - User sign-in credentials conforming to LoginRequest.
     * @returns A promise resolving to the API response containing AuthData on success.
     */
    async function login(request: LoginRequest): Promise<ApiResponse<AuthData>> {
        const result = await postJson<ApiResponse<AuthData>, LoginRequest>("/api/auth/login", request);
        storeSession(result, setAuth);
        return result;
    }

    /**
     * Registers a new user account via the BFF register endpoint and stores the resulting session state.
     *
     * @param request - New account payload conforming to RegisterRequest.
     * @returns A promise resolving to the API response containing AuthData on success.
     */
    async function register(request: RegisterRequest): Promise<ApiResponse<AuthData>> {
        const result = await postJson<ApiResponse<AuthData>, RegisterRequest>("/api/auth/register", request);
        storeSession(result, setAuth);
        return result;
    }

    /**
     * Attempts to refresh the current session using the shared refreshSession helper.
     * Coalesces concurrent refresh requests across the application.
     *
     * @returns A promise resolving to true if the session was refreshed, or false otherwise.
     */
    async function refresh(): Promise<boolean> {
        return (await refreshSession()) !== null;
    }

    /**
     * Terminates the current user session via the BFF logout endpoint and clears local auth state.
     *
     * @returns A promise resolving to the API response from /api/auth/logout.
     */
    async function logout(): Promise<ApiResponse<never>> {
        try {
            return await postJson<ApiResponse<never>>("/api/auth/logout");
        } finally {
            clearAuth();
        }
    }

    return {
        role,
        isAuthenticated,
        isInitialized,
        expiresAt,
        login,
        register,
        logout,
        refresh,
    };
}