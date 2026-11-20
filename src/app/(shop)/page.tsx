import BannerCarousel from "@/components/shop/BannerCarousel";
import { getActiveBanners } from "@/server/banners/banners.service";

/**
 * Incremental Static Regeneration (ISR) interval in seconds for the home page.
 */
export const revalidate = 60;

/**
 * Server Component rendering the storefront home page with active promotional banners.
 *
 * Execution flow:
 * 1. Fetches active banners directly on the server via {@link getActiveBanners}.
 * 2. Extracts `res.data` when available, gracefully falling back to an empty array if the
 *    response has no data or if the upstream request rejects.
 * 3. Passes the resolved banners to the client {@link BannerCarousel} component.
 *
 * @returns A promise resolving to the rendered home page JSX.
 */
export default async function Home() {
  const banners = await getActiveBanners()
      .then((res) => res.data ?? [])
      .catch(() => []);

  return <BannerCarousel banners={banners} />;
}