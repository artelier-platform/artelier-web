import type { Product } from "@/types";

export type ProductStatus = "SOLD_OUT" | "LAST_UNITS" | "NEW" | "CUSTOM" | "AVAILABLE";

/** Reglas de negocio de presentación. Ajustar aquí si cambian. */
export const NEW_PRODUCT_DAYS = 28;
export const LAST_UNITS_MAX = 3;

export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
    SOLD_OUT: "Agotado",
    LAST_UNITS: "Últimas existencias",
    NEW: "Nuevo",
    CUSTOM: "Personalizado",
    AVAILABLE: "Disponible",
};

function isNew(createdAt: string | undefined, now: Date) {
    if (!createdAt) return false;
    const created = new Date(createdAt).getTime();
    if (Number.isNaN(created)) return false;
    return now.getTime() - created <= NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Una sola pastilla por producto. Prioridad:
 * Agotado > Últimas existencias > Nuevo > Personalizado > Disponible.
 * El stock solo aplica a AVAILABLE; UNLIMITED y MADE_TO_ORDER (encargo) nunca se agotan.
 */
export function getProductStatus(product: Product, now: Date = new Date()): ProductStatus {
    if (product.stockType === "AVAILABLE") {
        const qty = product.stockQuantity ?? 0;
        if (qty <= 0) return "SOLD_OUT";
        if (qty <= LAST_UNITS_MAX) return "LAST_UNITS";
    }
    if (isNew(product.createdAt, now)) return "NEW";
    if (product.isCustomOrder || product.stockType === "MADE_TO_ORDER") return "CUSTOM";
    return "AVAILABLE";
}
