"use client";

import { useEffect } from "react";
import { getStoredToken, setStoredToken } from "@/lib/authToken";

const mainAppLogin = () => {
  const base = process.env.NEXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000";
  window.location.href = `${base.replace(/\/$/, "")}/login`;
};

/**
 * Main site redirects here with JWT in the URL hash.
 * Do NOT call replaceState on the hash before navigating — React Strict Mode
 * remounts this component; a second run would see an empty hash and send the
 * user back to the main app. If the hash is already gone, sessionStorage
 * from the first run is used.
 */
export default function AuthSyncPage() {
  useEffect(() => {
    const fromHash = window.location.hash.replace(/^#/, "");
    const fromStorage = getStoredToken();

    let token: string | null = null;
    if (fromHash) {
      try {
        const decoded = decodeURIComponent(fromHash);
        if (decoded.split(".").length === 3) token = decoded;
      } catch {
        token = null;
      }
    }
    if (!token && fromStorage && fromStorage.split(".").length === 3) {
      token = fromStorage;
    }

    if (!token) {
      const t = setTimeout(() => mainAppLogin(), 1200);
      return () => clearTimeout(t);
    }

    setStoredToken(token);
    window.location.assign(`${window.location.origin}/dashboard`);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-600">Signing you in…</p>
      </div>
    </div>
  );
}
