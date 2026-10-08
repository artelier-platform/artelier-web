import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { PRODUCT_STATUS_LABEL, type ProductStatus } from "@/lib/product-status";
import { cn } from "@/lib/utils";

const VARIANT: Record<ProductStatus, ComponentProps<typeof Badge>["variant"]> = {
    SOLD_OUT: "destructive",
    LAST_UNITS: "warning",
    NEW: "default",
    CUSTOM: "outline",
    AVAILABLE: "success",
};

export default function ProductStatusBadge({
    status,
    className,
}: {
    status: ProductStatus;
    className?: string;
}) {
    return (
        <Badge variant={VARIANT[status]} className={cn(status === "CUSTOM" && "bg-card", className)}>
            {PRODUCT_STATUS_LABEL[status]}
        </Badge>
    );
}
