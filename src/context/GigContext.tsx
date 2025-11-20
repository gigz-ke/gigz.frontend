import { createContext } from "react";
import type { Gig, CreateGigDTO, UpdateGigDTO } from "../data/models/Gig";

export interface GigContextType {
  gigs: Gig[];
  fetchGigs: () => Promise<void>;
  getGigById: (id: string) => Promise<Gig | null>;
  createGig: (data: CreateGigDTO) => Promise<Gig>;
  updateGig: (id: string, data: UpdateGigDTO) => Promise<Gig>;
  deleteGig: (id: string) => Promise<void>;
}

export const GigContext = createContext<GigContextType | undefined>(undefined);
