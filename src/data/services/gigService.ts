import axios from "axios";
import type { Gig, CreateGigDTO, UpdateGigDTO } from "../models/Gig";
import { config } from "../config";

const API_URL = `${config.API_BASE_URL}/gigs`;

export const GigService = {
  async getAll(): Promise<Gig[]> {
    const response = await axios.get<Gig[]>(API_URL);
    return response.data;
  },

  async getById(id: string): Promise<Gig> {
    const response = await axios.get<Gig>(`${API_URL}/${id}`);
    return response.data;
  },

  async create(data: CreateGigDTO): Promise<Gig> {
    const response = await axios.post<Gig>(API_URL, data);
    return response.data;
  },

  async update(id: string, data: UpdateGigDTO): Promise<Gig> {
    const response = await axios.put<Gig>(`${API_URL}/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
  },
};
