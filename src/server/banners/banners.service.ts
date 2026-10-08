// src/server/banners/banners.service.ts
import { api } from "@/lib/api";
import { buildMultipart } from "@/lib/http-helpers";
import { bearer } from "@/server/http";
import type { ApiResponse } from "@/types";
import type { Banner, BannerRequest } from "@/types/pending";

/** Público: solo activos, ordenados por sortOrder. Se usa desde el home (servidor). */
export async function getActiveBanners(): Promise<ApiResponse<Banner[]>> {
    const { data } = await api.get<ApiResponse<Banner[]>>("/banners");
    return data;
}

// ------------------ { admin } ------------------

export async function getAllBanners(auth?: string): Promise<ApiResponse<Banner[]>> {
    const { data } = await api.get<ApiResponse<Banner[]>>("/admin/banners", bearer(auth));
    return data;
}

export async function createBanner(banner: BannerRequest, image: File, auth?: string): Promise<ApiResponse<Banner>> {
    const { data } = await api.post<ApiResponse<Banner>>("/banners", buildMultipart(banner, { image }), bearer(auth));
    return data;
}

/** Sin `image` se conserva la imagen actual. */
export async function updateBanner(
    id: string,
    banner: BannerRequest,
    image: File | undefined,
    auth?: string
): Promise<ApiResponse<Banner>> {
    const { data } = await api.put<ApiResponse<Banner>>(
        `/banners/${id}`,
        buildMultipart(banner, { image }),
        bearer(auth)
    );
    return data;
}

export async function deleteBanner(id: string, auth?: string): Promise<ApiResponse<never>> {
    const { data } = await api.delete<ApiResponse<never>>(`/banners/${id}`, bearer(auth));
    return data;
}

export async function toggleBanner(id: string, auth?: string): Promise<ApiResponse<Banner>> {
    const { data } = await api.patch<ApiResponse<Banner>>(`/banners/${id}/toggle`, null, bearer(auth));
    return data;
}
