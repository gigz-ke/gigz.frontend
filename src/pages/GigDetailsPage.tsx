/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGigs } from "../hooks/useGigs";
import { useCategory } from "../hooks/useCategory";
import { useAuth } from "../hooks/useAuth";

import type { Gig } from "../data/models/Gig";
import type { User } from "../data/models/User";
import type { CreateOrderRequest } from "../data/models/Order";

import Slider from "../components/Slider";
import { getUserByEmail } from "../data/services/userService";
import { OrderService } from "../data/services/orderService";

import { MdEmail, MdPhone } from "react-icons/md";

export const GigDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { gigs, fetchGigs } = useGigs();
  const { categories } = useCategory();
  const { user } = useAuth();

  const [gig, setGig] = useState<Gig | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  /* --------------------- FETCH GIGS ---------------------- */
  useEffect(() => {
    if (!gigs.length) fetchGigs();
  }, []);

  useEffect(() => {
    if (id && gigs.length) {
      const found = gigs.find((g) => g._id === id);
      setGig(found || null);
      setLoading(false);
    }
  }, [id, gigs]);

  /* --------------------- FETCH SELLER ---------------------- */
  useEffect(() => {
    const loadSeller = async () => {
      if (!gig?.sellerId) return;
      try {
        const data = await getUserByEmail(gig.sellerId);
        setSeller(data);
      } catch {
        setSeller(null);
      }
    };
    loadSeller();
  }, [gig]);

  /* --------------------- HELPERS ---------------------- */
  const getCategoryName = (cat: string) => {
    const found = categories.find((c) => c.id === cat);
    return found ? found.name : "Unknown";
  };

  const allImages = useMemo(
    () => [gig?.coverImage, ...(gig?.images || [])].filter(Boolean),
    [gig]
  );

  /* --------------------- ORDER FLOW ---------------------- */
  const handleContinue = () => {
    if (!user) {
      setLoginPrompt(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (!gig || !user) return;

    const payload: CreateOrderRequest = {
      gigId: gig._id,
      buyerId: user.email,
      sellerId: gig.sellerId,
      price: gig.price,
    };

    try {
      await OrderService.create(payload);
      alert("Order created successfully!");
    } catch {
      alert("Failed to create order");
    } finally {
      setIsModalOpen(false);
    }
  };

  const isSeller = user?.isSeller && user.email === gig?.sellerId;

  /* --------------------- LOADING & NOT FOUND ---------------------- */
  if (loading)
    return <div className="p-8 text-center">Loading gig details...</div>;

  if (!gig)
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Gig not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );

  /* --------------------- UI ---------------------- */
  return (
    <div className="max-w-[1400px] mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* LEFT */}
      <div className="flex-2 flex flex-col gap-6">
        <span
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 uppercase cursor-pointer hover:underline"
        >
          ← Back
        </span>

        <h1 className="text-3xl font-semibold">{gig.title}</h1>
        <p className="text-gray-400 text-sm">{getCategoryName(gig.category)}</p>

        {/* Slider */}
        {allImages.length > 0 && (
          <Slider slidesToShow={1} arrowsScroll={1} className="rounded-xl overflow-hidden">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="gig"
                className="w-full h-80 object-cover"
              />
            ))}
          </Slider>
        )}

        {/* ABOUT */}
        <div>
          <h2 className="text-xl font-semibold mt-4">About This Gig</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">{gig.description}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 h-max sticky top-24 flex flex-col gap-6">
        {/* SELLER CARD */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4 bg-white">
          <h2 className="text-lg font-semibold">About The Seller</h2>

          <div className="flex items-center gap-4">
            <img
              src={seller?.img || "/img/default-pp.png"}
              alt="seller"
              className="w-20 h-20 rounded-full object-cover shadow-sm"
            />

            <div>
              <p className="font-medium text-lg">{seller?.username}</p>
              <button
                onClick={() => setShowContact(!showContact)}
                className="px-3 py-1 mt-1 border rounded hover:bg-gray-100"
              >
                {showContact ? "Hide Contact" : "Contact Me"}
              </button>
            </div>
          </div>

          {/* Contact box */}
          {showContact && (
            <div className="mt-4 p-5 border rounded-xl bg-white shadow-sm flex flex-col gap-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>

              {/* PHONE — RENDER EXACTLY AS-IS */}
              <div className="flex items-center gap-3">
                <MdPhone className="text-green-600 w-6 h-6" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{seller?.phone}</p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3">
                <MdEmail className="text-blue-600 w-6 h-6" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{seller?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PURCHASE BOX */}
        <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white flex flex-col gap-4">
          <div className="flex justify-between">
            <h3 className="font-medium">{gig.serviceTitle}</h3>
            <h2 className="text-2xl font-semibold">${gig.price}</h2>
          </div>

          <p className="text-gray-500">{gig.shortDescription}</p>

          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <div className="flex items-center gap-2">
              <img src="/hero.png" className="w-5" />
              Delivery Time -
              <span>{gig.deliveryTime} Days</span>
            </div>

            {gig.revisionNumber != null && (
              <div className="flex items-center gap-2">
                <img src="/hero.png" className="w-5" />
                Revisions -
                <span>{gig.revisionNumber} Revisions</span>
              </div>
            )}
          </div>

          {/* FEATURES */}
          {gig.features?.length > 0 && (
            <div className="flex flex-col gap-2">
              {gig.features.map((f, i) => (
                <span key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                  <img src="/hero.png" className="w-4" />
                  Features -
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* BUTTON */}
          <button
            disabled={isSeller}
            onClick={handleContinue}
            className={`w-full py-2 text-lg rounded-md text-white mt-3 ${
              isSeller
                ? "bg-gray-400 cursor-not-allowed"
                : user
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {user ? "Continue" : "Login To Order"}
          </button>
        </div>
      </div>

      {/* LOGIN PROMPT */}
      {loginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-80 rounded-xl shadow-lg text-center space-y-4">
            <p className="font-medium">You must login before placing an order.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setLoginPrompt(false)}
                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-blue-600 py-2 rounded text-white hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM ORDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent-50 bg-opacity-35 flex items-center justify-center z-50">
          <div className="bg-white/50 text-amber-700 w-80 p-6 rounded-xl shadow-lg text-center space-y-4">
            <p className="font-medium">Are you sure you want to place this order?</p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
