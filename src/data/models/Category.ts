import type { Gig } from "./Gig";

export interface Category {
  id: string;           // MongoDB _id mapped to id
  name: string;
  gigs: Gig[];          // populated gigs
}
