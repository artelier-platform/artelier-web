import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-md">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="mt-2 h-10 w-full" />
            </div>
        </div>
    );
}

export default function Loading() {
    return (
        <div className="mx-auto max-w-[1440px] px-6 py-10" aria-busy="true" aria-label="Cargando catálogo">
            <Skeleton className="mb-10 h-12 w-64" />
            {[0, 1].map((section) => (
                <div key={section}>
                    {section > 0 && <Separator className="my-10" />}
                    <Skeleton className="mb-6 h-9 w-48" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[0, 1, 2, 3].map((i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
