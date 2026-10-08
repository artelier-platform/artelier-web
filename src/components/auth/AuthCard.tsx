"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { AuthMode } from "@/store/ui";

type Props = {
    mode: AuthMode;
    onModeChange: (mode: AuthMode) => void;
    onSuccess: (role?: string) => void;
    onClose: () => void;
    className?: string;
};

const toggleBase =
    "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-colors";
const toggleActive = "bg-primary text-primary-foreground shadow-sm";
const toggleIdle = "text-muted-foreground hover:text-foreground";

/**
 * Tarjeta de acceso (Figma: mockup de login / registro).
 * Registro: panel de marca a la izquierda y formulario a la derecha. Login: al revés.
 * Al cambiar de modo, los dos paneles se deslizan intercambiando de lado.
 */
export default function AuthCard({ mode, onModeChange, onSuccess, onClose, className }: Props) {
    const isRegister = mode === "register";

    return (
        <div className={cn("relative w-full", className)}>
            {/* Selector con flechas, montado sobre el borde superior */}
            <div
                role="group"
                aria-label="Cambiar entre registro e inicio de sesión"
                className="absolute top-0 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-1 shadow-md"
            >
                <button
                    type="button"
                    aria-pressed={isRegister}
                    onClick={() => onModeChange("register")}
                    className={cn(toggleBase, isRegister ? toggleActive : toggleIdle)}
                >
                    <ArrowLeft className="size-4" />
                    Registrarse
                </button>
                <button
                    type="button"
                    aria-pressed={!isRegister}
                    onClick={() => onModeChange("login")}
                    className={cn(toggleBase, !isRegister ? toggleActive : toggleIdle)}
                >
                    Iniciar sesión
                    <ArrowRight className="size-4" />
                </button>
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className={cn(
                    "absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-full transition-opacity hover:opacity-70",
                    isRegister ? "text-foreground" : "text-foreground md:text-white"
                )}
            >
                <X className="size-5" />
            </button>

            <div className="relative overflow-hidden rounded-xl border border-border bg-background shadow-xl md:h-[500px]">
                {/* Panel de marca (solo escritorio). La clase "dark" lo deja oscuro también en modo claro. */}
                <div
                    aria-hidden
                    className={cn(
                        "dark hidden bg-card text-foreground transition-transform duration-700 ease-in-out md:absolute md:inset-y-0 md:left-0 md:flex md:w-1/2 md:flex-col md:items-center md:justify-center md:gap-5 md:overflow-hidden md:p-10 md:text-center",
                        isRegister ? "md:translate-x-0" : "md:translate-x-full"
                    )}
                >
                    <Image
                        src="/images/logo-vertical-negativo.svg"
                        alt=""
                        width={152}
                        height={140}
                        className="h-40 w-auto"
                    />
                    <p className="max-w-60 text-xs leading-relaxed">“{SITE.tagline}”</p>

                    <svg
                        viewBox="0 0 400 120"
                        preserveAspectRatio="none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="pointer-events-none absolute right-0 bottom-0 left-0 h-24 w-full text-secondary/30"
                    >
                        <path d="M0 100 C 60 60, 120 110, 200 80 S 340 40, 400 70" />
                        <path d="M0 116 C 80 80, 140 120, 220 95 S 350 60, 400 90" />
                    </svg>
                </div>

                {/* Panel del formulario */}
                <div
                    className={cn(
                        "relative max-h-[calc(100dvh-6rem)] w-full overflow-y-auto transition-transform duration-700 ease-in-out md:absolute md:inset-y-0 md:left-0 md:max-h-none md:w-1/2",
                        isRegister ? "md:translate-x-full" : "md:translate-x-0"
                    )}
                >
                    <div
                        key={mode}
                        className="animate-in fade-in flex min-h-full flex-col justify-center p-8 pt-12 duration-700 md:px-12 md:pt-8"
                    >
                        {isRegister ? (
                            <RegisterForm onSuccess={onSuccess} onSwitchMode={() => onModeChange("login")} />
                        ) : (
                            <LoginForm onSuccess={onSuccess} onSwitchMode={() => onModeChange("register")} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
