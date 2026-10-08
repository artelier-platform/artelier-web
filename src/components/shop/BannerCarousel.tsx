"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types/pending";

type Props = {
    banners: Banner[];
    /** Milisegundos entre slides. 0 desactiva el avance automático. */
    autoPlayMs?: number;
    className?: string;
};

/** Carrusel de avisos (Figma > Carosel). Avanza solo, se pausa con el mouse y respeta "reducir movimiento". */
export default function BannerCarousel({ banners, autoPlayMs = 6000, className }: Props) {
    const slides = banners.filter((b) => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
    const count = slides.length;

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + count) % count), [count]);

    useEffect(() => {
        if (count < 2 || paused || !autoPlayMs) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(() => go(1), autoPlayMs);
        return () => clearInterval(id);
    }, [count, paused, autoPlayMs, go]);

    if (count === 0) return null;

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Avisos destacados"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={cn("relative aspect-[4/3] w-full overflow-hidden bg-muted sm:aspect-[16/9] lg:max-h-[600px]", className)}
        >
            {slides.map((slide, i) => (
                <div
                    key={slide.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} de ${count}`}
                    inert={i !== index}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        i === index ? "opacity-100" : "pointer-events-none opacity-0"
                    )}
                >
                    <Image
                        src={slide.imageUrl}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        unoptimized
                        className="object-cover"
                    />

                    <div className="absolute top-1/2 left-[6%] flex w-[min(20rem,80%)] -translate-y-1/2 flex-col gap-2 rounded-sm bg-card p-4 text-card-foreground shadow-md">
                        <h2 className="font-heading text-2xl font-medium">{slide.title}</h2>
                        <p className="text-xs leading-relaxed">{slide.description}</p>
                        {slide.buttonLabel && slide.buttonUrl && (
                            <Button asChild size="sm" className="mt-1 w-full">
                                <Link href={slide.buttonUrl}>{slide.buttonLabel}</Link>
                            </Button>
                        )}
                    </div>
                </div>
            ))}

            {count > 1 && (
                <>
                    <button
                        type="button"
                        aria-label="Aviso anterior"
                        onClick={() => go(-1)}
                        className="absolute top-1/2 left-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Aviso siguiente"
                        onClick={() => go(1)}
                        className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
                    >
                        <ChevronRight className="size-5" />
                    </button>
                </>
            )}
        </section>
    );
}
