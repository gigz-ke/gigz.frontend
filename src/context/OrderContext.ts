import { createContext } from "react";
import type { Order, CreateOrderRequest, UpdateOrderStatusRequest } from "../data/models/Order";

export interface OrderContextType {
  allOrders: Order[];
  buyerOrders: Order[];
  sellerOrders: Order[];
  fetchAllOrders: () => Promise<void>;
  fetchBuyerOrders: (buyerId: string) => Promise<void>;
  fetchSellerOrders: (sellerId: string) => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  updateOrderStatus: (id: string, data: UpdateOrderStatusRequest) => Promise<Order>;
  cancelOrder: (id: string) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);
