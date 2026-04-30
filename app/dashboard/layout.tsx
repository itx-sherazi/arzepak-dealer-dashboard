"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";
import { clearStoredToken, getStoredToken } from "@/lib/authToken";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, refreshUser } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    const goMainLogin = () => {
      const base = process.env.NEXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000";
      window.location.href = `${base.replace(/\/$/, "")}/login`;
    };

    if (user?.role === "DEALER") return;

    if (!user) {
      if (getStoredToken()) {
        void refreshUser().then((ok) => {
          if (!ok) goMainLogin();
        });
        return;
      }
      goMainLogin();
      return;
    }

    clearStoredToken();
    goMainLogin();
  }, [loading, user, refreshUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "DEALER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sticky sidebar — desktop */}
      <div className="hidden lg:flex shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-10 overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main scrollable area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 bg-white/90 backdrop-blur px-4 py-3 sticky top-0 z-30 border-b border-slate-200">
          <button type="button" onClick={() => setOpen(true)} className="text-slate-900">
            <Menu size={22} />
          </button>
          <span className="text-slate-900 font-bold text-sm">arzepak Dealer</span>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
