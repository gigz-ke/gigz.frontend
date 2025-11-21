import React, { useState, useEffect, type ReactNode, useCallback } from "react";
import type { Gig, CreateGigDTO, UpdateGigDTO } from "../data/models/Gig";
import { GigService } from "../data/services/gigService";
import { GigContext } from "./GigContext";
import { useAuth } from "../hooks/useAuth";

interface GigProviderProps {
  children: ReactNode;
}

export const GigProvider: React.FC<GigProviderProps> = ({ children }) => {
  const [gigs, setGigs] = useState<Gig[]>([]);       // all gigs
  const [myGigs, setMyGigs] = useState<Gig[]>([]);   // gigs for logged-in seller
  const { user } = useAuth();

  const fetchGigs = useCallback(async () => {
    try {
      const data = await GigService.getAll();
      setGigs(data);
    } catch (error) {
      console.error("Failed to fetch all gigs:", error);
    }
  }, []);

  const fetchMyGigs = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await GigService.getBySellerId(user.email);
      setMyGigs(data);
    } catch (error) {
      console.error("Failed to fetch my gigs:", error);
    }
  }, [user]);

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
      if (newGig.sellerId === user?.email) setMyGigs(prev => [...prev, newGig]);
      return newGig;
    } catch (error) {
      console.error("Failed to create gig:", error);
      throw error;
    }
  }, [user]);

  const updateGig = useCallback(async (id: string, data: UpdateGigDTO) => {
    try {
      const updated = await GigService.update(id, data);
      setGigs(prev => prev.map(g => (g._id === id ? updated : g)));
      setMyGigs(prev => prev.map(g => (g._id === id ? updated : g)));
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
      setMyGigs(prev => prev.filter(g => g._id !== id));
    } catch (error) {
      console.error("Failed to delete gig:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGigs();
    fetchMyGigs();
  }, [fetchGigs, fetchMyGigs]);

  return (
    <GigContext.Provider
      value={{ gigs, myGigs, fetchGigs, fetchMyGigs, getGigById, createGig, updateGig, deleteGig }}
    >
      {children}
    </GigContext.Provider>
  );
};
