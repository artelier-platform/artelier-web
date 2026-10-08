import { bff } from "@/lib/bff";
import { buildMultipart } from "@/lib/http-helpers";
import type { ApiResponse } from "@/types";
import type { Banner, BannerRequest } from "@/types/pending";

// ------------------- Admin -------------------
// (el carrusel del home lee los banners activos desde el servidor: @/server/banners/banners.service)

export async function getAllBanners(): Promise<ApiResponse<Banner[]>> {
    const { data } = await bff.get<ApiResponse<Banner[]>>("/admin/banners");
    return data;
}

export async function createBanner(banner: BannerRequest, image: File): Promise<ApiResponse<Banner>> {
    const { data } = await bff.post<ApiResponse<Banner>>("/banners", buildMultipart(banner, { image }));
    return data;
}

/** Sin `image` se conserva la imagen actual. */
export async function updateBanner(id: string, banner: BannerRequest, image?: File): Promise<ApiResponse<Banner>> {
    const { data } = await bff.put<ApiResponse<Banner>>(`/banners/${id}`, buildMultipart(banner, { image }));
    return data;
}

export async function deleteBanner(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.delete<ApiResponse<never>>(`/banners/${id}`);
    return data;
}

export async function toggleBanner(id: string): Promise<ApiResponse<Banner>> {
    const { data } = await bff.patch<ApiResponse<Banner>>(`/banners/${id}/toggle`);
    return data;
}
