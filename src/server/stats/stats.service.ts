// src/server/stats/stats.service.ts
import { api } from "@/lib/api";
import { bearer } from "@/server/http";
import type { ApiResponse } from "@/types";
import type { DashboardStats } from "@/types/pending";

export async function getStats(auth?: string): Promise<ApiResponse<DashboardStats>> {
    const { data } = await api.get<ApiResponse<DashboardStats>>("/admin/stats", bearer(auth));
    return data;
}
