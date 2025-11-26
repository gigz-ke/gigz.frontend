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

  // Fetch orders based on role
  useEffect(() => {
    if (!user) return;

    const email = user.email;
    setLoading(true);

    const load = async () => {
      try {
        if (user.isSeller) {
          await Promise.all([fetchSellerOrders(email), fetchBuyerOrders(email)]);
        } else {
          await fetchBuyerOrders(email);
        }
      } catch (err) {
        console.error("Order fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, fetchBuyerOrders, fetchSellerOrders]);

  // Status badge styling
  const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    in_progress: "bg-blue-100 text-blue-700 border border-blue-300",
    completed: "bg-green-100 text-green-700 border border-green-300",
    cancelled: "bg-red-100 text-red-700 border border-red-300",
  };

  // Safe date formatting
  const formatDate = (d?: string) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return isValid(date) ? format(date, "MMM d, yyyy • p") : "N/A";
  };

  // Fiverr-style order card layout
  const OrderCard = ({ order }: { order: Order }) => (
    <div className="rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition bg-white">
      {/* Top */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-gray-800 font-semibold">
          Order #{order.id}
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${statusColors[order.status]}`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      {/* Middle */}
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium text-gray-600">Gig ID:</span>{" "}
          <span className="font-semibold text-gray-800">{order.gigId}</span>
        </p>

        <p>
          <span className="font-medium text-gray-600">Buyer:</span>{" "}
          <span className="text-gray-800">{order.buyerId}</span>
        </p>

        <p>
          <span className="font-medium text-gray-600">Seller:</span>{" "}
          <span className="text-gray-800">{order.sellerId}</span>
        </p>

        <p>
          <span className="font-medium text-gray-600">Price:</span>{" "}
          <span className="text-gray-900 font-bold">${order.price.toFixed(2)}</span>
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>Created: {formatDate(order.createdAt)}</p>
        <p>Updated: {formatDate(order.updatedAt)}</p>
      </div>
    </div>
  );

  const renderOrders = (orders: Order[]) => {
    if (!orders || orders.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500 bg-white rounded-xl border">
          No orders found.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-5 mt-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  if (!user) return <div className="p-6">Loading user...</div>;
  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* HEADINGS */}
      <h1 className="text-3xl font-bold text-gray-800">
        {user.isSeller
          ? view === "seller"
            ? "Selling Orders"
            : "Buying Orders"
          : "Your Orders"}
      </h1>

      {user.isSeller && (
        <div className="flex gap-4">
          <button
            className={`px-5 py-2.5 rounded-lg font-medium transition ${
              view === "seller"
                ? "bg-[#1dbf73] text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setView("seller")}
          >
            Selling Orders
          </button>

          <button
            className={`px-5 py-2.5 rounded-lg font-medium transition ${
              view === "buyer"
                ? "bg-[#1dbf73] text-white shadow"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setView("buyer")}
          >
            Buying Orders
          </button>
        </div>
      )}

      {/* ORDER LIST */}
      <div>
        {user.isSeller
          ? view === "seller"
            ? renderOrders(sellerOrders)
            : renderOrders(buyerOrders)
          : renderOrders(buyerOrders)}
      </div>
    </div>
  );
};
