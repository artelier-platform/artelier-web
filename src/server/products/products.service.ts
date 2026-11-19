// src/server/products/products.service.ts
import { api } from "@/lib/api";
import { buildMultipart } from "@/lib/http-helpers";
import { bearer, notAvailable } from "@/server/http";
import type { ApiResponse, ProductRequest } from "@/types";
import type { PageResponse, ProductWithRating, ProductsParams } from "@/types/pending";

/** Type alias representing a paginated response wrapper containing product ratings. */
type ProductPage = ApiResponse<PageResponse<ProductWithRating>>;

// ------------------ { Public Methods } ------------------

/**
 * Fetches a paginated and filtered list of active products from the public catalog.
 *
 * @param queries - Query parameters for filtering, sorting, and pagination ({@link ProductsParams}).
 * @param auth - Optional authorization token string.
 * @returns A promise resolving to a paginated product response container.
 */
export async function getAllProducts(queries: ProductsParams, auth?: string): Promise<ProductPage> {
    const { data } = await api.get<ProductPage>("/products", { params: queries, ...bearer(auth) });
    return data;
}

/**
 * Fetches detailed information for a single product matching the specified URL slug.
 *
 * @param slug - The unique string identifier (slug) of the product.
 * @returns A promise resolving to the product details wrapped in an API response.
 */
export async function getProductBySlug(slug: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.get<ApiResponse<ProductWithRating>>(`/products/${slug}`);
    return data;
}

// ------------------ { Admin Methods } ------------------

/**
 * Retrieves a paginated list of all products for administration purposes (including inactive items).
 *
 * @remarks TODO: The backend currently does not expose `GET /admin/products`. Throws a `NotAvailableError`.
 * @param _queries - Query parameters for filtering and pagination.
 * @param _auth - Optional authorization token string.
 * @throws {NotAvailableError} Always throws because the endpoint is not implemented.
 */
export async function getAdminProducts(_queries: ProductsParams, _auth?: string): Promise<ProductPage> {
    return notAvailable("getAdminProducts");
}

/**
 * Creates a new product with associated files using multipart form data submission.
 *
 * @param product - The product payload data conforming to {@link ProductRequest}.
 * @param images - An array of image files to upload.
 * @param auth - Optional authorization token string.
 * @returns A promise resolving to the newly created product entity.
 */
export async function createProduct(
    product: ProductRequest,
    images: File[],
    auth?: string
): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.post<ApiResponse<ProductWithRating>>(
        "/admin/products",
        buildMultipart(product, { images }),
        bearer(auth)
    );
    return data;
}

/**
 * Updates an existing product identified by its unique ID, supporting multipart form data payload.
 *
 * @param id - The unique identifier of the product to update.
 * @param product - The updated product payload data conforming to {@link ProductRequest}.
 * @param images - An array of new or replacement image files to upload.
 * @param auth - Optional authorization token string.
 * @returns A promise resolving to the updated product entity.
 */
export async function updateProduct(
    id: string,
    product: ProductRequest,
    images: File[],
    auth?: string
): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.put<ApiResponse<ProductWithRating>>(
        `/admin/products/${id}`,
        buildMultipart(product, { images }),
        bearer(auth)
    );
    return data;
}

/**
 * Performs a soft delete on a product by ID on the backend (returning a `204 No Content` response without body).
 *
 * @param id - The unique identifier of the product to delete.
 * @param auth - Optional authorization token string.
 * @returns A promise resolving to an empty API response.
 */
export async function deleteProduct(id: string, auth?: string): Promise<ApiResponse<never>> {
    const { data } = await api.delete<ApiResponse<never>>(`/admin/products/${id}`, bearer(auth));
    return data;
}

/**
 * Toggles the active status (`isActive`) of a product.
 *
 * @remarks Non-idempotent: each invocation inverts the current active state.
 * @param id - The unique identifier of the product to toggle.
 * @param auth - Optional authorization token string.
 * @returns A promise resolving to the updated product entity with its new status.
 */
export async function toggleProductById(id: string, auth?: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.patch<ApiResponse<ProductWithRating>>(`/admin/products/${id}/toggle`, null, bearer(auth));
    return data;
}