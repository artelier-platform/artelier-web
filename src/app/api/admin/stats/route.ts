import { getAuth, proxy } from "@/server/http";
import { getStats } from "@/server/stats/stats.service";

export async function GET(request: Request) {
    return proxy(() => getStats(getAuth(request)));
}
