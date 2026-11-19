// src/server/http.ts
import { isAxiosError } from "axios";

/**
 * Custom error class representing features or endpoints that are not yet implemented or available.
 */
export class NotAvailableError extends Error {
    /**
     * Creates an instance of `NotAvailableError`.
     *
     * @param feature - The name or description of the unavailable feature.
     */
    constructor(feature: string) {
        super(`${feature} is not available yet`);
        this.name = "NotAvailableError";
    }
}

/**
 * Throws a {@link NotAvailableError} indicating that a specific feature is not available.
 *
 * @param feature - The name or description of the unavailable feature.
 * @throws {NotAvailableError} Always throws the error.
 */
export function notAvailable(feature: string): never {
    throw new NotAvailableError(feature);
}

/**
 * Retrieves the Authorization header forwarded by the client to the BFF
 * (injected by the client-side HTTP interceptor).
 *
 * @param request - The incoming Web Fetch API `Request` object.
 * @returns The authorization header string if present, or `undefined`.
 */
export function getAuth(request: Request): string | undefined {
    return request.headers.get("authorization") ?? undefined;
}

/**
 * Generates an Axios configuration object containing the authorization header
 * to be forwarded downstream to backend services.
 *
 * @param auth - The raw authorization token or header string.
 * @returns An Axios request config object with the Authorization header, or an empty object if undefined/null.
 */
export function bearer(auth?: string | null): { headers?: { Authorization: string } } {
    return auth ? { headers: { Authorization: auth } } : {};
}

/**
 * Parses and extracts URL query parameters from a request into a key-value record.
 *
 * @param request - The incoming Web Fetch API `Request` object.
 * @returns A record of query parameter key-value pairs.
 */
export function queryOf(request: Request): Record<string, string> {
    return Object.fromEntries(new URL(request.url).searchParams.entries());
}

/**
 * Reads and parses a JSON segment from a multipart/form-data submission
 * (which may arrive as a file/blob or text payload).
 *
 * @template T - The expected type of the parsed JSON payload.
 * @param form - The `FormData` instance containing the multipart payload.
 * @param name - The field name of the JSON part.
 * @returns A promise that resolves to the parsed JSON object of type `T`.
 */
export async function readJsonPart<T>(form: FormData, name: string): Promise<T> {
    const part = form.get(name);
    const text = typeof part === "string" ? part : await (part as Blob).text();
    return JSON.parse(text) as T;
}

/**
 * Extracts and filters all file entries matching a specific field name from a multipart/form-data submission.
 *
 * @param form - The `FormData` instance.
 * @param name - The field name corresponding to the file entries.
 * @returns An array of filtered `File` objects.
 */
export function readFiles(form: FormData, name: string): File[] {
    return form.getAll(name).filter((f): f is File => f instanceof File);
}

/**
 * Executes a backend API call and wraps the result as a Web Fetch `Response`.
 * Delegates error handling and transformation to `responseFromError` upon failure.
 *
 * @template T - The expected return type of the asynchronous backend call.
 * @param call - A function returning a promise with the backend payload.
 * @param okStatus - The HTTP status code to return upon success (defaults to `200`).
 * @returns A promise resolving to a Web Fetch `Response` object.
 */
export async function proxy<T>(
    call: () => Promise<T>,
    okStatus: number = 200
): Promise<Response> {
    try {
        return Response.json(await call(), { status: okStatus });
    } catch (error) {
        return responseFromError(error);
    }
}

/**
 * Transforms an arbitrary error (including `NotAvailableError`, Axios errors, or generic exceptions)
 * into a standardized HTTP `Response` object for BFF error responses.
 *
 * @param error - The caught error instance (`unknown` type).
 * @returns A Web Fetch `Response` containing the structured error message and appropriate HTTP status code.
 */
export function responseFromError(error: unknown): Response {
    if (error instanceof NotAvailableError) {
        return Response.json(
            { success: false, message: error.message },
            { status: 501 }
        );
    }

    if (isAxiosError(error)) {
        if (error.response) {
            return Response.json(
                error.response.data ?? { success: false, message: "Server error" },
                { status: error.response.status }
            );
        }

        return Response.json(
            { success: false, message: "Could not connect to the server" },
            { status: 502 }
        );
    }

    return Response.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
    );
}