import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import { ChevronLeft, Star } from "lucide-react";

import ProductGallery from "@/components/shop/ProductGallery";
import ProductPurchase from "@/components/shop/ProductPurchase";
import ProductStatusBadge from "@/components/shop/ProductStatusBadge";
import { formatPrice } from "@/lib/format";
import { getProductStatus } from "@/lib/product-status";
import { getProductBySlug } from "@/server/products/products.service";
import type { ProductWithRating } from "@/types/pending";

// cache() evita pedir el producto dos veces (metadata + página) en la misma petición
const loadProduct = cache(async (slug: string): Promise<ProductWithRating | null> => {
    try {
        const res = await getProductBySlug(slug);
        const product = res.data;
        return product && product.isActive !== false ? product : null;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) return null;
        throw error; // otros fallos (backend dormido, red) los atrapa (shop)/error.tsx
    }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await loadProduct(slug);
    if (!product) return { title: "Producto no encontrado" };

    return {
        title: product.name,
        description: product.description?.slice(0, 160),
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await loadProduct(slug);
    if (!product) notFound();

    const status = getProductStatus(product);
    const rating = product.averageRating;

    return (
        <div className="mx-auto max-w-[1200px] px-6 py-10">
            <Link
                href="/products"
                className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ChevronLeft className="size-4" />
                Volver al catálogo
            </Link>

            <div className="grid gap-10 md:grid-cols-2">
                <ProductGallery images={product.images ?? []} name={product.name ?? "Producto"} />

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        {product.category?.name && (
                            <Link
                                href={`/products#cat-${product.category.id}`}
                                className="w-fit text-xs font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
                            >
                                {product.category.name}
                            </Link>
                        )}
                        <h1 className="font-heading text-5xl leading-tight font-medium">{product.name}</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <p className="font-heading text-4xl font-medium">{formatPrice(product.price)}</p>
                        <ProductStatusBadge status={status} />
                    </div>

                    {typeof rating === "number" && (
                        <p className="flex items-center gap-1.5 text-sm">
                            <span className="font-medium">{rating.toFixed(1)}</span>
                            <Star className="size-4 fill-secondary text-secondary" aria-label="estrellas" />
                            {!!product.reviewCount && (
                                <span className="text-muted-foreground">
                                    ({product.reviewCount} {product.reviewCount === 1 ? "reseña" : "reseñas"})
                                </span>
                            )}
                        </p>
                    )}

                    {product.description && (
                        <p className="text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
                    )}

                    <ProductPurchase product={product} />

                    {product.story && (
                        <section className="border-t border-border pt-5">
                            <h2 className="mb-2 font-heading text-2xl font-medium">Su historia</h2>
                            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                                {product.story}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
