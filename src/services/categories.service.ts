import { bff } from "@/lib/bff";
import type { ApiResponse, Category, CategoryRequest } from "@/types";

/**
 * Fetches all product categories from the public BFF catalog endpoint.
 *
 * @returns A promise resolving to the API response containing the list of {@link Category} items.
 */
export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await bff.get<ApiResponse<Category[]>>("/categories");
    return data;
}

// ------------------- Admin -------------------

/**
 * Creates a new product category via the BFF admin endpoint.
 *
 * @param body - Category creation payload conforming to {@link CategoryRequest}.
 * @returns A promise resolving to the API response containing the created {@link Category}.
 */
export async function createCategory(body: CategoryRequest): Promise<ApiResponse<Category>> {
    const { data } = await bff.post<ApiResponse<Category>>("/admin/categories", body);
    return data;
}

/**
 * Updates an existing product category by ID via the BFF admin endpoint.
 *
 * @param id - Unique identifier of the category to update.
 * @param body - Updated category payload conforming to {@link CategoryRequest}.
 * @returns A promise resolving to the API response containing the updated {@link Category}.
 */
export async function updateCategory(id: string, body: CategoryRequest): Promise<ApiResponse<Category>> {
    const { data } = await bff.put<ApiResponse<Category>>(`/admin/categories/${id}`, body);
    return data;
}

/**
 * Deletes a product category by ID via the BFF admin endpoint.
 *
 * @param id - Unique identifier of the category to delete.
 * @returns A promise resolving to the API response confirming deletion.
 * @throws {AxiosError} Rejects with a `409 Conflict` error if products are still associated with the category.
 */
export async function deleteCategory(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.delete<ApiResponse<never>>(`/admin/categories/${id}`);
    return data;
}