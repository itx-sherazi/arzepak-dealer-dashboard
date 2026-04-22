"use client";
import { createContext, useContext, useCallback, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";
import { clearStoredToken } from "@/lib/authToken";

export interface User { _id: string; name: string; email: string; phone?: string; role: "USER"|"DEALER"|"ADMIN"; avatar?: string; isBanned: boolean; }
export interface Dealer { _id: string; agencyName?: string; status: string; package: string; city: string; isVerified: boolean; bio?: string; whatsapp?: string; areasServed?: string[]; experience?: number; logo?: string; totalListings: number; totalLeads: number; totalViews: number; avgRating: number; }

interface AuthCtx {
  user: User | null;
  dealer: Dealer | null;
  loading: boolean;
  login(e: string, p: string): Promise<void>;
  logout(): Promise<void>;
  refreshUser(): Promise<boolean>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<User|null>(null);
  const [dealer, setDealer] = useState<Dealer|null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; user?: User; dealer?: Dealer | null }>("/auth/me");
      if (res.success && res.user) {
        setUser(res.user);
        setDealer(res.dealer ?? null);
        return true;
      }
      setUser(null);
      setDealer(null);
      clearStoredToken();
      return false;
    } catch {
      setUser(null);
      setDealer(null);
      clearStoredToken();
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    await api.post("/auth/login", { email, password });
    void refreshUser();
  };

  const logout = async () => {
    await api.post("/auth/logout", {});
    clearStoredToken();
    setUser(null);
    setDealer(null);
  };

  return <Ctx.Provider value={{ user, dealer, loading, login, logout, refreshUser }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
