import { useSyncExternalStore } from "react";

/**
 * No-op subscription callback passed to `useSyncExternalStore` because client hydration
 * state never changes dynamically after the component mounts.
 *
 * @returns An empty cleanup unsubscribe function.
 */
const subscribe = () => () => {};

/**
 * Custom React hook that indicates whether the component has hydrated on the client.
 *
 * - Returns `false` during SSR and on the initial client render pass.
 * - Returns `true` on subsequent client renders after hydration completes.
 * - Prevents hydration mismatches when rendering data derived from client-persisted
 *   stores (such as a shopping cart).
 *
 * @returns `true` once hydrated on the client, otherwise `false`.
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(subscribe, () => true, () => false);
}