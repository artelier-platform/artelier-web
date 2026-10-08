import { createCustomOrder, getAllCustomOrders } from "@/server/custom-orders/custom-orders.service";
import { getAuth, proxy, queryOf, readFiles } from "@/server/http";
import type { CustomOrdersParams } from "@/types/pending";

/** Admin: lista paginada. */
export async function GET(request: Request) {
    return proxy(() => getAllCustomOrders(queryOf(request) as CustomOrdersParams, getAuth(request)));
}

/** Cliente con sesión: crea un pedido personalizado (multipart). */
export async function POST(request: Request) {
    return proxy(async () => {
        const form = await request.formData();
        return createCustomOrder(
            {
                customerName: String(form.get("customerName") ?? ""),
                description: String(form.get("description") ?? ""),
                images: readFiles(form, "referenceImages"),
            },
            getAuth(request)
        );
    }, 201);
}
