"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";

import AuthCard from "@/components/auth/AuthCard";
import { useUIStore } from "@/store/ui";

/** Ventana de acceso sobre la página actual, con el fondo desenfocado. Se abre con useUIStore().openAuth(). */
export default function AuthModal() {
    const router = useRouter();
    const open = useUIStore((s) => s.authOpen);
    const mode = useUIStore((s) => s.authMode);
    const setOpen = useUIStore((s) => s.setAuthOpen);
    const setMode = useUIStore((s) => s.setAuthMode);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content
                    aria-describedby={undefined}
                    className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                >
                    <Dialog.Title className="sr-only">
                        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                    </Dialog.Title>
                    <AuthCard
                        mode={mode}
                        onModeChange={setMode}
                        onSuccess={(role) => {
                            setOpen(false);
                            // Mismo comportamiento que la página /login: el admin entra directo a su panel.
                            if (role === "ADMIN") router.push("/admin");
                            router.refresh();
                        }}
                        onClose={() => setOpen(false)}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
