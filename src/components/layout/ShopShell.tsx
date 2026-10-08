import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CustomOrderDialog from "@/components/shop/CustomOrderDialog";
import AuthModal from "@/components/auth/AuthModal";

/**
 * Estructura de la tienda y la cuenta: Header + contenido + Footer + carrito lateral + modal de pedido personalizado + modal de acceso.
 * Se usa en (shop)/layout.tsx y (protected)/account/layout.tsx.
 */
export default function ShopShell({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <CustomOrderDialog />
            <AuthModal />
        </>
    );
}
