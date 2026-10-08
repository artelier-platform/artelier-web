import { getAuth, proxy, queryOf, readFiles, readJsonPart } from "@/server/http";
import { createProduct, getAllProducts } from "@/server/products/products.service";
import type { ProductRequest } from "@/types";
import type { ProductsParams } from "@/types/pending";

export async function GET(request: Request) {
    return proxy(() => getAllProducts(queryOf(request) as ProductsParams));
}

export async function POST(request: Request) {
    return proxy(async () => {
        const form = await request.formData();
        const product = await readJsonPart<ProductRequest>(form, "data");
        return createProduct(product, readFiles(form, "images"), getAuth(request));
    }, 201);
}
