/** Acepta solo rutas internas ("/checkout"), nunca URLs externas ni "//sitio.com". */
export function safeRedirect(path: string | undefined | null): string | undefined {
    if (!path) return undefined;
    return path.startsWith("/") && !path.startsWith("//") ? path : undefined;
}
