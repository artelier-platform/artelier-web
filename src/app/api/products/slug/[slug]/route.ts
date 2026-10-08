import { proxy } from "@/server/http";
import { getProductBySlug } from "@/server/products/products.service";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Params) {
    const { slug } = await params;
    return proxy(() => getProductBySlug(slug));
}
