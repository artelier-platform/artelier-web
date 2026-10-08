import { updateCustomOrderStatus } from "@/server/custom-orders/custom-orders.service";
import { getAuth, proxy } from "@/server/http";
import type { CustomOrderStatusUpdate } from "@/types/pending";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
    const { id } = await params;
    const body: CustomOrderStatusUpdate = await request.json();
    return proxy(() => updateCustomOrderStatus(id, body, getAuth(request)));
}
