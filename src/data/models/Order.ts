// Enum to match backend order statuses
export type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

// Frontend Order entity
export interface Order {
  id: string;        // MongoDB _id or generated UUID from backend
  gigId: string;     // The ID of the gig being ordered
  buyerId: string;   // Buyer user ID
  sellerId: string;  // Seller user ID
  price: number;     // Order price
  status: OrderStatus; // Order status
  createdAt: string; // ISO date string from backend
  updatedAt: string; // ISO date string from backend
}

// Request payload when creating a new order
export interface CreateOrderRequest {
  gigId: string;
  buyerId: string;
  sellerId: string;
  price: number;
}

// Optional: Update order status request
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
