"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCustomOrder } from "@/services/custom-orders.service";
import { AuthStateStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";

// Límites provisionales: definirlos junto con el backend (ver docs/backend-pendiente.md)
const MAX_FILES = 5;
const MAX_SIZE_MB = 5;

export default function CustomOrderDialog() {
    const open = useUIStore((s) => s.customOrderOpen);
    const setOpen = useUIStore((s) => s.setCustomOrderOpen);
    const openAuth = useUIStore((s) => s.openAuth);
    const isAuthenticated = AuthStateStore((s) => s.isAuthenticated);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);

    function handleFiles(e: ChangeEvent<HTMLInputElement>) {
        const incoming = Array.from(e.target.files ?? []);
        e.target.value = "";

        const valid = incoming.filter((f) => {
            if (!f.type.startsWith("image/")) {
                toast.error(`"${f.name}" no es una imagen`);
                return false;
            }
            if (f.size > MAX_SIZE_MB * 1024 * 1024) {
                toast.error(`"${f.name}" pesa más de ${MAX_SIZE_MB} MB`);
                return false;
            }
            return true;
        });

        setFiles((prev) => {
            const next = [...prev, ...valid];
            if (next.length > MAX_FILES) toast.error(`Máximo ${MAX_FILES} imágenes`);
            return next.slice(0, MAX_FILES);
        });
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSending(true);

        try {
            await createCustomOrder({ customerName: name, description, images: files });

            toast.success("¡Recibimos tu pedido! Te escribiremos a tu correo.");
            setName("");
            setDescription("");
            setFiles([]);
            setOpen(false);
        } catch {
            toast.error("No pudimos enviar tu pedido. Inténtalo de nuevo.");
        } finally {
            setSending(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-card">
                <DialogHeader>
                    <DialogTitle className="font-heading text-3xl font-medium">
                        Haz tu pedido personalizado
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Cuéntanos qué quieres y te contactaremos por correo.
                    </DialogDescription>
                </DialogHeader>

                {!isAuthenticated ? (
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Inicia sesión para enviarnos tu pedido. Te responderemos al correo de tu cuenta.
                        </p>
                        <Button
                            onClick={() => {
                                setOpen(false);
                                openAuth("login");
                            }}
                        >
                            Iniciar sesión
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="co-name">Nombre de cliente</Label>
                            <Input
                                id="co-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="co-description">Descripción del pedido</Label>
                            <Textarea
                                id="co-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Una increíble escultura con..."
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="co-images">Imágenes de referencia</Label>
                            <label
                                htmlFor="co-images"
                                className="flex h-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground/60 text-muted-foreground transition-colors hover:bg-accent"
                            >
                                <ImagePlus className="size-6" />
                                <span className="sr-only">Subir imágenes</span>
                            </label>
                            <input
                                id="co-images"
                                type="file"
                                accept="image/*"
                                multiple
                                className="sr-only"
                                onChange={handleFiles}
                            />

                            {files.length > 0 && (
                                <ul className="flex flex-col gap-1 text-xs">
                                    {files.map((f, i) => (
                                        <li
                                            key={`${f.name}-${i}`}
                                            className="flex items-center justify-between rounded-md bg-background px-3 py-1.5"
                                        >
                                            <span className="truncate">{f.name}</span>
                                            <button
                                                type="button"
                                                aria-label={`Quitar ${f.name}`}
                                                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                                                className="ml-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <Button type="submit" disabled={sending} className="mt-2 w-full">
                            {sending ? "Enviando..." : "Enviar"}
                            <Send />
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
