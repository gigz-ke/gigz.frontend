import { createContext } from "react";
import type { Category } from "../data/models/Category";

export interface CategoryContextType {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addGigToCategory: (categoryId: string, gigId: string) => Promise<void>;
  removeGigFromCategory: (categoryId: string, gigId: string) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);
