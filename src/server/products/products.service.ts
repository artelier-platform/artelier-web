// src/server/products/products.service.ts
import { api } from "@/lib/api";
import { buildMultipart } from "@/lib/http-helpers";
import { bearer } from "@/server/http";
import type { ApiResponse, ProductRequest } from "@/types";
import type { PageResponse, ProductWithRating, ProductsParams } from "@/types/pending";

type ProductPage = ApiResponse<PageResponse<ProductWithRating>>;

// ------------------ { públicos } ------------------

export async function getAllProducts(queries: ProductsParams, auth?: string): Promise<ProductPage> {
    const { data } = await api.get<ProductPage>("/products", { params: queries, ...bearer(auth) });
    return data;
}

export async function getProductBySlug(slug: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.get<ApiResponse<ProductWithRating>>(`/products/${slug}`);
    return data;
}

// ------------------ { admin } ------------------

/** Incluye productos inactivos. */
export async function getAdminProducts(queries: ProductsParams, auth?: string): Promise<ProductPage> {
    const { data } = await api.get<ProductPage>("/admin/products", { params: queries, ...bearer(auth) });
    return data;
}

export async function createProduct(
    product: ProductRequest,
    images: File[],
    auth?: string
): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.post<ApiResponse<ProductWithRating>>(
        "/products",
        buildMultipart(product, { images }),
        bearer(auth)
    );
    return data;
}

export async function updateProduct(
    id: string,
    product: ProductRequest,
    images: File[],
    auth?: string
): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.put<ApiResponse<ProductWithRating>>(
        `/products/${id}`,
        buildMultipart(product, { images }),
        bearer(auth)
    );
    return data;
}

export async function deleteProduct(id: string, auth?: string): Promise<ApiResponse<never>> {
    const { data } = await api.delete<ApiResponse<never>>(`/products/${id}`, bearer(auth));
    return data;
}

export async function toggleProductById(id: string, auth?: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await api.patch<ApiResponse<ProductWithRating>>(`/products/${id}/toggle`, null, bearer(auth));
    return data;
}
