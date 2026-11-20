// src/lib/banners.ts
import type { Banner, BannerItem } from "@/types";

/**
 * Banner item narrowed to guarantee a non-empty `backgroundImageUrl` for carousel rendering.
 */
export type Slide = BannerItem & {
    /** URL of the background image displayed on the slide. */
    backgroundImageUrl: string;
};

/**
 * Sanitized and visibility-filtered content fields rendered for a banner slide.
 */
export type SlideContent = {
    /** Slide heading text, or `null` when hidden or empty. */
    title: string | null;
    /** Slide supporting copy, or `null` when hidden or empty. */
    description: string | null;
    /** Action button configuration, or `null` when disabled, incomplete, or unsafe. */
    button: {
        /** Button display label. */
        label: string;
        /** Validated target path or URL. */
        href: string;
        /** Whether the target opens as an external `http(s)` link rather than a local route. */
        external: boolean;
    } | null;
};

/**
 * Normalizes a string by trimming whitespace and converting empty or missing values to `null`.
 *
 * @param value - Optional text value to sanitize.
 * @returns Trimmed non-empty string, or `null` if blank or absent.
 */
function clean(value?: string | null): string | null {
    const trimmed = value?.trim();
    return trimmed || null;
}

/**
 * Detects characters that browsers treat as URL separators or strip silently.
 *
 * Browsers interpret `\` as `/` and strip control characters (such as tabs or newlines)
 * inside URLs, meaning inputs like `"/\\evil.com"` or `"/\t/evil.com"` could be parsed as
 * protocol-relative URLs (`//evil.com`) and trigger an open redirect.
 *
 * @param value - Candidate path or URL string to inspect.
 * @returns `true` if the string contains a backslash or ASCII control characters (`0x00`–`0x1F` or `0x7F`).
 */
function hasUnsafeChars(value: string): boolean {
    return [...value].some((ch) => ch === "\\" || ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127);
}

/**
 * Flattens active banners and their renderable items into an ordered list of carousel slides.
 *
 * Execution flow:
 * 1. Filters out inactive banners (`!banner.isActive`) while preserving API banner order.
 * 2. Filters each banner's `items` to active entries (`item.isActive`) that include a `backgroundImageUrl`
 *    (skipping 3D-only or image-less items), narrowing them to {@link Slide}.
 * 3. Sorts items within each banner ascending by `sortOrder` (defaulting to `0`).
 * 4. Returns an empty array if no active slides are available.
 *
 * @param banners - List of banner entities returned by the backend or BFF.
 * @returns Ordered array of renderable {@link Slide} items.
 */
export function getSlides(banners: Banner[]): Slide[] {
    return banners
        .filter((banner) => banner.isActive)
        .flatMap((banner) =>
            banner.items
                .filter((item): item is Slide => Boolean(item.isActive) && Boolean(item.backgroundImageUrl))
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        );
}

/**
 * Validates and classifies a banner CTA URL into an internal path or an external `http(s)` link.
 *
 * Execution flow:
 * 1. Trims and normalizes `url`; returns `null` if empty or missing.
 * 2. Accepts single-leading-slash relative paths (excluding protocol-relative `//host` and values containing
 *    backslashes or control characters via {@link hasUnsafeChars}) as internal links (`external: false`).
 * 3. Parses remaining strings with `new URL(...)` and allows only `http:` and `https:` protocols (`external: true`).
 * 4. Rejects unsafe schemes (`javascript:`, `data:`), protocol-relative URLs, and malformed URLs by returning `null`.
 *
 * @param url - Candidate link URL or relative path.
 * @returns Resolved link metadata (`href` and `external` flag), or `null` if invalid or unsafe.
 */
export function resolveButtonLink(url?: string | null): { href: string; external: boolean } | null {
    const value = clean(url);
    if (!value) return null;

    if (value.startsWith("/") && !value.startsWith("//") && !hasUnsafeChars(value)) {
        return { href: value, external: false };
    }

    try {
        const { protocol } = new URL(value);
        if (protocol !== "https:" && protocol !== "http:") return null;
        return { href: value, external: true };
    } catch {
        return null;
    }
}

/**
 * Computes the visible, sanitized content for a slide according to its `show*` display flags.
 *
 * Execution flow:
 * 1. Evaluates `title` only when `slide.showTitle` is truthy and `slide.title` is non-blank.
 * 2. Evaluates `description` only when `slide.showDescription` is truthy and `slide.description` is non-blank.
 * 3. Evaluates `button` only when `slide.showButton` is truthy, `slide.buttonLabel` is non-blank,
 *    and `resolveButtonLink(slide.buttonUrl)` returns a valid/safe target.
 *
 * @param slide - Banner item containing content fields and `show*` visibility flags.
 * @returns Structured {@link SlideContent} ready for rendering.
 */
export function getSlideContent(slide: BannerItem): SlideContent {
    const title = slide.showTitle ? clean(slide.title) : null;
    const description = slide.showDescription ? clean(slide.description) : null;

    const label = slide.showButton ? clean(slide.buttonLabel) : null;
    const link = label ? resolveButtonLink(slide.buttonUrl) : null;

    return {
        title,
        description,
        button: label && link ? { label, ...link } : null,
    };
}