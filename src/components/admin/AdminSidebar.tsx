"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    ChevronLeft,
    Image as ImageIcon,
    LayoutDashboard,
    Package,
    ReceiptText,
    Sparkles,
    Tags,
    Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Productos", href: "/admin/products", icon: Package },
    { label: "Categorías", href: "/admin/categories", icon: Tags },
    { label: "Órdenes", href: "/admin/orders", icon: ReceiptText },
    { label: "Personalizados", href: "/admin/custom-orders", icon: Sparkles },
    { label: "Banners", href: "/admin/banners", icon: ImageIcon },
    { label: "Usuarios", href: "/admin/users", icon: Users },
] as const;

/** Barra lateral del admin (Figma > Admin sidebar). Se puede colapsar a solo íconos. */
export default function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    function isActive(href: string, exact?: boolean) {
        return exact ? pathname === href : pathname.startsWith(href);
    }

    return (
        <aside
            className={cn(
                "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card shadow-md transition-[width] duration-200 md:flex",
                collapsed ? "w-[72px]" : "w-64"
            )}
        >
            <div
                className={cn(
                    "flex border-b border-border p-4",
                    collapsed ? "flex-col items-center gap-3" : "items-start justify-between"
                )}
            >
                <Link href="/admin" aria-label="Artelier — panel de administración">
                    <Image
                        src="/images/isotipo.svg"
                        alt="Artelier"
                        width={64}
                        height={64}
                        className={cn("w-auto dark:hidden", collapsed ? "h-10" : "h-16")}
                    />
                    <Image
                        src="/images/isotipo-negativo.svg"
                        alt="Artelier"
                        width={64}
                        height={64}
                        className={cn("hidden w-auto dark:block", collapsed ? "h-10" : "h-16")}
                    />
                </Link>
                <button
                    type="button"
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
                    aria-expanded={!collapsed}
                    className="flex size-8 items-center justify-center rounded-md border border-border transition-colors hover:bg-accent"
                >
                    <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
                </button>
            </div>

            <nav aria-label="Administración" className="flex-1 overflow-y-auto p-3">
                <ul className="flex flex-col gap-1">
                    {ITEMS.map(({ label, href, icon: Icon, ...rest }) => {
                        const active = isActive(href, "exact" in rest ? rest.exact : false);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    title={collapsed ? label : undefined}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "flex items-center gap-4 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent",
                                        collapsed && "justify-center px-0",
                                        active && "bg-accent"
                                    )}
                                >
                                    <Icon className="size-5 shrink-0" strokeWidth={1.5} />
                                    <span className={cn(collapsed && "sr-only")}>{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
