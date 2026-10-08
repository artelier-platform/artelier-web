import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";

const CONFIG: Record<OrderStatus, { label: string; variant: ComponentProps<typeof Badge>["variant"] }> = {
    PENDING_PAYMENT: { label: "Procesando tu pago", variant: "outline" },
    PAID: { label: "Pago exitoso", variant: "success" },
    PROCESSING: { label: "Procesando pedido", variant: "warning" },
    SHIPPED: { label: "Pedido enviado", variant: "default" },
    CANCELLED: { label: "Pedido cancelado", variant: "destructive" },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const { label, variant } = CONFIG[status];
    return <Badge variant={variant}>{label}</Badge>;
}
