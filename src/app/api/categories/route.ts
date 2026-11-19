import { getAllCategories } from "@/server/categories/categories.service";
import { proxy } from "@/server/http";

export async function GET() {
    return proxy(() => getAllCategories());
}