"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";

/** Carrito lateral (Figma > Cart Drawer). La edición de cantidades vive en /cart. */
export default function CartDrawer() {
    const open = useUIStore((s) => s.cartOpen);
    const setOpen = useUIStore((s) => s.setCartOpen);

    const items = useCartStore((s) => s.items);
    const removeItem = useCartStore((s) => s.removeItem);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const total = useCartStore((s) => s.total());

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="flex w-full flex-col gap-0 bg-card p-0 sm:max-w-md">
                <SheetHeader className="px-5 pt-5 pb-3">
                    <SheetTitle className="font-heading text-4xl font-medium">Mi Carrito</SheetTitle>
                    <SheetDescription className="sr-only">Productos que agregaste a tu carrito</SheetDescription>
                </SheetHeader>

                <Separator />

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
                        <ShoppingBag className="size-10 text-muted-foreground" strokeWidth={1.5} />
                        <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
                        <Button asChild variant="outline" onClick={() => setOpen(false)}>
                            <Link href="/products">Ver catálogo</Link>
                        </Button>
                    </div>
                ) : (
                    <ul className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
                        {items.map(({ product, quantity }) => {
                            const image = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
                            const max = product.stockType === "AVAILABLE" ? Math.max(product.stockQuantity ?? 1, 1) : 99;

                            return (
                                <li
                                    key={product.id}
                                    className="flex items-stretch overflow-hidden rounded-md border border-border bg-background shadow-md"
                                >
                                    <div className="relative w-24 shrink-0 bg-muted">
                                        {image?.url && (
                                            <Image
                                                src={image.url}
                                                alt={product.name ?? "Producto"}
                                                fill
                                                sizes="96px"
                                                unoptimized
                                                className="object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            onClick={() => setOpen(false)}
                                            className="truncate font-heading text-2xl leading-tight font-medium hover:underline"
                                        >
                                            {product.name}
                                        </Link>
                                        <p className="text-xs">Precio: {formatPrice(product.price)}</p>
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span>Cantidad:</span>
                                            <button
                                                type="button"
                                                aria-label="Disminuir cantidad"
                                                disabled={quantity <= 1}
                                                onClick={() => product.id && updateQuantity(product.id, quantity - 1)}
                                                className="flex size-5 items-center justify-center rounded border border-border hover:bg-accent disabled:opacity-40"
                                            >
                                                <Minus className="size-3" />
                                            </button>
                                            <span className="w-4 text-center" aria-live="polite">
                                                {quantity}
                                            </span>
                                            <button
                                                type="button"
                                                aria-label="Aumentar cantidad"
                                                disabled={quantity >= max}
                                                onClick={() => product.id && updateQuantity(product.id, quantity + 1)}
                                                className="flex size-5 items-center justify-center rounded border border-border hover:bg-accent disabled:opacity-40"
                                            >
                                                <Plus className="size-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        aria-label={`Quitar ${product.name ?? "producto"} del carrito`}
                                        onClick={() => product.id && removeItem(product.id)}
                                        className="flex w-12 shrink-0 items-center justify-center text-foreground transition-colors hover:text-destructive"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <div className="mt-auto flex flex-col gap-3 border-t border-border px-5 py-4">
                    <div className="flex items-center justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    {items.length > 0 && (
                        <Button asChild size="lg" className="w-full" onClick={() => setOpen(false)}>
                            <Link href="/checkout">Checkout</Link>
                        </Button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
