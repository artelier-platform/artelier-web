import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-1">
            <AdminSidebar />
            <main className="min-w-0 flex-1 p-6">{children}</main>
        </div>
    );
}
