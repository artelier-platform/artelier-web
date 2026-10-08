import { deleteBanner, updateBanner } from "@/server/banners/banners.service";
import { getAuth, proxy, readFiles, readJsonPart } from "@/server/http";
import type { BannerRequest } from "@/types/pending";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(async () => {
        const form = await request.formData();
        const banner = await readJsonPart<BannerRequest>(form, "data");
        const [image] = readFiles(form, "image");
        return updateBanner(id, banner, image, getAuth(request));
    });
}

export async function DELETE(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => deleteBanner(id, getAuth(request)));
}
