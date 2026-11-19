import { bff } from "@/lib/bff";
import { buildMultipart } from "@/lib/http-helpers";
import type { ApiResponse, Banner, BannerRequest } from "@/types";

// ------------------- Admin -------------------
// (The home carousel reads active banners on the server via `@/server/banners/banners.service`.)

/**
 * Fetches all banners (including inactive entries) for administrative management via the BFF.
 *
 * @returns A promise resolving to the API response containing the list of {@link Banner} entities.
 */
export async function getAllBanners(): Promise<ApiResponse<Banner[]>> {
    const { data } = await bff.get<ApiResponse<Banner[]>>("/admin/banners");
    return data;
}

/**
 * Creates a new banner with an image asset via multipart form data through the BFF.
 *
 * @param banner - Banner configuration payload conforming to {@link BannerRequest}.
 * @param image - Image file to upload for the banner.
 * @returns A promise resolving to the API response containing the created {@link Banner}.
 */
export async function createBanner(banner: BannerRequest, image: File): Promise<ApiResponse<Banner>> {
    const { data } = await bff.post<ApiResponse<Banner>>("/banners", buildMultipart(banner, { image }));
    return data;
}

/**
 * Updates an existing banner by ID via multipart form data through the BFF.
 *
 * @remarks When `image` is omitted, the existing banner image is preserved.
 * @param id - Unique identifier of the banner to update.
 * @param banner - Updated banner configuration payload conforming to {@link BannerRequest}.
 * @param image - Optional replacement image file.
 * @returns A promise resolving to the API response containing the updated {@link Banner}.
 */
export async function updateBanner(id: string, banner: BannerRequest, image?: File): Promise<ApiResponse<Banner>> {
    const { data } = await bff.put<ApiResponse<Banner>>(`/admin/banners/${id}`, buildMultipart(banner, { image }));
    return data;
}

/**
 * Deletes a banner by its unique identifier through the BFF admin endpoint.
 *
 * @param id - Unique identifier of the banner to delete.
 * @returns A promise resolving to the API response confirming deletion.
 */
export async function deleteBanner(id: string): Promise<ApiResponse<never>> {
    const { data } = await bff.delete<ApiResponse<never>>(`/admin/banners/${id}`);
    return data;
}

/**
 * Toggles the active/inactive state of a banner by ID through the BFF endpoint.
 *
 * @param id - Unique identifier of the banner to toggle.
 * @returns A promise resolving to the API response containing the updated {@link Banner}.
 */
export async function toggleBanner(id: string): Promise<ApiResponse<Banner>> {
    const { data } = await bff.patch<ApiResponse<Banner>>(`/banners/${id}/toggle`);
    return data;
}