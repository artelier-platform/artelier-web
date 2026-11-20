import { describe, expect, it } from "vitest";

import { getSlideContent, getSlides, resolveButtonLink } from "@/lib/banners";
import type { Banner, BannerItem } from "@/types";

const IMAGE = "https://res.cloudinary.com/demo/image/upload/a.jpg";

/** Builds an active item with every `show*` flag off; override what each test needs. */
function item(overrides: Partial<BannerItem> = {}): BannerItem {
    return {
        id: "item",
        isActive: true,
        sortOrder: 1,
        backgroundImageUrl: IMAGE,
        showTitle: false,
        showDescription: false,
        showButton: false,
        ...overrides,
    } as BannerItem;
}

function banner(items: BannerItem[], overrides: Partial<Banner> = {}): Banner {
    return {
        id: "banner",
        isActive: true,
        createdAt: "2026-01-15T10:30:00Z",
        items,
        ...overrides,
    } as Banner;
}

describe("getSlides", () => {
    it("returns nothing when there are no banners", () => {
        expect(getSlides([])).toEqual([]);
    });

    it("returns nothing when the banner has no items", () => {
        expect(getSlides([banner([])])).toEqual([]);
    });

    it("skips inactive banners", () => {
        const result = getSlides([banner([item()], { isActive: false })]);
        expect(result).toEqual([]);
    });

    it("skips inactive items", () => {
        const result = getSlides([banner([item({ id: "a", isActive: false }), item({ id: "b" })])]);
        expect(result.map((s) => s.id)).toEqual(["b"]);
    });

    it("skips items without a background image", () => {
        const result = getSlides([
            banner([item({ id: "model", backgroundImageUrl: undefined }), item({ id: "image" })]),
        ]);
        expect(result.map((s) => s.id)).toEqual(["image"]);
    });

    it("orders items by sortOrder inside a banner", () => {
        const result = getSlides([
            banner([item({ id: "c", sortOrder: 3 }), item({ id: "a", sortOrder: 1 }), item({ id: "b", sortOrder: 2 })]),
        ]);
        expect(result.map((s) => s.id)).toEqual(["a", "b", "c"]);
    });

    it("flattens the items of several active banners", () => {
        const result = getSlides([
            banner([item({ id: "a1", sortOrder: 2 }), item({ id: "a0", sortOrder: 1 })], { id: "first" }),
            banner([item({ id: "b1" })], { id: "second" }),
        ]);
        expect(result.map((s) => s.id)).toEqual(["a0", "a1", "b1"]);
    });

    it("does not mutate the banners it receives", () => {
        const items = [item({ id: "b", sortOrder: 2 }), item({ id: "a", sortOrder: 1 })];
        getSlides([banner(items)]);
        expect(items.map((i) => i.id)).toEqual(["b", "a"]);
    });
});

describe("getSlideContent (show* flags)", () => {
    const filled = {
        title: "Handmade Ceramics",
        description: "Pieces crafted by local artisans",
        buttonLabel: "Shop now",
        buttonUrl: "/products",
    };

    it("shows nothing when every flag is off, even if the texts exist", () => {
        const content = getSlideContent(item(filled));
        expect(content).toEqual({ title: null, description: null, button: null });
    });

    it("shows only the title when only showTitle is on", () => {
        const content = getSlideContent(item({ ...filled, showTitle: true }));
        expect(content).toEqual({ title: "Handmade Ceramics", description: null, button: null });
    });

    it("shows only the description when only showDescription is on", () => {
        const content = getSlideContent(item({ ...filled, showDescription: true }));
        expect(content).toEqual({ title: null, description: "Pieces crafted by local artisans", button: null });
    });

    it("shows only the button when only showButton is on", () => {
        const content = getSlideContent(item({ ...filled, showButton: true }));
        expect(content).toEqual({
            title: null,
            description: null,
            button: { label: "Shop now", href: "/products", external: false },
        });
    });

    it("shows everything when every flag is on", () => {
        const content = getSlideContent(
            item({ ...filled, showTitle: true, showDescription: true, showButton: true })
        );
        expect(content.title).toBe("Handmade Ceramics");
        expect(content.description).toBe("Pieces crafted by local artisans");
        expect(content.button).not.toBeNull();
    });

    it("drops the title when the flag is on but the text is blank", () => {
        const content = getSlideContent(item({ title: "   ", showTitle: true }));
        expect(content.title).toBeNull();
    });

    it("drops the button when showButton is on but the label is missing", () => {
        const content = getSlideContent(item({ buttonUrl: "/products", showButton: true }));
        expect(content.button).toBeNull();
    });

    it("drops the button when showButton is on but the URL is missing", () => {
        const content = getSlideContent(item({ buttonLabel: "Shop now", showButton: true }));
        expect(content.button).toBeNull();
    });

    it("drops the button when the URL is unsafe", () => {
        const content = getSlideContent(
            item({ buttonLabel: "Click", buttonUrl: "javascript:alert(1)", showButton: true })
        );
        expect(content.button).toBeNull();
    });

    it("treats null fields sent by the backend like missing ones", () => {
        const content = getSlideContent(
            item({
                title: null,
                description: null,
                buttonLabel: null,
                buttonUrl: null,
                showTitle: true,
                showDescription: true,
                showButton: true,
            } as unknown as Partial<BannerItem>)
        );
        expect(content).toEqual({ title: null, description: null, button: null });
    });
});

describe("resolveButtonLink", () => {
    it("treats site paths as internal links", () => {
        expect(resolveButtonLink("/products")).toEqual({ href: "/products", external: false });
    });

    it("treats http and https URLs as external links", () => {
        expect(resolveButtonLink("https://example.com/promo")).toEqual({
            href: "https://example.com/promo",
            external: true,
        });
        expect(resolveButtonLink("http://example.com")).toEqual({ href: "http://example.com", external: true });
    });

    it("trims surrounding spaces", () => {
        expect(resolveButtonLink("  /products  ")).toEqual({ href: "/products", external: false });
    });

    it("rejects dangerous protocols", () => {
        expect(resolveButtonLink("javascript:alert(1)")).toBeNull();
        expect(resolveButtonLink("data:text/html,<script>alert(1)</script>")).toBeNull();
    });

    it("rejects protocol-relative URLs", () => {
        expect(resolveButtonLink("//evil.example.com")).toBeNull();
    });

    it("rejects paths the browser would read as another host", () => {
        expect(resolveButtonLink("/\\evil.example.com")).toBeNull();
        expect(resolveButtonLink("/\t/evil.example.com")).toBeNull();
    });

    it("rejects malformed and empty values", () => {
        expect(resolveButtonLink("products")).toBeNull();
        expect(resolveButtonLink("")).toBeNull();
        expect(resolveButtonLink("   ")).toBeNull();
        expect(resolveButtonLink(undefined)).toBeNull();
        expect(resolveButtonLink(null)).toBeNull();
    });
});