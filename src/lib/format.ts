const cop = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

/** 200000 -> "$ 200.000" */
export function formatPrice(value: number | undefined | null): string {
    return cop.format(Number(value ?? 0));
}
