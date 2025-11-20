// src/services/CategoryService.ts
import axios from "axios";
import type { Category } from "../models/Category";
import { config } from "../config";

const API_URL = `${config.API_BASE_URL}/categories`;

export const CategoryService = {
  createCategory: async (name: string): Promise<Category> => {
    const res = await axios.post(API_URL, { name });
    return res.data;
  },

  getAllCategories: async (): Promise<Category[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  updateCategory: async (id: string, name: string): Promise<Category> => {
    const res = await axios.put(`${API_URL}/${id}`, { name });
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },

  addGigToCategory: async (categoryId: string, gigId: string): Promise<Category> => {
    const res = await axios.post(`${API_URL}/add-gig`, { categoryId, gigId });
    return res.data;
  },

  removeGigFromCategory: async (categoryId: string, gigId: string): Promise<Category> => {
    const res = await axios.post(`${API_URL}/remove-gig`, { categoryId, gigId });
    return res.data;
  },
};
