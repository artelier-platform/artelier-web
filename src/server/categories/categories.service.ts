// src/server/categories/categories.service.ts
import { api } from "@/lib/api";
import { bearer, notAvailable } from "@/server/http";
import type { ApiResponse, Category, CategoryRequest } from "@/types";

/**
 * Fetches a list of all product categories from the public catalog.
 *
 * @returns A promise resolving to an array of category objects wrapped in an API response.
 */
export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await api.get<ApiResponse<Category[]>>("/categories");
    return data;
}

// ------------------ { Admin Methods } ------------------

/**
 * Creates a new product category with administrative privileges.
 *
 * @param body - The category payload data conforming to {@link CategoryRequest}.
 * @param auth - Optional authorization token string.
 * @returns A promise resolving to the newly created category entity.
 * @throws {AxiosError} Throws a 409 Conflict error if the category slug is already in use.
 */
export async function createCategory(body: CategoryRequest, auth?: string): Promise<ApiResponse<Category>> {
    const { data } = await api.post<ApiResponse<Category>>("/admin/categories", body, bearer(auth));
    return data;
}

/**
 * Updates an existing category by its unique identifier.
 *
 * @remarks TODO: The backend currently does not expose `PUT /admin/categories/{id}`. Throws a `NotAvailableError`.
 * @param _id - The unique identifier of the category to update.
 * @param _body - The updated category payload data conforming to {@link CategoryRequest}.
 * @param _auth - Optional authorization token string.
 * @throws {NotAvailableError} Always throws because the endpoint is not implemented.
 */
export async function updateCategory(
    _id: string,
    _body: CategoryRequest,
    _auth?: string
): Promise<ApiResponse<Category>> {
    return notAvailable("updateCategory");
}

/**
 * Deletes an existing category by its unique identifier.
 *
 * @remarks TODO: The backend currently does not expose `DELETE /admin/categories/{id}`. Throws a `NotAvailableError`.
 * @param _id - The unique identifier of the category to delete.
 * @param _auth - Optional authorization token string.
 * @throws {NotAvailableError} Always throws because the endpoint is not implemented.
 */
export async function deleteCategory(_id: string, _auth?: string): Promise<ApiResponse<never>> {
    return notAvailable("deleteCategory");
}