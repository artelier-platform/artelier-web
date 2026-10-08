import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false en el servidor y en el primer render del cliente; true después. Evita desajustes con stores persistidos (carrito). */
export function useHydrated() {
    return useSyncExternalStore(subscribe, () => true, () => false);
}
