import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Input con un ícono a la izquierda (como en el mockup de acceso). */
export default function IconInput({
    icon: Icon,
    className,
    ...props
}: ComponentProps<"input"> & { icon: LucideIcon }) {
    return (
        <div className="relative">
            <Icon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input {...props} className={cn("pl-10", className)} />
        </div>
    );
}
