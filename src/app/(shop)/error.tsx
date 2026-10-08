"use client";

import { Button } from "@/components/ui/button";

export default function ShopError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
            <h1 className="font-heading text-4xl font-medium">Algo salió mal</h1>
            <p className="text-sm text-muted-foreground">
                No pudimos cargar esta página. Puede ser momentáneo: inténtalo de nuevo.
            </p>
            <Button onClick={reset}>Reintentar</Button>
        </div>
    );
}
