"use client";

import { useState, type FormEvent } from "react";
import { Mail, User } from "lucide-react";
import { toast } from "sonner";

import IconInput from "@/components/auth/IconInput";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type Props = {
    onSuccess: (role?: string) => void;
    onSwitchMode: () => void;
};

export default function RegisterForm({ onSuccess, onSwitchMode }: Props) {
    const { register } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await register({
                fullName: fullName.trim(),
                email: email.trim(),
                password,
            });

            if (result.success) {
                toast.success("¡Tu cuenta está lista!");
                onSuccess(result.data?.role);
            } else {
                setError(result.message ?? "No pudimos crear tu cuenta.");
            }
        } catch {
            setError("No pudimos conectar con el servidor. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h2 className="font-heading text-3xl font-medium">Crear cuenta</h2>
                <p className="text-sm text-muted-foreground">
                    Únete a nuestra comunidad y descubre nuestras piezas únicas.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <Label htmlFor="reg-name" className="sr-only">
                    Nombre completo
                </Label>
                <IconInput
                    id="reg-name"
                    icon={User}
                    autoComplete="name"
                    placeholder="Nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

                <Label htmlFor="reg-email" className="sr-only">
                    Correo electrónico
                </Label>
                <IconInput
                    id="reg-email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Label htmlFor="reg-password" className="sr-only">
                    Contraseña
                </Label>
                <PasswordInput
                    id="reg-password"
                    autoComplete="new-password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" />
            </div>

            <p className="text-center text-xs">
                ¿Ya tienes una cuenta?{" "}
                <button
                    type="button"
                    onClick={onSwitchMode}
                    className="text-warning underline underline-offset-4 hover:opacity-80"
                >
                    Inicia sesión
                </button>
            </p>
        </form>
    );
}
