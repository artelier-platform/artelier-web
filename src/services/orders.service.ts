import { bff } from "@/lib/bff";
import { toList } from "@/lib/http-helpers";
import type { ApiResponse, OrderStatus } from "@/types";
import type { OrderRequestWithPhone, OrderWithCustomer, OrdersParams, PageResponse } from "@/types/pending";

export async function createOrder(body: OrderRequestWithPhone): Promise<ApiResponse<OrderWithCustomer>> {
    const { data } = await bff.post<ApiResponse<OrderWithCustomer>>("/orders", body);
    return data;
}

/** Historial del usuario autenticado, más recientes primero. Acepta lista simple o página. */
export async function getMyOrders(): Promise<OrderWithCustomer[]> {
    const { data } = await bff.get<ApiResponse<OrderWithCustomer[] | PageResponse<OrderWithCustomer>>>("/orders/my");
    return toList(data.data);
}

export async function getOrderById(id: string): Promise<ApiResponse<OrderWithCustomer>> {
    const { data } = await bff.get<ApiResponse<OrderWithCustomer>>(`/orders/${id}`);
    return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<ApiResponse<OrderWithCustomer>> {
    const { data } = await bff.patch<ApiResponse<OrderWithCustomer>>(`/orders/${id}`, null, { params: { status } });
    return data;
}

// ------------------- Admin -------------------

export async function getAllOrders(
    params: OrdersParams = {} as OrdersParams
): Promise<ApiResponse<PageResponse<OrderWithCustomer>>> {
    const { data } = await bff.get<ApiResponse<PageResponse<OrderWithCustomer>>>("/orders", { params });
    return data;
}
