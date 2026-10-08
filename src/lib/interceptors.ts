// src/lib/interceptors.ts
import { bff } from "@/lib/bff";
import { AuthStateStore } from "@/store/auth";
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse, AuthData } from "@/types";

// ------------------- { types } -------------------

export interface ValidationFieldError {
    field: string;
    message: string;
}

export interface HttpError {
    status: number;
    message: string;
    fields?: Record<string, string>;
}

type ErrorResponse = ApiResponse<ValidationFieldError[]>;
type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

// ------------------- { request interceptor } -------------------

bff.interceptors.request.use(
    (config) => {
        const { accessToken } = AuthStateStore.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ------------------- { response interceptor } -------------------

bff.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error: AxiosError<ErrorResponse>) => {
        const status = error.response?.status ?? 0;
        const originalRequest = error.config as RetryableRequest;

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const result = await fetch("/api/auth/refresh", {
                    method: "POST",
                });

                const data: ApiResponse<AuthData> = await result.json();

                if (data.success && data.data?.token && data.data?.expiresIn) {
                    AuthStateStore.getState().updateAccessToken(
                        data.data.token,
                        data.data.expiresIn
                    );

                    originalRequest.headers.Authorization = `Bearer ${data.data.token}`;

                    return bff(originalRequest);
                }
            } catch {}

            await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
            AuthStateStore.getState().clearAuth();
            window.location.href = "/login";

            return Promise.reject(error);
        }

        const response = error.response?.data;

        const fields =
            Array.isArray(response?.data)
                ? Object.fromEntries(
                    response.data.map((v) => [v.field, v.message])
                )
                : undefined;

        const normalizedError: HttpError = {
            status,
            message: response?.message ?? getDefaultMessage(status),
            fields,
        };

        if (process.env.NODE_ENV === "development") {
            logError(normalizedError);
        }

        return Promise.reject(normalizedError);
    }
);

// ------------------- { helpers } -------------------

function getDefaultMessage(status: number): string {
    switch (status) {
        case 400: return "Bad request";
        case 403: return "Access denied";
        case 404: return "Resource not found";
        case 409: return "Conflict";
        case 500: return "Server error";
        default:  return "Unexpected error";
    }
}

function logError(error: HttpError) {
    switch (error.status) {
        case 403: console.warn("[auth] Forbidden — no role access");    break;
        case 404: console.warn("[api] Resource not found");             break;
        case 409: console.warn("[api] Conflict — business rule");       break;
        case 500: console.error("[api] Server crash");                  break;
    }
}
