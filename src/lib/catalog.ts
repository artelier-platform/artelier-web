import type { Category, Product } from "@/types";

export type CatalogSection = {
    id: string;
    name: string;
    products: Product[];
};

const OTHER_ID = "other";

function normalize(text: string | undefined) {
    return (text ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

/**
 * Búsqueda local (sin tildes ni mayúsculas) por nombre, descripción y categoría.
 * TODO(backend): reemplazar por el parámetro `search` de GET /products cuando exista.
 */
export function filterBySearch(products: Product[], search: string): Product[] {
    const q = normalize(search.trim());
    if (!q) return products;
    return products.filter((p) =>
        normalize(`${p.name} ${p.description ?? ""} ${p.category?.name ?? ""}`).includes(q)
    );
}

/** Agrupa por categoría respetando el orden de la lista de categorías. Las categorías vacías no aparecen. */
export function groupByCategory(products: Product[], categories: Category[]): CatalogSection[] {
    const byId = new Map<string, Product[]>();
    for (const p of products) {
        const key = p.category?.id ?? OTHER_ID;
        const list = byId.get(key);
        if (list) list.push(p);
        else byId.set(key, [p]);
    }

    const sections: CatalogSection[] = [];
    for (const c of categories) {
        const list = c.id ? byId.get(c.id) : undefined;
        if (c.id && list?.length) {
            sections.push({ id: c.id, name: c.name ?? "Sin nombre", products: list });
        }
    }

    // Productos cuya categoría no vino en la lista de categorías
    const used = new Set(sections.map((s) => s.id));
    const rest = [...byId.entries()].filter(([key]) => !used.has(key)).flatMap(([, list]) => list);
    if (rest.length) sections.push({ id: OTHER_ID, name: "Otros", products: rest });

    return sections;
}
