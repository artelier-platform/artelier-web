// src/server/categories/categories.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse, Category, CategoryRequest } from "@/types";

export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await api.get<ApiResponse<Category[]>>("/categories");
    return data;
}

// ------------------ { admin } ------------------

export async function createCategory(body: CategoryRequest, auth?: string): Promise<ApiResponse<Category>> {
    const { data } = await api.post<ApiResponse<Category>>("/categories", body, bearer(auth));
    return data;
}

export async function updateCategory(id: string, body: CategoryRequest, auth?: string): Promise<ApiResponse<Category>> {
    const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, body, bearer(auth));
    return data;
}

/** 409 si la categoría tiene productos. */
export async function deleteCategory(id: string, auth?: string): Promise<ApiResponse<never>> {
    const { data } = await api.delete<ApiResponse<never>>(`/categories/${id}`, bearer(auth));
    return data;
}
