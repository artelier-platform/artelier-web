// src/types/index.ts
import type { components, operations } from './api'

export type Product    = components['schemas']['ProductResponse']
export type Category   = components['schemas']['CategoryResponse']
export type Order      = components['schemas']['OrderResponse']
export type OrderItem  = components['schemas']['OrderItemResponse']
export type Payment    = components['schemas']['PaymentResponse']
export type AuthData   = components['schemas']['AuthResponse']
export type Stats      = components['schemas']['StatsResponse']

export type LoginRequest    = components['schemas']['LoginRequest']
export type RegisterRequest = components['schemas']['RegisterRequest']
export type OrderRequest    = components['schemas']['OrderRequest']
export type PaymentRequest  = components['schemas']['PaymentRequest']
export type ProductRequest  = components['schemas']['ProductRequest']
export type CategoryRequest = components['schemas']['CategoryRequest']

export type ProductPage = components['schemas']['PageProductResponse']
export type OrderPage   = components['schemas']['PageOrderResponse']

export type OrderStatus  = NonNullable<Order['status']>
export type StockType    = NonNullable<Product['stockType']>
export type PaymentStatus = NonNullable<Payment['status']>
export type UserRole     = NonNullable<AuthData['role']>

export type ProductsQuery = operations['getAllProducts']['parameters']['query']
export type OrdersQuery   = operations['getAllOrders']['parameters']['query']

// ----------------------------------------------

export interface ApiResponse<T> {
    success?: boolean
    message?: string
    data?: T
}