// src/services/OrderService.ts
import axios from "axios";
import { config } from "../config";
import type { CreateOrderRequest, Order, UpdateOrderStatusRequest } from "../models/Order";

const API_URL = `${config.API_BASE_URL}/orders`;

export const OrderService = {
  // Create a new order
  async create(data: CreateOrderRequest): Promise<Order> {
    const response = await axios.post<Order>(API_URL, data);
    return response.data;
  },

  // Get all orders
  async getAll(): Promise<Order[]> {
    const response = await axios.get<Order[]>(API_URL);
    return response.data;
  },

  // Get all orders by buyer
  async getByBuyer(buyerId: string): Promise<Order[]> {
    const response = await axios.get<Order[]>(`${API_URL}/buyer/${buyerId}`);
    return response.data;
  },

  // Get all orders by seller
  async getBySeller(sellerId: string): Promise<Order[]> {
    const response = await axios.get<Order[]>(`${API_URL}/seller/${sellerId}`);
    return response.data;
  },

  // Get a single order by ID
  async getById(orderId: string): Promise<Order> {
    const response = await axios.get<Order>(`${API_URL}/${orderId}`);
    return response.data;
  },

  // Update order status
  async updateStatus(id: string, data: UpdateOrderStatusRequest): Promise<Order> {
    const response = await axios.patch<Order>(`${API_URL}/${id}/status`, data);
    return response.data;
  },

  // Cancel an order
  async cancel(id: string): Promise<Order> {
    const response = await axios.patch<Order>(`${API_URL}/${id}/cancel`);
    return response.data;
  },

  // Delete an order
  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
  },
};
