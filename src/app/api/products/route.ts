import { proxy, queryOf } from "@/server/http";
import { getAllProducts } from "@/server/products/products.service";
import type { ProductsParams } from "@/types/pending";

export async function GET(request: Request) {
    return proxy(() => getAllProducts(queryOf(request) as ProductsParams));
}