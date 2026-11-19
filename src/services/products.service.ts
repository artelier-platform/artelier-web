import { bff } from "@/lib/bff";
import { buildMultipart } from "@/lib/http-helpers";
import type { ApiResponse, ProductRequest } from "@/types";
import type { PageResponse, ProductWithRating, ProductsParams } from "@/types/pending";

/** Paginated API envelope containing products enriched with rating metadata. */
type ProductPage = ApiResponse<PageResponse<ProductWithRating>>;

/**
 * Fetches a paginated list of active products from the BFF catalog endpoint.
 *
 * @param params - Optional query parameters for pagination, sorting, and search filtering.
 * @returns A promise resolving to a paginated response of {@link ProductWithRating} items.
 */
export async function getAllProducts(params: ProductsParams = {} as ProductsParams): Promise<ProductPage> {
    const { data } = await bff.get<ProductPage>("/products", { params });
    return data;
}

/**
 * Fetches detailed information for a single product by its URL slug via the BFF.
 *
 * @param slug - Unique slug identifier of the product.
 * @returns A promise resolving to the API response containing the matching {@link ProductWithRating}.
 */
export async function getProductBySlug(slug: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.get<ApiResponse<ProductWithRating>>(`/products/slug/${slug}`);
    return data;
}

// ------------------- Admin -------------------

/**
 * Fetches a paginated list of products for administration, including inactive items.
 *
 * @param params - Optional query parameters including pagination, search, and `isActive` filter.
 * @returns A promise resolving to a paginated response of {@link ProductWithRating} items.
 */
export async function getAdminProducts(params: ProductsParams = {} as ProductsParams): Promise<ProductPage> {
    const { data } = await bff.get<ProductPage>("/admin/products", { params });
    return data;
}

/**
 * Creates a new product with image attachments via multipart form data through the BFF.
 *
 * @param product - Product creation payload conforming to {@link ProductRequest}.
 * @param images - Image files to include in the multipart request.
 * @returns A promise resolving to the API response containing the created {@link ProductWithRating}.
 */
export async function createProduct(product: ProductRequest, images: File[]): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.post<ApiResponse<ProductWithRating>>(
        "/admin/products",
        buildMultipart(product, { images })
    );
    return data;
}

/**
 * Updates an existing product and its image attachments via multipart form data through the BFF.
 *
 * @param id - Unique identifier of the product to update.
 * @param product - Updated product payload conforming to {@link ProductRequest}.
 * @param images - Image files to include in the multipart request.
 * @returns A promise resolving to the API response containing the updated {@link ProductWithRating}.
 */
export async function updateProduct(
    id: string,
    product: ProductRequest,
    images: File[]
): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.put<ApiResponse<ProductWithRating>>(
        `/admin/products/${id}`,
        buildMultipart(product, { images })
    );
    return data;
}

/**
 * Deletes a product by its unique identifier through the BFF admin endpoint.
 *
 * @param id - Unique identifier of the product to delete.
 * @returns A promise resolving to the API response confirming deletion.
 */
export async function deleteProduct(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.delete<ApiResponse<never>>(`/admin/products/${id}`);
    return data;
}

/**
 * Toggles the active/inactive state of a product by ID through the BFF admin endpoint.
 *
 * @param id - Unique identifier of the product to toggle.
 * @returns A promise resolving to the API response containing the updated {@link ProductWithRating}.
 */
export async function toggleProduct(id: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.patch<ApiResponse<ProductWithRating>>(`/admin/products/${id}/toggle`);
    return data;
}