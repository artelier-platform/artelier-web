import { getAuth, proxy } from "@/server/http";
import { getMyOrders } from "@/server/orders/orders.service";

export async function GET(request: Request) {
    return proxy(() => getMyOrders(getAuth(request)));
}
