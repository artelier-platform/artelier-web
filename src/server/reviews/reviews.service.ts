// src/server/reviews/reviews.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse } from "@/types";
import type { PageResponse, Review, ReviewRequest } from "@/types/pending";

export async function getProductReviews(
    productId: string,
    queries: { page?: number; size?: number }
): Promise<ApiResponse<PageResponse<Review>>> {
    const { data } = await api.get<ApiResponse<PageResponse<Review>>>(`/products/${productId}/reviews`, {
        params: queries,
    });
    return data;
}

export async function createReview(productId: string, body: ReviewRequest, auth?: string): Promise<ApiResponse<Review>> {
    const { data } = await api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, body, bearer(auth));
    return data;
}

export async function deleteReview(id: string, auth?: string): Promise<ApiResponse<never>> {
    const { data } = await api.delete<ApiResponse<never>>(`/reviews/${id}`, bearer(auth));
    return data;
}
