import { bff } from "@/lib/bff";
import type { ApiResponse, Payment, PaymentRequest } from "@/types";
import type { FinancialInstitution } from "@/types/pending";

/** Inicia el pago de un pedido. Para PSE y Bancolombia la respuesta trae `redirectUrl`. */
export async function createPayment(orderId: string, body: PaymentRequest): Promise<ApiResponse<Payment>> {
    const { data } = await bff.post<ApiResponse<Payment>>(`/payments/orders/${orderId}`, body);
    return data;
}

/** Se consulta cada pocos segundos mientras el pago esté PENDING (Nequi, retorno de PSE). */
export async function getPaymentByOrder(orderId: string): Promise<ApiResponse<Payment>> {
    const { data } = await bff.get<ApiResponse<Payment>>(`/payments/orders/${orderId}`);
    return data;
}

export async function getFinancialInstitutions(): Promise<ApiResponse<FinancialInstitution[]>> {
    const { data } = await bff.get<ApiResponse<FinancialInstitution[]>>("/payments/financial-institutions");
    return data;
}
