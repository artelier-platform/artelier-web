/** Datos de contacto y redes (tomados del footer de Figma). Un solo lugar para cambiarlos. */
export const SITE = {
    name: "Artelier",
    tagline: "Piezas artesanales que transforman espacios con calidez, autenticidad y dedicación",
    email: "arteliercajica@gmail.com",
    phone: "+57 310 580 8185",
    phoneDigits: "573105808185",
    location: "Cajicá, Cundinamarca, Colombia",
    hours: ["Lun - vie: 8:00 a.m. - 5:00 p.m.", "Sáb: 10:00 a.m. - 2:00 p.m."],
    credit: "MimiRandomDev",
    social: {
        instagram: "https://instagram.com/arteliercajica",
        facebook: "https://www.facebook.com/profile.php?id=61584642207750",
        whatsapp: "https://wa.me/573105808185",
    },
} as const;

export const NAV_LINKS = [
    { label: "Inicio", href: "/" },
    { label: "Catálogo", href: "/products" },
    { label: "Personaliza", href: null }, // abre el modal de pedido personalizado
    { label: "Nosotros", href: "/about" },
] as const;
