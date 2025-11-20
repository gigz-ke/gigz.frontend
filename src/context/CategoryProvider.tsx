import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Category } from "../data/models/Category";
import { CategoryService } from "../data/services/categoryService";
import { CategoryContext } from "./CategoryContext";

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = useCallback(async () => {
    const data = await CategoryService.getAllCategories();
    setCategories(data);
  }, []);

  const createCategory = useCallback(async (name: string) => {
    const newCategory = await CategoryService.createCategory(name);
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  const updateCategory = useCallback(async (id: string, name: string) => {
    const updated = await CategoryService.updateCategory(id, name);
    setCategories((prev) => prev.map((cat) => (cat.id === id ? updated : cat)));
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await CategoryService.deleteCategory(id);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  const addGigToCategory = useCallback(async (categoryId: string, gigId: string) => {
    const updated = await CategoryService.addGigToCategory(categoryId, gigId);
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? updated : cat))
    );
  }, []);

  const removeGigFromCategory = useCallback(async (categoryId: string, gigId: string) => {
    const updated = await CategoryService.removeGigFromCategory(categoryId, gigId);
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? updated : cat))
    );
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        addGigToCategory,
        removeGigFromCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
