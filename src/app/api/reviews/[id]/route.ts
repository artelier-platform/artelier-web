import { getAuth, proxy } from "@/server/http";
import { deleteReview } from "@/server/reviews/reviews.service";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => deleteReview(id, getAuth(request)));
}
