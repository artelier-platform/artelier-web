import { getAuth, proxy } from "@/server/http";
import { toggleProductById } from "@/server/products/products.service";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => toggleProductById(id, getAuth(request)));
}
