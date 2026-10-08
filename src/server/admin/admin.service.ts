// src/server/admin/admin.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse } from "@/types";
import type { AdminUser, PageResponse, UsersParams } from "@/types/pending";

export async function getAllUsers(queries: UsersParams, auth?: string): Promise<ApiResponse<PageResponse<AdminUser>>> {
    const { data } = await api.get<ApiResponse<PageResponse<AdminUser>>>("/admin/users", {
        params: queries,
        ...bearer(auth),
    });
    return data;
}

export async function banUser(id: string, auth?: string): Promise<ApiResponse<never>> {
    const { data } = await api.patch<ApiResponse<never>>(`/admin/users/${id}/ban`, null, bearer(auth));
    return data;
}

export async function unbanUser(id: string, auth?: string): Promise<ApiResponse<never>> {
    const { data } = await api.patch<ApiResponse<never>>(`/admin/users/${id}/unban`, null, bearer(auth));
    return data;
}
