"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import AuthCard from "@/components/auth/AuthCard";
import { safeRedirect } from "@/lib/redirect";
import type { AuthMode } from "@/store/ui";

/**
 * Versión de página completa de la tarjeta de acceso, para /login y /register
 * (enlaces directos, recargas y redirecciones del servidor). El modo sale de la URL.
 * Este componente vive en el layout de (auth), así que no se reinicia entre las dos rutas y la animación se conserva.
 */
export default function AuthPageShell() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const mode: AuthMode = pathname.startsWith("/register") ? "register" : "login";
    const redirectTo = safeRedirect(params.get("redirect"));
    const qs = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : "";

    return (
        <div className="flex min-h-dvh items-center justify-center bg-muted px-4 py-16">
            <h1 className="sr-only">Acceso a Artelier</h1>
            <AuthCard
                mode={mode}
                className="max-w-3xl"
                onModeChange={(m) => router.push(`${m === "login" ? "/login" : "/register"}${qs}`)}
                onSuccess={(role) => {
                    router.replace(redirectTo ?? (role === "ADMIN" ? "/admin" : "/"));
                    router.refresh();
                }}
                onClose={() => router.push("/")}
            />
        </div>
    );
}
