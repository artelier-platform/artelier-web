import { bff } from "@/lib/bff";
import type { ApiResponse, Category, CategoryRequest } from "@/types";

export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await bff.get<ApiResponse<Category[]>>("/categories");
    return data;
}

// ------------------- Admin -------------------

export async function createCategory(body: CategoryRequest): Promise<ApiResponse<Category>> {
    const { data } = await bff.post<ApiResponse<Category>>("/categories", body);
    return data;
}

export async function updateCategory(id: string, body: CategoryRequest): Promise<ApiResponse<Category>> {
    const { data } = await bff.put<ApiResponse<Category>>(`/categories/${id}`, body);
    return data;
}

/** 409 si la categoría tiene productos. */
export async function deleteCategory(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.delete<ApiResponse<never>>(`/categories/${id}`);
    return data;
}
