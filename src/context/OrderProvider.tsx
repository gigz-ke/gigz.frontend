import React, { useState, useEffect, useCallback, type ReactNode } from "react";
import { OrderContext } from "./OrderContext";
import type { Order, CreateOrderRequest, UpdateOrderStatusRequest } from "../data/models/Order";
import { OrderService } from "../data/services/orderService";

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [buyerOrders, setBuyerOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<Order[]>([]);

  const fetchAllOrders = useCallback(async () => {
    try {
      const data = await OrderService.getAll();
      setAllOrders(data);
    } catch (err) {
      console.error("Failed to fetch all orders:", err);
    }
  }, []);

  const fetchBuyerOrders = useCallback(async (buyerId: string) => {
    try {
      const data = await OrderService.getByBuyer(buyerId);
      setBuyerOrders(data);
    } catch (err) {
      console.error("Failed to fetch buyer orders:", err);
    }
  }, []);

  const fetchSellerOrders = useCallback(async (sellerId: string) => {
    try {
      const data = await OrderService.getBySeller(sellerId);
      setSellerOrders(data);
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    try {
      return await OrderService.getById(id);
    } catch (err) {
      console.error("Failed to fetch order by ID:", err);
      return null;
    }
  }, []);

  const createOrder = useCallback(async (data: CreateOrderRequest) => {
    try {
      const newOrder = await OrderService.create(data);
      setAllOrders(prev => [...prev, newOrder]);
      setBuyerOrders(prev => data.buyerId === newOrder.buyerId ? [...prev, newOrder] : prev);
      setSellerOrders(prev => data.sellerId === newOrder.sellerId ? [...prev, newOrder] : prev);
      return newOrder;
    } catch (err) {
      console.error("Failed to create order:", err);
      throw err;
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, data: UpdateOrderStatusRequest) => {
    try {
      const updated = await OrderService.updateStatus(id, data);
      setAllOrders(prev => prev.map(o => o.id === id ? updated : o));
      setBuyerOrders(prev => prev.map(o => o.id === id ? updated : o));
      setSellerOrders(prev => prev.map(o => o.id === id ? updated : o));
      return updated;
    } catch (err) {
      console.error("Failed to update order status:", err);
      throw err;
    }
  }, []);

  const cancelOrder = useCallback(async (id: string) => {
    try {
      const cancelled = await OrderService.cancel(id);
      setAllOrders(prev => prev.map(o => o.id === id ? cancelled : o));
      setBuyerOrders(prev => prev.map(o => o.id === id ? cancelled : o));
      setSellerOrders(prev => prev.map(o => o.id === id ? cancelled : o));
      return cancelled;
    } catch (err) {
      console.error("Failed to cancel order:", err);
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    try {
      await OrderService.delete(id);
      setAllOrders(prev => prev.filter(o => o.id !== id));
      setBuyerOrders(prev => prev.filter(o => o.id !== id));
      setSellerOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllOrders();
  }, [fetchAllOrders]);

  return (
    <OrderContext.Provider
      value={{
        allOrders,
        buyerOrders,
        sellerOrders,
        fetchAllOrders,
        fetchBuyerOrders,
        fetchSellerOrders,
        getOrderById,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        deleteOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
