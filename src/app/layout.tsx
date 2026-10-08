import { Inter, Cormorant_Garamond } from "next/font/google";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-cormorant",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "Artelier Cajicá — Artesanías hechas a mano",
        template: "%s | Artelier Cajicá",
    },
    description:
        "Artesanías únicas hechas a mano en Cajicá, Colombia. Cerámica, textiles y pintura con historia.",
    openGraph: {
        siteName: "Artelier Cajicá",
        locale: "es_CO",
        type: "website",
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html
            lang="es"
            suppressHydrationWarning
            className={cn("h-full antialiased", inter.variable, cormorant.variable)}
        >
            <body className="flex min-h-full flex-col bg-background text-foreground">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <AuthProvider>{children}</AuthProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
