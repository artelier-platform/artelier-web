// src/server/orders/orders.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse, OrderStatus } from "@/types";
import type { OrderRequestWithPhone, OrderWithCustomer, OrdersParams, PageResponse } from "@/types/pending";

export async function createOrder(body: OrderRequestWithPhone, auth?: string): Promise<ApiResponse<OrderWithCustomer>> {
    const { data } = await api.post<ApiResponse<OrderWithCustomer>>("/orders", body, bearer(auth));
    return data;
}

/** Historial del usuario autenticado. Puede venir como lista o como página (se normaliza en el cliente). */
export async function getMyOrders(
    auth?: string
): Promise<ApiResponse<OrderWithCustomer[] | PageResponse<OrderWithCustomer>>> {
    const { data } = await api.get<ApiResponse<OrderWithCustomer[] | PageResponse<OrderWithCustomer>>>(
        "/orders/my",
        bearer(auth)
    );
    return data;
}

/** Admin. */
export async function getAllOrders(
    queries: OrdersParams,
    auth?: string
): Promise<ApiResponse<PageResponse<OrderWithCustomer>>> {
    const { data } = await api.get<ApiResponse<PageResponse<OrderWithCustomer>>>("/orders", {
        params: queries,
        ...bearer(auth),
    });
    return data;
}

export async function getOrderById(id: string, auth?: string): Promise<ApiResponse<OrderWithCustomer>> {
    const { data } = await api.get<ApiResponse<OrderWithCustomer>>(`/orders/${id}`, bearer(auth));
    return data;
}

export async function updateOrderStatus(
    id: string,
    status: OrderStatus,
    auth?: string
): Promise<ApiResponse<OrderWithCustomer>> {
    const { data } = await api.patch<ApiResponse<OrderWithCustomer>>(`/orders/${id}/status`, null, {
        params: { status },
        ...bearer(auth),
    });
    return data;
}
