import { toggleBanner } from "@/server/banners/banners.service";
import { getAuth, proxy } from "@/server/http";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => toggleBanner(id, getAuth(request)));
}
