import { bff } from "@/lib/bff";
import { buildMultipart } from "@/lib/http-helpers";
import type { ApiResponse, ProductRequest } from "@/types";
import type { PageResponse, ProductWithRating, ProductsParams } from "@/types/pending";

type ProductPage = ApiResponse<PageResponse<ProductWithRating>>;

export async function getAllProducts(params: ProductsParams = {} as ProductsParams): Promise<ProductPage> {
    const { data } = await bff.get<ProductPage>("/products", { params });
    return data;
}

export async function getProductBySlug(slug: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.get<ApiResponse<ProductWithRating>>(`/products/slug/${slug}`);
    return data;
}

// ------------------- Admin -------------------

/** Incluye productos inactivos. */
export async function getAdminProducts(params: ProductsParams = {} as ProductsParams): Promise<ProductPage> {
    const { data } = await bff.get<ProductPage>("/admin/products", { params });
    return data;
}

export async function createProduct(product: ProductRequest, images: File[]): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.post<ApiResponse<ProductWithRating>>("/products", buildMultipart(product, { images }));
    return data;
}

export async function updateProduct(
    id: string,
    product: ProductRequest,
    images: File[]
): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.put<ApiResponse<ProductWithRating>>(
        `/products/${id}`,
        buildMultipart(product, { images })
    );
    return data;
}

export async function deleteProduct(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.delete<ApiResponse<never>>(`/products/${id}`);
    return data;
}

export async function toggleProduct(id: string): Promise<ApiResponse<ProductWithRating>> {
    const { data } = await bff.patch<ApiResponse<ProductWithRating>>(`/products/${id}/toggle`);
    return data;
}
