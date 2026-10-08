"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

import ProductStatusBadge from "@/components/shop/ProductStatusBadge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getProductStatus } from "@/lib/product-status";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import type { ProductWithRating } from "@/types/pending";

const MAX_QTY = 99;

/** Tarjeta de producto (Figma > Product Card). */
export default function ProductCard({ product }: { product: ProductWithRating }) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((s) => s.addItem);
    const openCart = useUIStore((s) => s.openCart);

    const status = getProductStatus(product);
    const soldOut = status === "SOLD_OUT";
    const max = product.stockType === "AVAILABLE" ? Math.max(product.stockQuantity ?? 1, 1) : MAX_QTY;

    const image = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
    const href = `/products/${product.slug}`;
    const rating = product.averageRating;

    function handleAdd() {
        if (!product.id || soldOut) return;
        addItem(product, quantity);
        toast.success(`${product.name} agregado al carrito`, {
            action: { label: "Ver carrito", onClick: openCart },
        });
        setQuantity(1);
    }

    return (
        <article className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
            <div className="relative aspect-[16/10] bg-muted">
                <Link href={href} aria-label={product.name} className="absolute inset-0">
                    {image?.url && (
                        <Image
                            src={image.url}
                            alt={product.name ?? "Producto"}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            unoptimized
                            className="object-cover"
                        />
                    )}
                </Link>
                <ProductStatusBadge status={status} className="absolute bottom-3 left-3" />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <Link href={href} className="line-clamp-1 font-heading text-2xl font-medium hover:underline">
                    {product.name}
                </Link>

                <p className="font-heading text-3xl font-medium">{formatPrice(product.price)}</p>

                {typeof rating === "number" && (
                    <p className="flex items-center gap-1.5 text-xs">
                        <span>{rating.toFixed(1)}</span>
                        <Star className="size-4 fill-secondary text-secondary" aria-label="estrellas" />
                    </p>
                )}

                <div className="mt-auto flex items-center gap-2 pt-2">
                    <div className="flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm">
                        <button
                            type="button"
                            aria-label="Aumentar cantidad"
                            disabled={soldOut || quantity >= max}
                            onClick={() => setQuantity((q) => Math.min(q + 1, max))}
                            className="flex h-5 w-8 items-center justify-center hover:bg-accent disabled:opacity-40"
                        >
                            <ChevronUp className="size-4" />
                        </button>
                        <button
                            type="button"
                            aria-label="Disminuir cantidad"
                            disabled={soldOut || quantity <= 1}
                            onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                            className="flex h-5 w-8 items-center justify-center hover:bg-accent disabled:opacity-40"
                        >
                            <ChevronDown className="size-4" />
                        </button>
                    </div>

                    <span className="w-5 text-center text-xs" aria-live="polite">
                        {quantity}
                    </span>

                    <Button onClick={handleAdd} disabled={soldOut} className="flex-1">
                        Agregar al carrito
                        <ShoppingCart />
                    </Button>
                </div>
            </div>
        </article>
    );
}
