import { getAuth, proxy } from "@/server/http";
import { getOrderById, updateOrderStatus } from "@/server/orders/orders.service";
import type { OrderStatus } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => getOrderById(id, getAuth(request)));
}

/** PATCH /api/orders/{id}?status=PAID */
export async function PATCH(request: Request, { params }: Params) {
    const { id } = await params;
    const status = new URL(request.url).searchParams.get("status") as OrderStatus;
    return proxy(() => updateOrderStatus(id, status, getAuth(request)));
}
