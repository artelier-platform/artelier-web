"use client";

import type { ComponentProps } from "react";
import { useUIStore } from "@/store/ui";

/** Botón que abre el modal de pedido personalizado desde cualquier lugar (header, footer, etc.). */
export default function CustomOrderTrigger({ children, onClick, ...props }: ComponentProps<"button">) {
    const open = useUIStore((s) => s.openCustomOrder);

    return (
        <button
            type="button"
            onClick={(e) => {
                onClick?.(e);
                open();
            }}
            {...props}
        >
            {children}
        </button>
    );
}
