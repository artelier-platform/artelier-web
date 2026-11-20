import { getActiveBanners } from "@/server/banners/banners.service";
import { proxy } from "@/server/http";

/**
 * Handles `GET` requests to fetch publicly active banners through the BFF proxy layer.
 *
 * Execution flow:
 * 1. Invokes {@link getActiveBanners} inside {@link proxy} to query the upstream server service.
 * 2. Translates upstream results or failures into a standardized Next.js/Web Fetch `Response`.
 *
 * @returns A promise resolving to a Web Fetch `Response` containing active banner data or an error payload.
 */
export async function GET(): Promise<Response> {
    return proxy(() => getActiveBanners());
}