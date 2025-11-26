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
    try {
      const data = await CategoryService.getAllCategories();
      // Ensure data is always an array
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Set to empty array on error
    }
  }, []);

  const createCategory = useCallback(async (name: string) => {
    try {
      const newCategory = await CategoryService.createCategory(name);
      setCategories((prev) => [...prev, newCategory]);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, name: string) => {
    try {
      const updated = await CategoryService.updateCategory(id, name);
      setCategories((prev) => prev.map((cat) => (cat.id === id ? updated : cat)));
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await CategoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }, []);

  const addGigToCategory = useCallback(async (categoryId: string, gigId: string) => {
    try {
      const updated = await CategoryService.addGigToCategory(categoryId, gigId);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? updated : cat))
      );
    } catch (error) {
      console.error("Error adding gig to category:", error);
      throw error;
    }
  }, []);

  const removeGigFromCategory = useCallback(async (categoryId: string, gigId: string) => {
    try {
      const updated = await CategoryService.removeGigFromCategory(categoryId, gigId);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? updated : cat))
      );
    } catch (error) {
      console.error("Error removing gig from category:", error);
      throw error;
    }
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