// src/types/index.ts
import type { components, operations } from "./api";

// ------------------- Responses -------------------

/** Product entity response schema from the OpenAPI specification. */
export type Product = components["schemas"]["ProductResponse"];
/** Product image asset response schema from the OpenAPI specification. */
export type ProductImage = components["schemas"]["ProductImageResponse"];
/** Product category response schema from the OpenAPI specification. */
export type Category = components["schemas"]["CategoryResponse"];
/** Customer order response schema from the OpenAPI specification. */
export type Order = components["schemas"]["OrderResponse"];
/** Line item within an order response schema from the OpenAPI specification. */
export type OrderItem = components["schemas"]["OrderItemResponse"];
/** Payment transaction response schema from the OpenAPI specification. */
export type Payment = components["schemas"]["PaymentResponse"];
/** Aggregated metrics and statistics response schema from the OpenAPI specification. */
export type Stats = components["schemas"]["StatsResponse"];
/** Best-selling product summary schema from the OpenAPI specification. */
export type TopProduct = components["schemas"]["TopProduct"];
/** Financial institution entry (e.g., PSE/Wompi) from the OpenAPI specification. */
export type FinancialInstitution = Required<components["schemas"]["WompiFinancialInstitutionsResponse"]>;

// Banners (a banner now contains N items)

/** Promotional banner container schema supporting multiple child items. */
export type Banner = components["schemas"]["BannerResponse"];
/** Individual item entry nested within a promotional banner. */
export type BannerItem = components["schemas"]["ItemBannerResponse"];
/** Uploaded media asset metadata returned by the backend. */
export type UploadedAsset = components["schemas"]["UploadedAssetResponse"];

// ------------------- Requests -------------------

/** Payload for user sign-in requests. */
export type LoginRequest = components["schemas"]["LoginRequest"];
/** Payload for user account registration requests. */
export type RegisterRequest = components["schemas"]["RegisterRequest"];
/** Payload for refreshing an expired access token. */
export type RefreshTokenRequest = components["schemas"]["RefreshTokenRequest"];
/** Payload for creating a new order. */
export type OrderRequest = components["schemas"]["OrderRequest"];
/** Payload for initiating or confirming a payment. */
export type PaymentRequest = components["schemas"]["PaymentRequest"];
/** Payload for creating or updating a catalog product. */
export type ProductRequest = components["schemas"]["ProductRequest"];
/** Payload for attaching or updating a product image. */
export type ProductImageRequest = components["schemas"]["ProductImageRequest"];
/** Payload for creating or updating a product category. */
export type CategoryRequest = components["schemas"]["CategoryRequest"];

/** Payload for creating or updating a promotional banner. */
export type BannerRequest = components["schemas"]["BannerRequest"];
/** Payload for creating an item inside a promotional banner. */
export type BannerItemRequest = components["schemas"]["ItemBannerRequest"];
/** Payload for updating an existing promotional banner item. */
export type BannerItemUpdateRequest = components["schemas"]["ItemBannerUpdateRequest"];
/** Payload for updating a resource's status. */
export type StatusRequest = components["schemas"]["StatusRequest"];
/** Payload for reordering items or banner positions. */
export type PositionRequest = components["schemas"]["PositionRequest"];

// ------------------- Pages -------------------

/** Paginated response wrapper for product listings. */
export type ProductPage = components["schemas"]["PageProductResponse"];
/** Paginated response wrapper for order listings. */
export type OrderPage = components["schemas"]["PageOrderResponse"];

// ------------------- Derived Enums -------------------

/** Union of valid order lifecycle statuses derived from {@link Order}. */
export type OrderStatus = NonNullable<Order["status"]>;
/** Union of valid product stock modes derived from {@link Product}. */
export type StockType = NonNullable<Product["stockType"]>;
/** Union of valid payment transaction statuses derived from {@link Payment}. */
export type PaymentStatus = NonNullable<Payment["status"]>;

// ------------------- Queries -------------------

/** Query parameters accepted by the `getAllProducts` operation. */
export type ProductsQuery = operations["getAllProducts"]["parameters"]["query"];
/** Query parameters accepted by the `listOrders` operation. */
export type OrdersQuery = operations["listOrders"]["parameters"]["query"];
/** Query parameters accepted by the `listUsers` operation. */
export type UsersQuery = operations["listUsers"]["parameters"]["query"];

// ----------------------------------------------
// TEMPORARY: The backend defines these DTOs, but Swagger does not expose
// their schemas (auth and `listUsers` type `data?: unknown`). Mirror of
// `AuthResponse` / `UserProfileResponse` / `UserEmailResponse`.
// Replace with `components["schemas"][...]` once annotated in OpenAPI.
// ----------------------------------------------

/** Application-level authorization roles assigned to a user account. */
export type UserRole = "ADMIN" | "BUYER";
/** Account lifecycle and verification states for a user. */
export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";

/**
 * Email address record associated with a user profile, including verification state.
 */
export type UserEmail = {
    /** Unique identifier of the email record. */
    id: string;
    /** Email address string. */
    email: string;
    /** Whether this address is the user's primary contact email. */
    isPrimary: boolean;
    /** Whether the email address has been verified. */
    isVerified: boolean;
    /** ISO-8601 timestamp when verification completed, or `null` if unverified. */
    verifiedAt?: string | null;
    /** ISO-8601 creation timestamp. */
    createdAt: string;
};

/**
 * Authenticated or administrative representation of a user account profile.
 */
export type UserProfile = {
    /** Unique identifier of the user. */
    id: string;
    /** Unique account username. */
    username: string;
    /** User's given name. */
    firstName: string;
    /** User's family name. */
    lastName: string;
    /** International dialing prefix (e.g., `+57`), if provided. */
    phoneCountryCode?: string | null;
    /** Local phone number without country prefix, if provided. */
    phoneNumber?: string | null;
    /** ISO-8601 timestamp when phone verification completed, or `null` if unverified. */
    phoneVerifiedAt?: string | null;
    /** URL to the user's avatar/profile image, if set. */
    profileImageUrl?: string | null;
    /** Current account status. */
    status: UserStatus;
    /** Assigned role determining access permissions. */
    role: UserRole;
    /** Email addresses registered to the user account. */
    emails: UserEmail[];
    /** ISO-8601 account creation timestamp. */
    createdAt: string;
};

/**
 * Authentication token bundle and associated user profile returned on login/refresh.
 */
export type AuthData = {
    /** Short-lived bearer token used for authenticating API requests. */
    accessToken: string;
    /** Long-lived token used to rotate or renew sessions. */
    refreshToken: string;
    /** Token scheme prefix (typically `"Bearer"`). */
    tokenType: string;
    /** Access token lifetime in seconds. */
    expiresIn: number;
    /** Profile details of the authenticated user. */
    user: UserProfile;
};

// ----------------------------------------------

/**
 * Standard envelope returned by backend and BFF endpoints.
 *
 * @template T - Type of the optional response payload (`data`).
 */
export interface ApiResponse<T> {
    /** Indicates whether the operation succeeded. */
    success: boolean;
    /** Human-readable status or error message. */
    message: string;
    /** Optional domain payload returned when available. */
    data?: T;
}