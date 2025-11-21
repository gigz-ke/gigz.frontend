import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Order, OrderStatus } from "../data/models/Order";
import { format, isValid } from "date-fns";
import { useOrders } from "../hooks/useOrders";

export const OrderListPage: React.FC = () => {
  const { user } = useAuth();
  const {
    buyerOrders,
    sellerOrders,
    fetchBuyerOrders,
    fetchSellerOrders,
  } = useOrders();

  const [view, setView] = useState<"seller" | "buyer">("seller");
  const [loading, setLoading] = useState(true);

  // Fetch orders based on user role
  useEffect(() => {
    if (!user) return;

    const email = user.email;
    setLoading(true);

    const fetchOrders = async () => {
      try {
        if (user.isSeller) {
          await Promise.all([fetchSellerOrders(email), fetchBuyerOrders(email)]);
        } else {
          await fetchBuyerOrders(email);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, fetchBuyerOrders, fetchSellerOrders]);

  // Map status to color badges
  const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Safe date formatting
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PPP p") : "N/A";
  };

  // Render the orders table
  const renderOrdersTable = (orders: Order[]) => {
    if (!orders || orders.length === 0) {
      return <div className="p-6 text-gray-500">No orders found.</div>;
    }

    return (
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gig ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.gigId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.buyerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.sellerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!user) return <div className="p-6">Loading user...</div>;
  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Orders Dashboard</h1>

      {user.isSeller && (
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md font-medium ${view === "seller" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            onClick={() => setView("seller")}
          >
            Seller Orders
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${view === "buyer" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            onClick={() => setView("buyer")}
          >
            Buyer Orders
          </button>
        </div>
      )}

      <div>
        {user.isSeller
          ? view === "seller"
            ? renderOrdersTable(sellerOrders)
            : renderOrdersTable(buyerOrders)
          : renderOrdersTable(buyerOrders)}
      </div>
    </div>
  );
};
