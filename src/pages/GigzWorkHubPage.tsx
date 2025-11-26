// src/pages/gigs/GigzWorkHubPage.tsx
import React, { useEffect, useState } from "react";
import GigCard from "../components/gigs/GigCard";
import { useGigs } from "../hooks/useGigs";
import { useCategory } from "../hooks/useCategory";
import { FaSearch } from "react-icons/fa";
import type { Category } from "../data/models/Category";

const GigzWorkHubPage: React.FC = () => {
  const { gigs, fetchGigs } = useGigs();
  const { categories, fetchCategories } = useCategory();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchGigs();
      setLoading(false);
    };
    loadData();
  }, [fetchCategories, fetchGigs]);

  // Get category ID safely
  const getCategoryId = (gig: typeof gigs[number]) => {
    return typeof gig.category === "string" ? gig.category : gig.category;
  };

  // Get category name safely
  const getCategoryName = (gig: typeof gigs[number]) => {
    const catId = getCategoryId(gig);
    if (!catId) return "Unknown";
    const cat = categories.find((c) => c.id === catId);
    return cat?.name || "Unknown";
  };

  // Filter gigs
  const filteredGigs = gigs.filter((gig) => {
    const gigCategoryId = getCategoryId(gig);
    const matchesCategory = selectedCategory ? gigCategoryId === selectedCategory.id : true;
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Gigz WorkHub</h1>

        {/* Search bar */}
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search for gigs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 sm:px-4 py-2 rounded-full border text-sm sm:text-base transition ${
            !selectedCategory
              ? "bg-green-500 text-white border-green-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-50"
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 sm:px-4 py-2 rounded-full border text-sm sm:text-base transition ${
              selectedCategory?.id === cat.id
                ? "bg-green-500 text-white border-green-500"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Gigs grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading gigs...</p>
      ) : filteredGigs.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No gigs found. Try a different category or search term.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} categoryName={getCategoryName(gig)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GigzWorkHubPage;
