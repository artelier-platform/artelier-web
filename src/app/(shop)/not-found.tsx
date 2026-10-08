import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ShopNotFound() {
    return (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
            <h1 className="font-heading text-5xl font-medium">No encontramos esto</h1>
            <p className="text-sm text-muted-foreground">
                El producto o la página que buscas no existe o ya no está disponible.
            </p>
            <Button asChild>
                <Link href="/products">Ver catálogo</Link>
            </Button>
        </div>
    );
}
