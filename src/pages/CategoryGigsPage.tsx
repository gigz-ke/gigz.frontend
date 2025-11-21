// src/pages/categories/CategoryGigsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GigCard from "../components/gigs/GigCard";
import type { Gig } from "../data/models/Gig";
import { useCategory } from "../hooks/useCategory";

const CategoryGigsPage: React.FC = () => {
  const { id } = useParams();
  const { categories, fetchCategories } = useCategory();

  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [gigList, setGigList] = useState<Gig[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Fetch categories ONLY once on mount
      await fetchCategories();

      setLoading(false);
    };

    load();
  }, [fetchCategories]); // only fetched once

  // When categories or id changes → compute local data only
  useEffect(() => {
    if (!categories || categories.length === 0 || !id) return;

    const category = categories.find((c) => c.id === id);

    if (!category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryName("");
      setGigList([]);
      return;
    }

    setCategoryName(category.name);
    setGigList(category.gigs);
  }, [id, categories]); // safe: this no longer triggers fetch

  if (loading) {
    return <p className="text-center py-10 text-gray-600">Loading gigs...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Category: <span className="text-blue-600">{categoryName}</span>
      </h1>

      {gigList.length === 0 ? (
        <p className="text-gray-500 text-lg">No gigs found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigList.map((gig) => (
            <GigCard key={gig._id} gig={gig} categoryName={categoryName} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGigsPage;
