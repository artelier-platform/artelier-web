import { getAuth, proxy, queryOf } from "@/server/http";
import { createReview, getProductReviews } from "@/server/reviews/reviews.service";
import type { ReviewRequest } from "@/types/pending";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => getProductReviews(id, queryOf(request)));
}

export async function POST(request: Request, { params }: Params) {
    const { id } = await params;
    const body: ReviewRequest = await request.json();
    return proxy(() => createReview(id, body, getAuth(request)), 201);
}
