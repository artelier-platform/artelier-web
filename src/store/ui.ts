import { create } from "zustand";

export type AuthMode = "login" | "register";

type UIStore = {
    customOrderOpen: boolean;
    openCustomOrder: () => void;
    setCustomOrderOpen: (open: boolean) => void;

    cartOpen: boolean;
    openCart: () => void;
    setCartOpen: (open: boolean) => void;

    authOpen: boolean;
    authMode: AuthMode;
    openAuth: (mode?: AuthMode) => void;
    setAuthOpen: (open: boolean) => void;
    setAuthMode: (mode: AuthMode) => void;
};

export const useUIStore = create<UIStore>((set) => ({
    customOrderOpen: false,
    openCustomOrder: () => set({ customOrderOpen: true }),
    setCustomOrderOpen: (open) => set({ customOrderOpen: open }),

    cartOpen: false,
    openCart: () => set({ cartOpen: true }),
    setCartOpen: (open) => set({ cartOpen: open }),

    authOpen: false,
    authMode: "login",
    openAuth: (mode = "login") => set({ authOpen: true, authMode: mode }),
    setAuthOpen: (open) => set({ authOpen: open }),
    setAuthMode: (mode) => set({ authMode: mode }),
}));
