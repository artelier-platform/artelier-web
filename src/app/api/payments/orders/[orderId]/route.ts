import { getAuth, proxy } from "@/server/http";
import { createPayment, getPaymentByOrder } from "@/server/payments/payments.service";
import type { PaymentRequest } from "@/types";

type Params = { params: Promise<{ orderId: string }> };

export async function GET(request: Request, { params }: Params) {
    const { orderId } = await params;
    return proxy(() => getPaymentByOrder(orderId, getAuth(request)));
}

export async function POST(request: Request, { params }: Params) {
    const { orderId } = await params;
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
    const body: PaymentRequest = await request.json();
    return proxy(() => createPayment(orderId, body, clientIp, getAuth(request)), 201);
}
