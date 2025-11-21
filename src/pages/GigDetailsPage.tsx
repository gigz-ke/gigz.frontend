/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGigs } from "../hooks/useGigs";
import { useCategory } from "../hooks/useCategory";
import type { Gig } from "../data/models/Gig";
import type { User } from "../data/models/User";
import Slider from "../components/Slider";
import { getUserById } from "../data/services/userService";

export const GigDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { gigs, fetchGigs } = useGigs();
  const { categories } = useCategory();

  const [gig, setGig] = useState<Gig | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerLoading, setSellerLoading] = useState(false);

  // Fetch gigs if not loaded
  useEffect(() => {
    if (!gigs.length) fetchGigs();
  }, []);

  // Set gig based on ID once gigs are loaded
  useEffect(() => {
    if (id && gigs.length) {
      const found = gigs.find((g) => g._id === id);
      setGig(found || null);
      setLoading(false);
    }
  }, [id, gigs]);

  // Fetch seller info when gig is available
  useEffect(() => {
    const fetchSeller = async () => {
      if (gig?.sellerId) {
        try {
          setSellerLoading(true);
          const data = await getUserById(gig.sellerId);
          setSeller(data);
        } catch (err) {
          console.error("Failed to fetch seller:", err);
          setSeller(null);
        } finally {
          setSellerLoading(false);
        }
      }
    };
    fetchSeller();
  }, [gig]);

  if (loading) return <div className="p-8 text-center">Loading gig details...</div>;
  if (!gig)
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Gig not found</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    );

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : "Unknown";
  };

  const allImages = [gig.coverImage, ...(gig.images || [])].filter(Boolean);

  return (
    <div className="max-w-[1400px] mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Left Column */}
      <div className="flex-2 flex flex-col gap-6">
        <span
          className="text-sm font-light uppercase text-gray-500 cursor-pointer hover:underline"
          onClick={() => navigate(-1)}
        >
          ← Back
        </span>

        <h1 className="text-3xl font-semibold">{gig.title}</h1>
        <p className="text-gray-500 text-sm">{getCategoryName(gig.category)}</p>

        {/* Image Slider */}
        {allImages.length > 0 && (
          <Slider slidesToShow={1} arrowsScroll={1} className="rounded-xl overflow-hidden">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${gig.title}-${idx}`}
                className="w-full h-80 object-cover"
              />
            ))}
          </Slider>
        )}

        {/* About This Gig */}
        <div>
          <h2 className="text-xl font-semibold mt-4">About This Gig</h2>
          <p className="text-gray-600 mt-2 leading-relaxed">{gig.description}</p>
        </div>
      </div>

      {/* Right Column (Sticky) */}
      <div className="flex-1 border border-gray-200 rounded-lg p-4 h-max sticky top-24 flex flex-col gap-4">
        {/* Seller Box */}
        {sellerLoading && <p className="text-gray-400">Loading seller info...</p>}
        {seller && (
          <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">About The Seller</h2>
            <div className="flex items-center gap-4">
              <img
                src={seller.img || "/img/default-pp.png"}
                alt={seller.username}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex flex-col gap-2">
                <span className="font-medium">{seller.username}</span>
                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                  Contact Me
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-500">
              <div>
                <span className="font-light">From</span>
                <p>{seller.country || "Unknown"}</p>
              </div>
            </div>
            {seller.desc && <p className="text-gray-600 mt-2">{seller.desc}</p>}
          </div>
        )}

        {/* Gig Purchase Box */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{gig.serviceTitle}</h3>
            <h2 className="text-2xl font-semibold">${gig.price}</h2>
          </div>
          <p className="text-gray-500">{gig.shortDescription}</p>

          <div className="flex gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-2">
              <img src="/img/clock.png" alt="" className="w-5" />
              <span>{gig.deliveryTime} Days Delivery</span>
            </div>
            {gig.revisionNumber != null && (
              <div className="flex items-center gap-2">
                <img src="/img/recycle.png" alt="" className="w-5" />
                <span>{gig.revisionNumber} Revisions</span>
              </div>
            )}
          </div>

          {gig.features && gig.features.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              {gig.features.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-500">
                  <img src="/img/greencheck.png" alt="" className="w-4" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}

          <button className="bg-green-600 text-white py-2 text-lg font-medium rounded-md mt-4 hover:bg-green-700">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
