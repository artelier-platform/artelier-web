import { getAuth, proxy, queryOf } from "@/server/http";
import { getAdminProducts } from "@/server/products/products.service";
import type { ProductsParams } from "@/types/pending";

export async function GET(request: Request) {
    return proxy(() => getAdminProducts(queryOf(request) as ProductsParams, getAuth(request)));
}
