// src/services/banners.service.ts
import { bff } from "@/lib/bff";
import type { ApiResponse, Banner } from "@/types";

// Note: The storefront home carousel fetches active banners server-side via `@/server/banners/banners.service`.

/**
 * Fetches all banners (including inactive entries) for administrative management
 * by sending a `GET /admin/banners` request through the client BFF instance.
 *
 * Execution flow:
 * 1. Dispatches an authenticated/BFF-routed `GET` request to `/admin/banners`.
 * 2. Unwraps and returns the parsed `data` payload typed as `ApiResponse<Banner[]>`.
 * 3. Propagates any Axios network or non-2xx HTTP error to the caller or BFF interceptor.
 *
 * @returns A promise resolving to the API response containing the list of {@link Banner} entities.
 * @throws {AxiosError} Rejects when the BFF/backend request fails or returns a non-2xx status.
 */
export async function getAllBanners(): Promise<ApiResponse<Banner[]>> {
    const { data } = await bff.get<ApiResponse<Banner[]>>("/admin/banners");
    return data;
}

// TODO(admin-banners): Add mutation helpers targeting `/admin/banners/**` once the admin banner UI is built.