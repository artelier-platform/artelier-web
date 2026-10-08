"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProductStatus } from "@/lib/product-status";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import type { Product } from "@/types";

const MAX_QTY = 99;

/** Selector de cantidad + Comprar (agrega y va al checkout) + Agregar al carrito (abre el carrito lateral). */
export default function ProductPurchase({ product }: { product: Product }) {
    const router = useRouter();
    const addItem = useCartStore((s) => s.addItem);
    const openCart = useUIStore((s) => s.openCart);
    const [quantity, setQuantity] = useState(1);

    const soldOut = getProductStatus(product) === "SOLD_OUT";
    const max = product.stockType === "AVAILABLE" ? Math.max(product.stockQuantity ?? 1, 1) : MAX_QTY;

    function add(): boolean {
        if (!product.id || soldOut) return false;
        addItem(product, quantity);
        return true;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <span id="qty-label" className="text-sm font-medium">
                    Cantidad
                </span>
                <div role="group" aria-labelledby="qty-label" className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Disminuir cantidad"
                        disabled={soldOut || quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    >
                        <Minus />
                    </Button>
                    <span className="w-10 text-center text-sm font-medium" aria-live="polite">
                        {quantity}
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Aumentar cantidad"
                        disabled={soldOut || quantity >= max}
                        onClick={() => setQuantity((q) => Math.min(q + 1, max))}
                    >
                        <Plus />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                    type="button"
                    size="lg"
                    disabled={soldOut}
                    className="flex-1"
                    onClick={() => add() && router.push("/checkout")}
                >
                    {soldOut ? "Agotado" : "Comprar"}
                </Button>
                <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    disabled={soldOut}
                    className="flex-1"
                    onClick={() => add() && openCart()}
                >
                    Agregar al carrito
                    <ShoppingCart />
                </Button>
            </div>
        </div>
    );
}
