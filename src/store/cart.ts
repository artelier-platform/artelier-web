import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

export type CartItem = {
    product: Product;
    quantity: number;
    customNotes?: string;
};

type CartStore = {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, customNotes?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: () => number;
    itemCount: () => number;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1, customNotes) =>
                set((state) => {
                    const existing = state.items.find(
                        (i) => i.product.id === product.id
                    );
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.product.id === product.id
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        };
                    }
                    return {
                        items: [...state.items, { product, quantity, customNotes }],
                    };
                }),

            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.product.id !== productId),
                })),

            updateQuantity: (productId, quantity) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter((i) => i.product.id !== productId)
                            : state.items.map((i) =>
                                i.product.id === productId ? { ...i, quantity } : i
                            ),
                })),

            clearCart: () => set({ items: [] }),

            total: () =>
                get().items.reduce(
                    (sum, i) => sum + Number(i.product.price ?? 0) * i.quantity,
                    0
                ),

            itemCount: () =>
                get().items.reduce((sum, i) => sum + i.quantity, 0),
        }),
        {
            name: "artelier-cart",
            partialize: (state) => ({ items: state.items }),
        }
    )
);