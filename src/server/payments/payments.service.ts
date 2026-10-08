// src/server/payments/payments.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse, Payment, PaymentRequest } from "@/types";
import type { FinancialInstitution } from "@/types/pending";

/** La IP del cliente se reenvía en X-Forwarded-For (la ve el BFF, no el backend). */
export async function createPayment(
    orderId: string,
    body: PaymentRequest,
    clientIp: string,
    auth?: string
): Promise<ApiResponse<Payment>> {
    const { data } = await api.post<ApiResponse<Payment>>(`/payments/orders/${orderId}`, body, {
        headers: { ...bearer(auth).headers, "X-Forwarded-For": clientIp },
    });
    return data;
}

export async function getPaymentByOrder(orderId: string, auth?: string): Promise<ApiResponse<Payment>> {
    const { data } = await api.get<ApiResponse<Payment>>(`/payments/orders/${orderId}`, bearer(auth));
    return data;
}

export async function getFinancialInstitutions(auth?: string): Promise<ApiResponse<FinancialInstitution[]>> {
    const { data } = await api.get<ApiResponse<FinancialInstitution[]>>(
        "/payments/financial-institutions",
        bearer(auth)
    );
    return data;
}
