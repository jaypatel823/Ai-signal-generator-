import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Simple hook function for better HMR compatibility
export default function useAuth() {
  return useContext(AuthContext);
}
