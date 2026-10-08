import { getAllBanners } from "@/server/banners/banners.service";
import { getAuth, proxy } from "@/server/http";

export async function GET(request: Request) {
    return proxy(() => getAllBanners(getAuth(request)));
}
