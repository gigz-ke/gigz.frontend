import React, { useMemo, useEffect } from "react";
import { useGigs } from "../hooks/useGigs";
import { useCategory } from "../hooks/useCategory";

export const GigListPage: React.FC = () => {
  const { myGigs, deleteGig } = useGigs(); // use myGigs for logged-in seller
  const { categories, fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Map category ID to name for quick lookup
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach(cat => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  const handleAddGig = () => {
    window.location.href = "/gigs/add";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <h2 className="text-3xl font-bold text-green-900">Manage Gigs</h2>
          <button
            onClick={handleAddGig}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow transition active:scale-95"
          >
            + Add Gig
          </button>
        </div>

        {/* Empty State */}
        {myGigs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-600">
            <p className="text-lg">No gigs found. Click "Add Gig" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition flex flex-col"
              >
                {/* Cover Image */}
                {gig.coverImage && (
                  <div className="w-full h-48">
                    <img
                      src={gig.coverImage}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Gig Info */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{gig.title}</h3>
                    <p className="text-gray-500 text-sm">
                      Category:{" "}
                      <span className="font-medium text-gray-700">
                        {categoryMap[gig.category] || "Unknown"}
                      </span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Price: <span className="font-medium text-gray-700">${gig.price.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      Delivery: <span className="font-medium text-gray-700">{gig.deliveryTime} day{gig.deliveryTime !== 1 ? "s" : ""}</span>
                    </p>
                    {gig.revisionNumber !== undefined && (
                      <p className="text-gray-500 text-sm">
                        Revisions: <span className="font-medium text-gray-700">{gig.revisionNumber}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => (window.location.href = `/gigs/edit/${gig._id}`)}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition active:scale-95"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGig(gig._id)}
                      className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
