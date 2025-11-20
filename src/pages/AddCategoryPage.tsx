import React, { useState } from "react";
import { useCategory } from "../hooks/useCategory";
import { useNavigate } from "react-router-dom";

export const AddCategoryPage: React.FC = () => {
  const { createCategory } = useCategory();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createCategory(name.trim());
      setName("");

      // Success message
      setMessage("Category created successfully!");

      // Redirect after a short delay
      setTimeout(() => navigate("/categories"), 800);
    } catch {
      setMessage("Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center items-center py-16 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        {/* Title */}
        <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">
          Add New Category
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
            {loading ? "Saving..." : "Add Category"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-green-700 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
