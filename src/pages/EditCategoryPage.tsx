import React, { useState, useEffect } from "react";
import { useCategory } from "../hooks/useCategory";
import { useParams, useNavigate } from "react-router-dom";

export const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // category ID from route
  const navigate = useNavigate();

  const { categories, updateCategory, fetchCategories } = useCategory();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch categories if not already loaded
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  // Pre-fill form when categories load
  useEffect(() => {
    if (id && categories.length > 0) {
      const category = categories.find((cat) => cat.id === id);
      if (category) {
        setName(category.name);
      }
    }
  }, [id, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (id) {
        await updateCategory(id, name.trim());
        setMessage("Category updated successfully!");

        // Redirect after short delay
        setTimeout(() => navigate("/categories"), 800);
      }
    } catch {
      setMessage("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Edit Category
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Enter category name..."
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 transition outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition active:scale-95 shadow-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Category"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("success") ? "text-green-700" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
