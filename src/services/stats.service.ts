import { bff } from "@/lib/bff";
import type { ApiResponse } from "@/types";
import type { DashboardStats } from "@/types/pending";

export async function getStats(): Promise<ApiResponse<DashboardStats>> {
    const { data } = await bff.get<ApiResponse<DashboardStats>>("/admin/stats");
    return data;
}
