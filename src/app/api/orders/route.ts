import { createOrder, getAllOrders } from "@/server/orders/orders.service";
import { getAuth, proxy, queryOf } from "@/server/http";
import type { OrderRequestWithPhone, OrdersParams } from "@/types/pending";

/** Admin: lista paginada con filtros. */
export async function GET(request: Request) {
    return proxy(() => getAllOrders(queryOf(request) as OrdersParams, getAuth(request)));
}

export async function POST(request: Request) {
    const body: OrderRequestWithPhone = await request.json();
    return proxy(() => createOrder(body, getAuth(request)), 201);
}
