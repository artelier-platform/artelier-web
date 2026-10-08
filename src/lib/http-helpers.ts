/** Arma el multipart que espera el backend: parte "data" (JSON) + archivos por nombre de campo. */
export function buildMultipart(
    data: unknown,
    files: Record<string, File | File[] | null | undefined> = {}
): FormData {
    const form = new FormData();
    form.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

    for (const [field, value] of Object.entries(files)) {
        if (!value) continue;
        (Array.isArray(value) ? value : [value]).forEach((file) => form.append(field, file));
    }

    return form;
}

/** Algunos endpoints pueden devolver lista simple o página; el frontend siempre trabaja con lista. */
export function toList<T>(payload: T[] | { content?: T[] } | undefined | null): T[] {
    if (!payload) return [];
    return Array.isArray(payload) ? payload : (payload.content ?? []);
}
