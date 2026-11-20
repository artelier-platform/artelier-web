"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSlideContent, getSlides, type Slide } from "@/lib/banners";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types";

/**
 * Props accepted by the {@link BannerCarousel} component.
 */
type Props = Readonly<{
    /** Raw banner collections used to derive renderable carousel slides. */
    banners: Banner[];
    /** Autoplay interval in milliseconds; set to `0` to disable automatic slide transitions. */
    autoPlayMs?: number;
    /** Optional additional CSS classes applied to the outer carousel container. */
    className?: string;
}>;

/**
 * Props accepted by the internal {@link SlideCard} component.
 */
type SlideCardProps = Readonly<{
    /** Normalized slide entity with a guaranteed background image URL. */
    slide: Slide;
    /** Zero-based index of the slide within the carousel. */
    position: number;
    /** Total number of slides in the carousel. */
    total: number;
    /** Whether this slide is currently visible and active. */
    active: boolean;
}>;

/**
 * Props accepted by the internal {@link CarouselControls} component.
 */
type CarouselControlsProps = Readonly<{
    /** Callback invoked to navigate to the previous slide. */
    onPrev: () => void;
    /** Callback invoked to navigate to the next slide. */
    onNext: () => void;
}>;

/**
 * Renders an individual carousel slide inside a reset `<fieldset>` with its
 * full-bleed background image and optional overlay content gated by `getSlideContent`.
 *
 * Execution flow:
 * 1. Derives visible `title`, `description`, and `button` data via {@link getSlideContent}.
 * 2. Toggles slide opacity and `inert` state based on `active` so inactive slides are non-interactive.
 * 3. Renders the background image (`priority` enabled on the first slide) and an overlay card
 *    only when at least one content element is active, using `<a>` for external links and
 *    Next.js `<Link>` for internal paths.
 *
 * @param props - Slide data, zero-based index, total slide count, and active visibility flag.
 * @returns JSX element representing a single slide.
 */
function SlideCard({ slide, position, total, active }: SlideCardProps) {
    const { title, description, button } = getSlideContent(slide);
    const hasOverlay = Boolean(title || description || button);

    return (
        <fieldset
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${total}`}
            inert={!active}
            className={cn(
                "absolute inset-0 m-0 min-w-0 border-0 p-0 transition-opacity duration-500",
                active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
        >
            <Image
                src={slide.backgroundImageUrl}
                alt={title ?? ""}
                fill
                priority={position === 0}
                sizes="100vw"
                unoptimized
                className="object-cover"
            />

            {hasOverlay && (
                <div className="absolute top-1/2 left-[6%] flex w-[min(20rem,80%)] -translate-y-1/2 flex-col gap-2
                rounded-sm bg-card p-4 text-card-foreground shadow-md">
                    {title && <h2 className="font-heading text-2xl font-medium">{title}</h2>}
                    {description && <p className="text-xs leading-relaxed">{description}</p>}
                    {button && (
                        <Button asChild size="sm" className="mt-1 w-full">
                            {button.external ? (
                                <a href={button.href} target="_blank" rel="noopener noreferrer">
                                    {button.label}
                                </a>
                            ) : (
                                <Link href={button.href}>{button.label}</Link>
                            )}
                        </Button>
                    )}
                </div>
            )}
        </fieldset>
    );
}

/**
 * Renders previous/next slide navigation buttons overlaid on the carousel edges.
 *
 * @param props - Handlers for stepping backward or forward through slides.
 * @returns JSX fragment containing the previous and next slide buttons.
 */
function CarouselControls({ onPrev, onNext }: CarouselControlsProps) {
    return (
        <>
            <button
                type="button"
                aria-label="Previous slide"
                onClick={onPrev}
                className="absolute top-1/2 left-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full
                 bg-black/30 text-white transition-colors hover:bg-black/50"
            >
                <ChevronLeft className="size-5" />
            </button>
            <button
                type="button"
                aria-label="Next slide"
                onClick={onNext}
                className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center
                rounded-full bg-black/30 text-white transition-colors hover:bg-black/50"
            >
                <ChevronRight className="size-5" />
            </button>
        </>
    );
}

/**
 * Client carousel component for promotional and announcement banners.
 *
 * Execution flow:
 * 1. Extracts and orders renderable slides from `banners` using {@link getSlides}; returns `null` if empty.
 * 2. Tracks the current `index` (normalized to `safeIndex` via modulo arithmetic) and `paused` hover/focus state.
 * 3. Runs a `setInterval` timer when `count >= 2`, `!paused`, `autoPlayMs > 0`, and the user has not
 *    enabled `prefers-reduced-motion: reduce`, cleaning up the interval on unmount or dependency change.
 * 4. Renders all slides as stacked cross-fading `SlideCard` items plus navigation controls when multiple
 *    slides exist, pausing autoplay on mouse hover or keyboard focus within the carousel.
 *
 * @param props - Banner list, optional autoplay interval in milliseconds, and custom container classes.
 * @returns Carousel `<section>` element, or `null` when no active slides are available.
 */
export default function BannerCarousel({ banners, autoPlayMs = 6000, className }: Props) {
    const slides = getSlides(banners);
    const count = slides.length;

    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const safeIndex = count > 0 ? index % count : 0;

    const go = useCallback(
        (dir: 1 | -1) => {
            if (count <= 1) return;
            setIndex((current) => ((current % count) + dir + count) % count);
        },
        [count]
    );

    useEffect(() => {
        if (count < 2 || paused || !autoPlayMs) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const intervalId = setInterval(() => go(1), autoPlayMs);
        return () => clearInterval(intervalId);
    }, [count, paused, autoPlayMs, go]);

    if (count === 0) return null;

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Featured announcements"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className={cn(
                "relative aspect-4/3 w-full overflow-hidden bg-muted sm:aspect-video lg:max-h-150",
                className
            )}
        >
            {slides.map((slide, i) => (
                <SlideCard
                    key={slide.id}
                    slide={slide}
                    position={i}
                    total={count}
                    active={i === safeIndex}
                />
            ))}

            {count > 1 && <CarouselControls onPrev={() => go(-1)} onNext={() => go(1)} />}
        </section>
    );
}