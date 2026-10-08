import { getCustomOrderById } from "@/server/custom-orders/custom-orders.service";
import { getAuth, proxy } from "@/server/http";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => getCustomOrderById(id, getAuth(request)));
}
