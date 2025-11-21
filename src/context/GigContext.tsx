import { createContext } from "react";
import type { Gig, CreateGigDTO, UpdateGigDTO } from "../data/models/Gig";

export interface GigContextType {
  gigs: Gig[];       // all gigs
  myGigs: Gig[];     // gigs for logged-in seller
  fetchGigs: () => Promise<void>;           // fetch all gigs
  fetchMyGigs: () => Promise<void>;         // fetch gigs for logged-in seller
  getGigById: (id: string) => Promise<Gig | null>;
  createGig: (data: CreateGigDTO) => Promise<Gig>;
  updateGig: (id: string, data: UpdateGigDTO) => Promise<Gig>;
  deleteGig: (id: string) => Promise<void>;
}

export const GigContext = createContext<GigContextType | undefined>(undefined);
