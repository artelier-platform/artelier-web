import { deleteCategory, updateCategory } from "@/server/categories/categories.service";
import { getAuth, proxy } from "@/server/http";
import type { CategoryRequest } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
    const { id } = await params;
    const body: CategoryRequest = await request.json();
    return proxy(() => updateCategory(id, body, getAuth(request)));
}

export async function DELETE(request: Request, { params }: Params) {
    const { id } = await params;
    return proxy(() => deleteCategory(id, getAuth(request)));
}
