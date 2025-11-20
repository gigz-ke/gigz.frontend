import { createContext } from "react";
import type { LoginDTO, User } from "../data/models/User";

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});
