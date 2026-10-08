// src/server/custom-orders/custom-orders.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse } from "@/types";
import type {
    CustomOrder,
    CustomOrderInput,
    CustomOrderStatusUpdate,
    CustomOrdersParams,
    PageResponse,
} from "@/types/pending";

/** Requiere sesión. El contacto lo toma el backend del usuario autenticado. */
export async function createCustomOrder(input: CustomOrderInput, auth?: string): Promise<ApiResponse<CustomOrder>> {
    const body = new FormData();
    body.append("customerName", input.customerName.trim());
    body.append("description", input.description.trim());
    input.images.forEach((file) => body.append("referenceImages", file));

    const { data } = await api.post<ApiResponse<CustomOrder>>("/custom-orders", body, bearer(auth));
    return data;
}

export async function getMyCustomOrders(
    auth?: string
): Promise<ApiResponse<CustomOrder[] | PageResponse<CustomOrder>>> {
    const { data } = await api.get<ApiResponse<CustomOrder[] | PageResponse<CustomOrder>>>(
        "/custom-orders/my",
        bearer(auth)
    );
    return data;
}

// ------------------ { admin } ------------------

export async function getAllCustomOrders(
    queries: CustomOrdersParams,
    auth?: string
): Promise<ApiResponse<PageResponse<CustomOrder>>> {
    const { data } = await api.get<ApiResponse<PageResponse<CustomOrder>>>("/custom-orders", {
        params: queries,
        ...bearer(auth),
    });
    return data;
}

export async function getCustomOrderById(id: string, auth?: string): Promise<ApiResponse<CustomOrder>> {
    const { data } = await api.get<ApiResponse<CustomOrder>>(`/custom-orders/${id}`, bearer(auth));
    return data;
}

export async function updateCustomOrderStatus(
    id: string,
    body: CustomOrderStatusUpdate,
    auth?: string
): Promise<ApiResponse<CustomOrder>> {
    const { data } = await api.patch<ApiResponse<CustomOrder>>(`/custom-orders/${id}/status`, body, bearer(auth));
    return data;
}
