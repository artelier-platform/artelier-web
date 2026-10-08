"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import IconInput from "@/components/auth/IconInput";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { SITE } from "@/lib/site";

type Props = {
    onSuccess: (role?: string) => void;
    onSwitchMode: () => void;
};

export default function LoginForm({ onSuccess, onSwitchMode }: Props) {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await login({ email: email.trim(), password });

            if (result.success) {
                toast.success("¡Bienvenido de nuevo!");
                onSuccess(result.data?.role);
            } else {
                setError(result.message ?? "Correo o contraseña incorrectos.");
            }
        } catch {
            setError("No pudimos conectar con el servidor. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    function handleForgot() {
        // TODO(backend): flujo de recuperación de contraseña (ver docs/backend-pendiente.md)
        toast.info("Pronto podrás recuperar tu contraseña desde aquí.", {
            description: `Mientras tanto, escríbenos a ${SITE.email}.`,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="font-heading text-3xl font-medium">Iniciar sesión</h2>
                <p className="text-sm text-muted-foreground">Bienvenido de nuevo, es un gusto verte.</p>
            </div>

            <div className="flex flex-col gap-3">
                <Label htmlFor="login-email" className="sr-only">
                    Correo electrónico
                </Label>
                <IconInput
                    id="login-email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Label htmlFor="login-password" className="sr-only">
                    Contraseña
                </Label>
                <PasswordInput
                    id="login-password"
                    autoComplete="current-password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="flex items-center justify-between text-xs">
                {/* TODO(backend): "Recordarme" aún no cambia nada (ver docs/backend-pendiente.md) */}
                <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" name="remember" className="size-4 accent-primary" />
                    Recordarme
                </label>
                <button
                    type="button"
                    onClick={handleForgot}
                    className="text-warning underline underline-offset-4 hover:opacity-80"
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </div>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" />
            </div>

            <p className="text-center text-xs">
                ¿No tienes una cuenta?{" "}
                <button
                    type="button"
                    onClick={onSwitchMode}
                    className="text-warning underline underline-offset-4 hover:opacity-80"
                >
                    Registrarse
                </button>
            </p>
        </form>
    );
}
