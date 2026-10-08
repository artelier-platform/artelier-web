import { createCategory, getAllCategories } from "@/server/categories/categories.service";
import { getAuth, proxy } from "@/server/http";
import type { CategoryRequest } from "@/types";

export async function GET() {
    return proxy(() => getAllCategories());
}

export async function POST(request: Request) {
    const body: CategoryRequest = await request.json();
    return proxy(() => createCategory(body, getAuth(request)), 201);
}
