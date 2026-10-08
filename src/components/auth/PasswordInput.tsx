"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import IconInput from "@/components/auth/IconInput";
import { cn } from "@/lib/utils";

export default function PasswordInput({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <IconInput {...props} icon={Lock} type={show ? "text" : "password"} className={cn("pr-10", className)} />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}
