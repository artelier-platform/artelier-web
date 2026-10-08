// src/server/http.ts
import { isAxiosError } from "axios";

/** Authorization que el navegador mandó al BFF (lo pone el interceptor del cliente). */
export function getAuth(request: Request): string | undefined {
    return request.headers.get("authorization") ?? undefined;
}

/** Config de axios con el token reenviado al backend. */
export function bearer(auth?: string | null): { headers?: { Authorization: string } } {
    return auth ? { headers: { Authorization: auth } } : {};
}

export function queryOf(request: Request): Record<string, string> {
    return Object.fromEntries(new URL(request.url).searchParams.entries());
}

/** Lee una parte JSON de un multipart (llega como archivo/blob o como texto). */
export async function readJsonPart<T>(form: FormData, name: string): Promise<T> {
    const part = form.get(name);
    const text = typeof part === "string" ? part : await (part as Blob).text();
    return JSON.parse(text) as T;
}

export function readFiles(form: FormData, name: string): File[] {
    return form.getAll(name).filter((f): f is File => f instanceof File);
}

/**
 * Ejecuta la llamada al backend y la devuelve como Response.
 * Si el backend responde con error, se conserva su status y su cuerpo
 * (así el interceptor del cliente ve los 401 y los errores de validación).
 */
export async function proxy<T>(call: () => Promise<T>, okStatus = 200): Promise<Response> {
    try {
        return Response.json(await call(), { status: okStatus });
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const body = error.response.data ?? { success: false, message: "Error del servidor" };
            return Response.json(body, { status: error.response.status });
        }
        if (isAxiosError(error)) {
            return Response.json(
                { success: false, message: "No pudimos conectar con el servidor" },
                { status: 502 }
            );
        }
        return Response.json({ success: false, message: "Solicitud inválida" }, { status: 400 });
    }
}
