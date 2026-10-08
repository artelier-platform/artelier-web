import { getAuth, proxy, readFiles, readJsonPart } from "@/server/http";
import { deleteProduct, updateProduct } from "@/server/products/products.service";
import type { ProductRequest } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(async () => {
        const form = await request.formData();
        const product = await readJsonPart<ProductRequest>(form, "data");
        return updateProduct(id, product, readFiles(form, "images"), getAuth(request));
    });
}

export async function DELETE(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => deleteProduct(id, getAuth(request)));
}
