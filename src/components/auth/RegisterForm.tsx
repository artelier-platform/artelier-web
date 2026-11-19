"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { AtSign, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";

import IconInput from "@/components/auth/IconInput";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

type Props = {
    onSuccess: (role?: string) => void;
    onSwitchMode: () => void;
};

const INITIAL = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneCountryCode: "+57",
    phoneNumber: "",
    password: "",
};

export default function RegisterForm({ onSuccess, onSwitchMode }: Props) {
    const { register } = useAuth();

    const [form, setForm] = useState(INITIAL);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const field = (key: keyof typeof INITIAL) => ({
        value: form[key],
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value })),
    });

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await register({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                username: form.username.trim(),
                email: form.email.trim(),
                phoneCountryCode: form.phoneCountryCode.trim(),
                phoneNumber: form.phoneNumber.trim(),
                password: form.password,
            });

            if (result.success) {
                toast.success("¡Tu cuenta está lista!");
                onSuccess(result.data?.user.role);
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
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="reg-first" className="sr-only">Nombre</Label>
                        <IconInput
                            id="reg-first"
                            icon={User}
                            autoComplete="given-name"
                            placeholder="Nombre"
                            required
                            {...field("firstName")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="reg-last" className="sr-only">Apellido</Label>
                        <IconInput
                            id="reg-last"
                            icon={User}
                            autoComplete="family-name"
                            placeholder="Apellido"
                            required
                            {...field("lastName")}
                        />
                    </div>
                </div>

                <Label htmlFor="reg-username" className="sr-only">Usuario</Label>
                <IconInput
                    id="reg-username"
                    icon={AtSign}
                    autoComplete="username"
                    placeholder="Usuario (sin espacios)"
                    pattern="[!-~]+"
                    title="Solo caracteres ASCII, sin espacios"
                    required
                    {...field("username")}
                />

                <Label htmlFor="reg-email" className="sr-only">Correo electrónico</Label>
                <IconInput
                    id="reg-email"
                    icon={Mail}
                    type="email"
                    autoComplete="email"
                    placeholder="Correo electrónico"
                    required
                    {...field("email")}
                />

                <div className="grid grid-cols-[5rem_1fr] gap-3">
                    <div>
                        <Label htmlFor="reg-cc" className="sr-only">Prefijo</Label>
                        <Input
                            id="reg-cc"
                            inputMode="tel"
                            autoComplete="tel-country-code"
                            placeholder="+57"
                            required
                            {...field("phoneCountryCode")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="reg-phone" className="sr-only">Teléfono</Label>
                        <IconInput
                            id="reg-phone"
                            icon={Phone}
                            type="tel"
                            autoComplete="tel-national"
                            placeholder="Teléfono"
                            required
                            {...field("phoneNumber")}
                        />
                    </div>
                </div>

                <Label htmlFor="reg-password" className="sr-only">Contraseña</Label>
                <PasswordInput
                    id="reg-password"
                    autoComplete="new-password"
                    placeholder="Contraseña"
                    required
                    {...field("password")}
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