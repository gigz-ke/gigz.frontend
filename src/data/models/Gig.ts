export interface Gig {
  _id: string;
  sellerId: string;

  title: string;
  category: string;
  coverImage: string;
  images: string[];
  description: string;

  serviceTitle: string;
  shortDescription: string;
  deliveryTime: number;
  revisionNumber: number;
  features: string[];

  price: number;
}

export interface CreateGigDTO {
  sellerId: string;           // ID of the seller creating the gig
  title: string;              // Gig title
  category: string;           // Category ID or name
  coverImage: string;         // Main image (probably base64 or URL)
  images?: string[];          // Optional array of additional images
  description: string;        // Full gig description
  serviceTitle: string;       // Title of the service offered
  shortDescription: string;   // Brief description for listing
  deliveryTime: number;       // Delivery time in days
  revisionNumber?: number;    // Optional number of revisions
  features?: string[];        // Optional list of features
  price: number;              // Price for the gig
}

export interface UpdateGigDTO {
  sellerId: string; 
  title?: string;
  category?: string;
  coverImage?: string;
  images?: string[];
  description?: string;
  serviceTitle?: string;
  shortDescription?: string;
  deliveryTime?: number;
  revisionNumber?: number;
  features?: string[];
  price?: number;
}