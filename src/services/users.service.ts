import { bff } from "@/lib/bff";
import type { ApiResponse } from "@/types";
import type { AdminUser, PageResponse, UsersParams } from "@/types/pending";

export async function getAllUsers(params: UsersParams = {}): Promise<ApiResponse<PageResponse<AdminUser>>> {
    const { data } = await bff.get<ApiResponse<PageResponse<AdminUser>>>("/admin/users", { params });
    return data;
}

export async function banUser(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.patch<ApiResponse<never>>(`/admin/users/${id}/ban`);
    return data;
}

export async function unbanUser(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.patch<ApiResponse<never>>(`/admin/users/${id}/unban`);
    return data;
}
