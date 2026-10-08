import { getAllUsers } from "@/server/admin/admin.service";
import { getAuth, proxy, queryOf } from "@/server/http";
import type { UsersParams } from "@/types/pending";

export async function GET(request: Request) {
    return proxy(() => getAllUsers(queryOf(request) as UsersParams, getAuth(request)));
}
