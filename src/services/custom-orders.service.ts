import { bff } from "@/lib/bff";
import { toList } from "@/lib/http-helpers";
import type { ApiResponse } from "@/types";
import type {
    CustomOrder,
    CustomOrderInput,
    CustomOrderStatusUpdate,
    CustomOrdersParams,
    PageResponse,
} from "@/types/pending";

/** Requiere sesión. El contacto lo toma el backend del usuario autenticado. */
export async function createCustomOrder(input: CustomOrderInput): Promise<ApiResponse<CustomOrder>> {
    const body = new FormData();
    body.append("customerName", input.customerName.trim());
    body.append("description", input.description.trim());
    input.images.forEach((file) => body.append("referenceImages", file));

    const { data } = await bff.post<ApiResponse<CustomOrder>>("/custom-orders", body);
    return data;
}

export async function getMyCustomOrders(): Promise<CustomOrder[]> {
    const { data } = await bff.get<ApiResponse<CustomOrder[] | PageResponse<CustomOrder>>>("/custom-orders/my");
    return toList(data.data);
}

// ------------------- Admin -------------------

export async function getAllCustomOrders(
    params: CustomOrdersParams = {}
): Promise<ApiResponse<PageResponse<CustomOrder>>> {
    const { data } = await bff.get<ApiResponse<PageResponse<CustomOrder>>>("/custom-orders", { params });
    return data;
}

export async function getCustomOrderById(id: string): Promise<ApiResponse<CustomOrder>> {
    const { data } = await bff.get<ApiResponse<CustomOrder>>(`/custom-orders/${id}`);
    return data;
}

export async function updateCustomOrderStatus(
    id: string,
    body: CustomOrderStatusUpdate
): Promise<ApiResponse<CustomOrder>> {
    const { data } = await bff.patch<ApiResponse<CustomOrder>>(`/custom-orders/${id}/status`, body);
    return data;
}
