// src/types/pending.ts
import type {
    Order,
    OrderRequest,
    OrdersQuery,
    Product,
    ProductsQuery,
    Stats,
    UserProfile,
    UserRole,
    UsersQuery,
    UserStatus,
} from "@/types";

/**
 * Temporary type definitions for backend endpoints, DTO fields, or query parameters
 * that are not yet available or exposed in Swagger (see `backend-pendiente.md`).
 * Once available in the API, these should be replaced by generated types in `types/api.ts`.
 */

/**
 * Spring Boot pagination wrapper for endpoints not yet covered by generated API types.
 *
 * @template T - The element type contained in the paginated `content` array.
 */
export type PageResponse<T> = {
    /** Items on the current page. */
    content: T[];
    /** Total number of elements across all pages. */
    totalElements: number;
    /** Total number of available pages. */
    totalPages: number;
    /** Zero-based index of the current page. */
    number: number;
    /** Requested page size. */
    size: number;
    /** Whether this page is the first page. */
    first: boolean;
    /** Whether this page is the last page. */
    last: boolean;
    /** Whether `content` contains no elements. */
    empty: boolean;
};

// ------------------- Products -------------------

/**
 * Product entity enriched with aggregated review rating data, which is omitted
 * from the base `ProductResponse` contract.
 */
export type ProductWithRating = Product & {
    /** Mean rating score on a 1–5 scale, or `null` if unrated. */
    averageRating?: number | null;
    /** Total number of submitted reviews for the product. */
    reviewCount?: number;
};

/**
 * Extended query parameters for `GET /products` and `GET /admin/products`.
 */
export type ProductsParams = NonNullable<ProductsQuery> & {
    /** Free-text search term for filtering products. */
    search?: string;
    /** Filters products by active state (`GET /admin/products` only). */
    isActive?: boolean;
};

// ------------------- Reviews -------------------
// Backend DTOs (`ReviewRequest` / `ReviewResponse`) exist, but endpoints are not yet exposed in Swagger.

/**
 * Persisted product review record returned by the backend.
 */
export type Review = {
    /** Unique identifier of the review. */
    id: string;
    /** Identifier of the author user. */
    userId: string;
    /** Display username of the reviewer. */
    username: string;
    /** Identifier of the reviewed product. */
    productId: string;
    /** Rating score from 1 to 5. */
    rating: number;
    /** Optional review text body. */
    comment?: string | null;
    /** ISO-8601 creation timestamp. */
    createdAt: string;
    /** ISO-8601 last-update timestamp. */
    updatedAt: string;
};

/**
 * Payload for creating or submitting a product review tied to a purchased order item.
 */
export type ReviewRequest = {
    /** Identifier of the purchased order item being reviewed. */
    orderItemId: string;
    /** Rating score from 1 to 5. */
    rating: number;
    /** Optional review comment (up to 2,000 characters). */
    comment?: string;
};

// ------------------- Custom Orders -------------------

/**
 * Lifecycle status of a custom order request.
 */
export type CustomOrderStatus = "PENDING" | "REJECTED" | "PUBLISHED";

/**
 * Reference image attached to a custom order.
 */
export type CustomOrderImage = {
    /** Unique identifier of the image asset. */
    id: string;
    /** Public URL used to render the reference image. */
    url: string;
};

/**
 * Custom order record representing a customer's bespoke product request.
 */
export type CustomOrder = {
    /** Unique identifier of the custom order. */
    id: string;
    /** Name of the requesting customer. */
    customerName: string;
    /** Detailed specification of the requested custom item. */
    description: string;
    /** Uploaded reference images illustrating the request. */
    referenceImages: CustomOrderImage[];
    /** Identifier of the user who submitted the request. */
    userId: string;
    /** Optional customer contact email address. */
    contactEmail?: string;
    /** Current moderation/publishing status of the custom order. */
    status: CustomOrderStatus;
    /** Optional internal notes recorded by an administrator. */
    adminNotes?: string | null;
    /** Linked catalog product ID when status is `"PUBLISHED"`. */
    productId?: string | null;
    /** ISO-8601 creation timestamp. */
    createdAt: string;
};

/**
 * Client-side input payload for submitting a new custom order with reference files.
 */
export type CustomOrderInput = {
    /** Name of the requesting customer. */
    customerName: string;
    /** Detailed description of the custom product. */
    description: string;
    /** Reference image files to upload. */
    images: File[];
};

/**
 * Administrative payload for transitioning a custom order's status.
 */
export type CustomOrderStatusUpdate = {
    /** Target status for the custom order. */
    status: CustomOrderStatus;
    /** Optional administrative note explaining the decision. */
    adminNotes?: string;
    /** Catalog product ID associated with the order when publishing. */
    productId?: string;
};

/**
 * Pagination, sorting, and status filter parameters for querying custom orders.
 */
export type CustomOrdersParams = {
    /** Zero-based page index. */
    page?: number;
    /** Number of items per page. */
    size?: number;
    /** Sort expression (e.g., field and direction). */
    sort?: string;
    /** Filter by custom order status. */
    status?: CustomOrderStatus;
};

// ------------------- Users (Admin) -------------------

/**
 * Administrative representation of a user profile returned by `GET /admin/users`
 * (`Page<UserProfileResponse>`). Account bans are reflected in `status`.
 */
export type AdminUser = UserProfile;

/**
 * Extended query parameters for administrative user listings.
 *
 * @remarks The backend currently supports `page` and `size` only; `search`, `role`, and `status` are pending.
 */
export type UsersParams = NonNullable<UsersQuery> & {
    /** Search filter matching user attributes. */
    search?: string;
    /** Filter by assigned user role. */
    role?: UserRole;
    /** Filter by account status (including banned states). */
    status?: UserStatus;
};

// ------------------- Orders -------------------

/**
 * Summary of customer identity fields attached to an order.
 */
export type OrderCustomer = {
    /** Unique identifier of the customer. */
    id: string;
    /** Full name of the customer. */
    fullName: string;
    /** Email address of the customer. */
    email: string;
};

/**
 * Order entity enriched with customer summary and contact phone data, which are
 * absent from the base `OrderResponse` contract.
 */
export type OrderWithCustomer = Order & {
    /** Customer summary metadata. */
    customer?: OrderCustomer;
    /** Contact phone number associated with the order. */
    contactPhone?: string | null;
};

/**
 * Order creation payload extended with an optional contact phone number.
 */
export type OrderRequestWithPhone = OrderRequest & {
    /** Customer contact phone number for the order. */
    contactPhone?: string;
};

/**
 * Extended query parameters for `GET /orders` (admin view), adding search and date range filters.
 */
export type OrdersParams = NonNullable<OrdersQuery> & {
    /** Free-text search term for filtering orders. */
    search?: string;
    /** Start of the creation date filter range (ISO date string). */
    from?: string;
    /** End of the creation date filter range (ISO date string). */
    to?: string;
};

// ------------------- Stats -------------------

/**
 * Dashboard statistics payload extended with pending custom order counts.
 */
export type DashboardStats = Stats & {
    /** Number of custom orders currently awaiting review (`PENDING`). */
    pendingCustomOrders?: number;
};