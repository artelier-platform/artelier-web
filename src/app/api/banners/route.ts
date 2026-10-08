import { createBanner, getActiveBanners } from "@/server/banners/banners.service";
import { getAuth, proxy, readFiles, readJsonPart } from "@/server/http";
import type { BannerRequest } from "@/types/pending";

export async function GET() {
    return proxy(() => getActiveBanners());
}

export async function POST(request: Request) {
    return proxy(async () => {
        const form = await request.formData();
        const banner = await readJsonPart<BannerRequest>(form, "data");
        const [image] = readFiles(form, "image");
        return createBanner(banner, image, getAuth(request));
    }, 201);
}
