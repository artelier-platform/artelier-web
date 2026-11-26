import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="w-full">
            <Skeleton className="aspect-4/3 w-full sm:aspect-video" />
        </main>
    );
}