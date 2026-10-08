"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type GalleryImage = NonNullable<Product["images"]>[number];

/** Imagen principal + miniaturas. La imagen marcada como principal va primero. */
export default function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
    const sorted = images
        .filter((i) => i.url)
        .sort((a, b) => Number(b.isPrimary ?? false) - Number(a.isPrimary ?? false));

    const [active, setActive] = useState(0);

    if (sorted.length === 0) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                <ImageOff className="size-10" strokeWidth={1.5} aria-label="Sin imagen" />
            </div>
        );
    }

    const current = sorted[Math.min(active, sorted.length - 1)];

    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted shadow-md">
                <Image
                    src={current.url!}
                    alt={name}
                    fill
                    priority
                    sizes="(min-width: 768px) 50vw, 100vw"
                    unoptimized
                    className="object-cover"
                />
            </div>

            {sorted.length > 1 && (
                <ul className="grid grid-cols-5 gap-3">
                    {sorted.map((img, i) => (
                        <li key={img.id ?? img.url}>
                            <button
                                type="button"
                                onClick={() => setActive(i)}
                                aria-label={`Ver imagen ${i + 1} de ${sorted.length}`}
                                aria-current={i === active}
                                className={cn(
                                    "relative block aspect-square w-full overflow-hidden rounded-md border bg-muted transition-opacity",
                                    i === active ? "border-secondary ring-2 ring-secondary" : "border-border opacity-70 hover:opacity-100"
                                )}
                            >
                                <Image
                                    src={img.url!}
                                    alt=""
                                    fill
                                    sizes="96px"
                                    unoptimized
                                    className="object-cover"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
