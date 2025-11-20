import { useContext } from "react";
import { GigContext } from "../context/GigContext";

export const useGigs = () => {
  const context = useContext(GigContext);
  if (!context) throw new Error("useGigs must be used within a GigProvider");
  return context;
};
