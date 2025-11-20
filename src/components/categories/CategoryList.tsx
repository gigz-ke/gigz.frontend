import React, { useEffect } from "react";
import { useCategory } from "../../hooks/useCategory";
import { useNavigate } from "react-router-dom";

export const CategoryList: React.FC = () => {
  const { categories, fetchCategories, deleteCategory } = useCategory();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = () => {
    navigate("/categories/add");
  };

  const handleEditCategory = (id: string) => {
    navigate(`/categories/edit/${id}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-16 px-4">
      <div className="w-full max-w-4xl">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-green-900">
            Manage Categories
          </h2>

          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition active:scale-95 shadow"
          >
            + Add Category
          </button>
        </div>

        {/* Empty State */}
        {categories.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center text-gray-600">
            <p className="text-lg">No categories found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-xl shadow flex items-center justify-between hover:shadow-md transition"
              >
                {/* Category Name + Gigs */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {cat.gigs.length} gig{cat.gigs.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  {/* Edit button */}
                  <button
                    onClick={() => handleEditCategory(cat.id)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition active:scale-95"
                  >
                    Edit
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
