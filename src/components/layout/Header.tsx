"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    Package,
    Search,
    ShoppingCart,
    User,
    UserPlus,
    X,
} from "lucide-react";

import CustomOrderTrigger from "@/components/shop/CustomOrderTrigger";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useHydrated } from "@/hooks/useHydrated";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";

function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" aria-label="Artelier — inicio" className={className}>
            <Image
                src="/images/logo-horizontal.svg"
                alt="Artelier"
                width={162}
                height={60}
                priority
                className="h-12 w-auto md:h-[60px] dark:hidden"
            />
            <Image
                src="/images/logo-horizontal-negativo.svg"
                alt="Artelier"
                width={162}
                height={60}
                priority
                className="hidden h-12 w-auto md:h-[60px] dark:block"
            />
        </Link>
    );
}

function SearchBar({ className, onSubmitted }: { className?: string; onSubmitted?: () => void }) {
    const router = useRouter();
    const [query, setQuery] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;
        // TODO(backend): GET /products todavía no acepta `search` (ver docs/backend-pendiente.md)
        router.push(`/products?search=${encodeURIComponent(q)}`);
        onSubmitted?.();
    }

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className={cn(
                "flex h-10 items-center rounded-full border border-border bg-card pr-2 pl-6 shadow-md",
                className
            )}
        >
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar"
                aria-label="Buscar productos"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-foreground"
            />
            {query && (
                <button
                    type="button"
                    aria-label="Borrar búsqueda"
                    onClick={() => setQuery("")}
                    className="flex size-7 items-center justify-center rounded-full text-foreground hover:bg-accent"
                >
                    <X className="size-4" />
                </button>
            )}
            <span aria-hidden className="mx-2 h-6 w-px bg-border" />
            <button
                type="submit"
                aria-label="Buscar"
                className="flex size-7 items-center justify-center rounded-full text-foreground hover:bg-accent"
            >
                <Search className="size-4" />
            </button>
        </form>
    );
}

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, role, logout } = useAuth();
    const hydrated = useHydrated();
    const cartCount = useCartStore((s) => s.itemCount());
    const openCart = useUIStore((s) => s.openCart);
    const openAuth = useUIStore((s) => s.openAuth);
    const [menuOpen, setMenuOpen] = useState(false);

    const count = hydrated ? cartCount : 0;

    function isActive(href: string) {
        return href === "/" ? pathname === "/" : pathname.startsWith(href);
    }

    async function handleLogout() {
        await logout();
        router.push("/");
        router.refresh();
    }

    const itemClass =
        "block rounded-md px-5 py-2.5 text-base font-medium transition-colors hover:bg-accent";

    return (
        <header className="sticky top-0 z-40 rounded-b-md border border-t-0 border-border bg-card shadow-md">
            <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-4 py-2 md:grid-cols-[1fr_auto_1fr] md:px-6">
                <Logo className="justify-self-start" />

                <SearchBar className="hidden w-[min(500px,40vw)] md:flex" />

                <div className="flex items-center justify-self-end">
                    {/* Carrito */}
                    <div className="flex items-center px-2 md:border-r md:border-border md:px-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={openCart}
                            aria-label={`Abrir carrito, ${count} productos`}
                            className="relative"
                        >
                            <ShoppingCart />
                            {count > 0 && (
                                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
                                    {count > 9 ? "9+" : count}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Usuario */}
                    <div className="flex items-center px-2 md:px-3">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Cuenta"
                                    className={cn("size-10 rounded-full", isAuthenticated && "ring-2 ring-secondary")}
                                >
                                    <User />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                {isAuthenticated ? (
                                    <>
                                        {role === "ADMIN" && (
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin" className="cursor-pointer gap-2">
                                                    <LayoutDashboard className="size-4" /> Panel de administración
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/account/orders" className="cursor-pointer gap-2">
                                                <Package className="size-4" /> Mis pedidos
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2">
                                            <LogOut className="size-4" /> Cerrar sesión
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={() => openAuth("login")} className="cursor-pointer gap-2">
                                            <LogIn className="size-4" /> Iniciar sesión
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openAuth("register")} className="cursor-pointer gap-2">
                                            <UserPlus className="size-4" /> Registrarse
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Menú móvil (no hay mockup: patrón estándar hamburguesa + panel) */}
                    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Abrir menú" className="md:hidden">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex w-80 flex-col gap-6 bg-card">
                            <SheetHeader>
                                <SheetTitle className="font-heading text-2xl font-medium">Artelier</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 px-4">
                                <SearchBar onSubmitted={() => setMenuOpen(false)} />
                                <ul className="flex flex-col">
                                    {NAV_LINKS.map((item) => (
                                        <li key={item.label}>
                                            {item.href ? (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    className={itemClass}
                                                >
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                <CustomOrderTrigger
                                                    onClick={() => setMenuOpen(false)}
                                                    className={cn(itemClass, "w-full text-left")}
                                                >
                                                    {item.label}
                                                </CustomOrderTrigger>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Navegación (escritorio) */}
            <nav aria-label="Principal" className="hidden justify-center pb-2 md:flex">
                <ul className="flex items-center">
                    {NAV_LINKS.map((item, i) => (
                        <li
                            key={item.label}
                            className={cn(i < NAV_LINKS.length - 1 && "border-r border-border")}
                        >
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    aria-current={isActive(item.href) ? "page" : undefined}
                                    className={cn(
                                        itemClass,
                                        isActive(item.href) &&
                                            "underline decoration-secondary decoration-2 underline-offset-8"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <CustomOrderTrigger className={itemClass}>{item.label}</CustomOrderTrigger>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}
