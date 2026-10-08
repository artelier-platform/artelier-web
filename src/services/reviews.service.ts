import { bff } from "@/lib/bff";
import type { ApiResponse } from "@/types";
import type { PageResponse, Review, ReviewRequest } from "@/types/pending";

export async function getProductReviews(
    productId: string,
    params: { page?: number; size?: number } = {}
): Promise<ApiResponse<PageResponse<Review>>> {
    const { data } = await bff.get<ApiResponse<PageResponse<Review>>>(`/products/${productId}/reviews`, { params });
    return data;
}

/** Solo compradores con un pedido pagado que incluya el producto. 409 si ya reseñó. */
export async function createReview(productId: string, body: ReviewRequest): Promise<ApiResponse<Review>> {
    const { data } = await bff.post<ApiResponse<Review>>(`/products/${productId}/reviews`, body);
    return data;
}

/** Moderación (admin). */
export async function deleteReview(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.delete<ApiResponse<never>>(`/reviews/${id}`);
    return data;
}
