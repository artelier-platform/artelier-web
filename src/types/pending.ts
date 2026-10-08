import type { Order, OrderRequest, OrdersQuery, Product, ProductsQuery, Stats, UserRole } from "@/types";

/**
 * Tipos de lo que el backend AÚN NO tiene (ver backend-pendiente.md).
 * Cuando existan en la API, se reemplazan por los tipos generados en types/api.ts.
 */

/** Página de Spring para los endpoints nuevos. */
export type PageResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
};

// ------------------- Productos -------------------

/** Producto con calificación (la API actual no la trae). */
export type ProductWithRating = Product & {
    averageRating?: number | null;
    reviewCount?: number;
};

/** GET /products y GET /admin/products: agregan `search`. */
export type ProductsParams = NonNullable<ProductsQuery> & {
    search?: string;
    isActive?: boolean; // solo /admin/products
};

// ------------------- Reseñas -------------------

export type Review = {
    id: string;
    rating: number; // 1–5
    comment?: string | null;
    authorName: string;
    createdAt: string;
};

export type ReviewRequest = {
    rating: number;
    comment?: string;
};

// ------------------- Banners -------------------

export type Banner = {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    buttonLabel?: string | null;
    buttonUrl?: string | null;
    sortOrder: number;
    isActive: boolean;
};

/** Parte `data` del multipart de POST/PUT /banners. La imagen va en la parte `image`. */
export type BannerRequest = Omit<Banner, "id" | "imageUrl">;

// ------------------- Pedidos personalizados -------------------

export type CustomOrderStatus = "PENDING" | "REJECTED" | "PUBLISHED";

export type CustomOrderImage = { id: string; url: string };

export type CustomOrder = {
    id: string;
    customerName: string;
    description: string;
    referenceImages: CustomOrderImage[];
    userId: string;
    contactEmail?: string;
    status: CustomOrderStatus;
    adminNotes?: string | null;
    /** Producto del catálogo creado a partir del pedido (solo con PUBLISHED). */
    productId?: string | null;
    createdAt: string;
};

export type CustomOrderInput = {
    customerName: string;
    description: string;
    images: File[];
};

export type CustomOrderStatusUpdate = {
    status: CustomOrderStatus;
    adminNotes?: string;
    productId?: string;
};

export type CustomOrdersParams = {
    page?: number;
    size?: number;
    sort?: string;
    status?: CustomOrderStatus;
};

// ------------------- Usuarios (admin) -------------------

export type AdminUser = {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    isBanned: boolean;
    createdAt: string;
};

export type UsersParams = {
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    role?: UserRole;
    banned?: boolean;
};

// ------------------- Pedidos -------------------

export type OrderCustomer = { id: string; fullName: string; email: string };

/** Pedido con datos del cliente y teléfono de contacto. */
export type OrderWithCustomer = Order & {
    customer?: OrderCustomer;
    contactPhone?: string | null;
};

export type OrderRequestWithPhone = OrderRequest & { contactPhone?: string };

/** GET /orders (admin): agrega búsqueda y rango de fechas. */
export type OrdersParams = NonNullable<OrdersQuery> & {
    search?: string;
    from?: string; // ISO date
    to?: string;
};

// ------------------- Pagos -------------------

/** Banco para PSE (formato de Wompi). Confirmar nombres con el backend. */
export type FinancialInstitution = {
    financial_institution_code: string;
    financial_institution_name: string;
};

// ------------------- Stats -------------------

/** Stats del dashboard, con el campo nuevo `pendingCustomOrders`. */
export type DashboardStats = Stats & { pendingCustomOrders?: number };
