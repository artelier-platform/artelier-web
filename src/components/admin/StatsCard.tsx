import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
} as const;

type Props = {
    title: string;
    /** Cifra principal (ventas, cantidad...). */
    value?: ReactNode;
    /** Texto de apoyo, por ejemplo "Producto #1 - 12 vendidos". */
    description?: ReactNode;
    tone?: keyof typeof TONES;
    className?: string;
};

/** Tarjeta de estadística del dashboard (Figma > Stats Card). */
export default function StatsCard({ title, value, description, tone = "primary", className }: Props) {
    return (
        <div className={cn("rounded-md p-4 shadow-md", TONES[tone], className)}>
            <h3 className="font-heading text-3xl leading-tight font-medium">{title}</h3>
            {value !== undefined && <p className="mt-2 text-2xl font-semibold">{value}</p>}
            {description && <p className="mt-1 text-xs">{description}</p>}
        </div>
    );
}
