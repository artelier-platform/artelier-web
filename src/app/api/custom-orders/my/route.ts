import { getMyCustomOrders } from "@/server/custom-orders/custom-orders.service";
import { getAuth, proxy } from "@/server/http";

export async function GET(request: Request) {
    return proxy(() => getMyCustomOrders(getAuth(request)));
}
