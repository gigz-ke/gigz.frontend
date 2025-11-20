import React, { useState, useEffect, type ReactNode, useCallback } from "react";
import type { Gig, CreateGigDTO, UpdateGigDTO } from "../data/models/Gig";
import { GigService } from "../data/services/gigService";
import { GigContext } from "./GigContext";

interface GigProviderProps {
  children: ReactNode;
}

export const GigProvider: React.FC<GigProviderProps> = ({ children }) => {
  const [gigs, setGigs] = useState<Gig[]>([]);

  const fetchGigs = useCallback(async () => {
    try {
      const data = await GigService.getAll();
      return data; 
    } catch (error) {
      console.error("Failed to fetch gigs:", error);
      return [];
    }
  }, []);

  const getGigById = useCallback(async (id: string) => {
    try {
      return await GigService.getById(id);
    } catch (error) {
      console.error("Failed to get gig:", error);
      return null;
    }
  }, []);

  const createGig = useCallback(async (data: CreateGigDTO) => {
    try {
      const newGig = await GigService.create(data);
      setGigs(prev => [...prev, newGig]);
      return newGig;
    } catch (error) {
      console.error("Failed to create gig:", error);
      throw error;
    }
  }, []);

  const updateGig = useCallback(async (id: string, data: UpdateGigDTO) => {
    try {
      const updated = await GigService.update(id, data);
      setGigs(prev => prev.map(g => (g._id === id ? updated : g)));
      return updated;
    } catch (error) {
      console.error("Failed to update gig:", error);
      throw error;
    }
  }, []);

  const deleteGig = useCallback(async (id: string) => {
    try {
      await GigService.delete(id);
      setGigs(prev => prev.filter(g => g._id !== id));
    } catch (error) {
      console.error("Failed to delete gig:", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true; 
    const fetchData = async () => {
      const data = await fetchGigs();
      if (isMounted) setGigs(data);
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchGigs]);

  return (
    <GigContext.Provider
      value={{ gigs, fetchGigs: async () => setGigs(await fetchGigs()), getGigById, createGig, updateGig, deleteGig }}
    >
      {children}
    </GigContext.Provider>
  );
};
