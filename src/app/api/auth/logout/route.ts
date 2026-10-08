// src/app/api/auth/logout/route.ts
import { logout } from "@/server/auth/auth.service";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
        // Intentamos revocar en el backend, pero si falla igual limpiamos cookies
        try {
            await logout(refreshToken);
        } catch {
            // silencioso — el logout local igual procede
        }
    }

    cookieStore.delete("refresh_token");
    cookieStore.delete("user_role");

    return Response.json({ success: true, message: "Logged out" });
}