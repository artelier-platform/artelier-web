import { getAuth, proxy, queryOf, readFiles, readJsonPart } from "@/server/http";
import { createProduct, getAdminProducts } from "@/server/products/products.service";
import type { ProductRequest } from "@/types";
import type { ProductsParams } from "@/types/pending";

export async function GET(request: Request) {
    return proxy(() => getAdminProducts(queryOf(request) as ProductsParams, getAuth(request)));
}

export async function POST(request: Request) {
    return proxy(async () => {
        const form = await request.formData();
        const product = await readJsonPart<ProductRequest>(form, "data");
        return createProduct(product, readFiles(form, "images"), getAuth(request));
    }, 201);
}