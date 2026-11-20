// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import BannerCarousel from "@/components/shop/BannerCarousel";
import type { Banner, BannerItem } from "@/types";

const IMAGE = "https://res.cloudinary.com/demo/image/upload/a.jpg";

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

function banner(items: BannerItem[]): Banner {
    return { id: "banner", isActive: true, createdAt: "2026-01-15T10:30:00Z", items } as Banner;
}

// autoPlayMs={0}: no timers and no matchMedia (jsdom doesn't implement it)
function renderCarousel(banners: Banner[]) {
    return render(<BannerCarousel banners={banners} autoPlayMs={0} />);
}

afterEach(cleanup);

describe("BannerCarousel", () => {
    it("renders nothing when there are no banners", () => {
        const { container } = renderCarousel([]);
        expect(container.firstChild).toBeNull();
    });

    it("renders nothing when the banner has no renderable items", () => {
        const { container } = renderCarousel([
            banner([item({ isActive: false }), item({ id: "model", backgroundImageUrl: undefined })]),
        ]);
        expect(container.firstChild).toBeNull();
    });

    it("hides title, description and button when their flags are off", () => {
        renderCarousel([
            banner([item({ title: "Hidden", description: "Hidden copy", buttonLabel: "Hidden CTA", buttonUrl: "/x" })]),
        ]);
        expect(screen.queryByText("Hidden")).toBeNull();
        expect(screen.queryByText("Hidden copy")).toBeNull();
        expect(screen.queryByText("Hidden CTA")).toBeNull();
    });

    it("shows the content whose flags are on", () => {
        renderCarousel([
            banner([
                item({
                    title: "Handmade Ceramics",
                    description: "Crafted by local artisans",
                    buttonLabel: "Shop now",
                    buttonUrl: "/products",
                    showTitle: true,
                    showDescription: true,
                    showButton: true,
                }),
            ]),
        ]);
        expect(screen.getByText("Handmade Ceramics")).toBeTruthy();
        expect(screen.getByText("Crafted by local artisans")).toBeTruthy();
        expect(screen.getByText("Shop now")).toBeTruthy();
    });

    it("opens external buttons in a new tab with noopener noreferrer", () => {
        renderCarousel([
            banner([item({ buttonLabel: "Promo", buttonUrl: "https://example.com/promo", showButton: true })]),
        ]);
        const link = screen.getByText("Promo").closest("a");
        expect(link?.getAttribute("href")).toBe("https://example.com/promo");
        expect(link?.getAttribute("target")).toBe("_blank");
        expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("keeps internal buttons in the same tab", () => {
        renderCarousel([banner([item({ buttonLabel: "Shop", buttonUrl: "/products", showButton: true })])]);
        const link = screen.getByText("Shop").closest("a");
        expect(link?.getAttribute("href")).toBe("/products");
        expect(link?.getAttribute("target")).toBeNull();
    });

    it("does not render a button for an unsafe URL", () => {
        renderCarousel([
            banner([item({ buttonLabel: "Evil", buttonUrl: "javascript:alert(1)", showButton: true })]),
        ]);
        expect(screen.queryByText("Evil")).toBeNull();
    });

    it("shows navigation controls only with two or more slides", () => {
        const { unmount } = renderCarousel([banner([item({ id: "a" })])]);
        expect(screen.queryByLabelText("Next slide")).toBeNull();
        unmount();

        renderCarousel([banner([item({ id: "a" }), item({ id: "b", sortOrder: 2 })])]);
        expect(screen.getByLabelText("Next slide")).toBeTruthy();
        expect(screen.getByLabelText("Previous slide")).toBeTruthy();
    });
});