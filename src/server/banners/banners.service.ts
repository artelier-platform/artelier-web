// src/server/banners/banners.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse, Banner } from "@/types";

/**
 * Fetches publicly active banners (containing only active, pre-sorted items from the backend)
 * for server-side rendering such as the storefront home page.
 *
 * Execution flow:
 * 1. Sends an unauthenticated `GET /banners` request to the upstream API client (`api`).
 * 2. Unwraps and returns the parsed `data` payload typed as `ApiResponse<Banner[]>`.
 * 3. Propagates any Axios network or non-2xx HTTP errors to the caller.
 *
 * @returns A promise resolving to the API response containing active {@link Banner} items.
 * @throws {AxiosError} Rejects when the upstream API request fails or returns a non-2xx status.
 */
export async function getActiveBanners(): Promise<ApiResponse<Banner[]>> {
    const { data } = await api.get<ApiResponse<Banner[]>>("/banners");
    return data;
}

/**
 * Fetches all banners (including inactive banners and inactive items) for administrative use
 * via the upstream `/admin/banners` endpoint.
 *
 * Execution flow:
 * 1. Builds optional bearer authorization headers via {@link bearer} from `auth`.
 * 2. Dispatches a `GET /admin/banners` request through the server API client (`api`).
 * 3. Unwraps and returns the parsed `data` payload typed as `ApiResponse<Banner[]>`.
 * 4. Propagates any Axios network or non-2xx HTTP errors (such as `401` or `403`) to the caller.
 *
 * @param auth - Optional bearer token or authorization value forwarded to {@link bearer}.
 * @returns A promise resolving to the API response containing all {@link Banner} records.
 * @throws {AxiosError} Rejects when the upstream API request fails or returns a non-2xx status.
 */
export async function getAllBanners(auth?: string): Promise<ApiResponse<Banner[]>> {
    const { data } = await api.get<ApiResponse<Banner[]>>("/admin/banners", bearer(auth));
    return data;
}

// TODO(admin-banners): Implement create/update/delete/toggle/reorder helpers against `/admin/banners/**` (JSON + `POST /admin/banners/uploads`).