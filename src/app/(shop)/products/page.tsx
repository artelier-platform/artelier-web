import type { Metadata } from "next";
import Link from "next/link";

import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { filterBySearch, groupByCategory } from "@/lib/catalog";
import { getAllCategories } from "@/server/categories/categories.service";
import { getAllProducts } from "@/server/products/products.service";
import type { Category, Product } from "@/types";

export const metadata: Metadata = { title: "Catálogo" };

// Se piden todos los productos de una vez para agruparlos por categoría.
// TODO: si el catálogo supera este número, paginar por categoría.
const PAGE_SIZE = 100;

async function loadCatalog(): Promise<{ products: Product[]; categories: Category[] } | null> {
    try {
        const [productsRes, categoriesRes] = await Promise.all([
            getAllProducts({ page: 0, size: PAGE_SIZE }),
            getAllCategories(),
        ]);

        return {
            products: (productsRes.data?.content ?? []).filter((p) => p.isActive !== false),
            categories: categoriesRes.data ?? [],
        };
    } catch {
        return null;
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string | string[] }>;
}) {
    const raw = (await searchParams).search;
    const search = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";

    const catalog = await loadCatalog();

    if (!catalog) {
        return (
            <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
                <h1 className="font-heading text-4xl font-medium">No pudimos cargar el catálogo</h1>
                <p className="text-sm text-muted-foreground">
                    Puede ser un problema momentáneo. Inténtalo de nuevo en unos segundos.
                </p>
                <Button asChild>
                    <Link href="/products">Reintentar</Link>
                </Button>
            </div>
        );
    }

    const visible = filterBySearch(catalog.products, search);
    const sections = groupByCategory(visible, catalog.categories);

    return (
        <div className="mx-auto max-w-[1440px] px-6 py-10">
            <header className="mb-10 flex flex-col gap-1">
                <h1 className="font-heading text-5xl font-medium">
                    {search ? `Resultados para “${search}”` : "Catálogo"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {visible.length} {visible.length === 1 ? "producto" : "productos"}
                    {search && (
                        <>
                            {" · "}
                            <Link href="/products" className="underline underline-offset-4 hover:text-foreground">
                                Ver todo el catálogo
                            </Link>
                        </>
                    )}
                </p>
            </header>

            {sections.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    {search ? "No encontramos productos con esa búsqueda." : "Aún no hay productos disponibles."}
                </p>
            ) : (
                sections.map((section, i) => (
                    <section key={section.id} aria-labelledby={`cat-${section.id}`}>
                        {i > 0 && <Separator className="my-10" />}

                        <h2 id={`cat-${section.id}`} className="mb-6 font-heading text-4xl font-medium">
                            {section.name}
                        </h2>

                        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {section.products.map((product) => (
                                <li key={product.id}>
                                    <ProductCard product={product} />
                                </li>
                            ))}
                        </ul>
                    </section>
                ))
            )}
        </div>
    );
}
