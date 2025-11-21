import { useContext } from "react";
import { GigContext, type GigContextType } from "../context/GigContext";

export const useGigs = (): GigContextType => {
  const context = useContext(GigContext);
  if (!context) throw new Error("useGigs must be used within a GigProvider");
  return context;
};
