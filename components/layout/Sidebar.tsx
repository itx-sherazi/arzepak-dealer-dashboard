"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, Home, PlusCircle, User, LogOut, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const LINKS = [
  { href: "/dashboard",              label: "Dashboard",   icon: LayoutDashboard, exact: true },
  { href: "/dashboard/listings",     label: "My Listings", icon: Home,       exact: true },
  { href: "/dashboard/listings/add", label: "Add Listing", icon: PlusCircle, exact: true },
  // { href: "/dashboard/leads",        label: "Leads",       icon: Users },
  { href: "/dashboard/profile",      label: "Profile",     icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user, dealer, refreshUser } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
    toast.success("Status updated");
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    window.location.href = `${(process.env.NEXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000").replace(/\/$/, "")}/login`;
  };

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 min-h-screen bg-white text-slate-700 flex flex-col shrink-0 border-r border-slate-200">
      {/* Brand */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900">Prop<span className="text-emerald-600">Find</span></span>
        </div>
        <div className="text-xs text-slate-500 mt-1.5">Dealer Dashboard</div>
      </div>

      {/* User */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {dealer?.logo
            ? <img src={dealer.logo} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
            : <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">{user?.name?.[0]?.toUpperCase()}</div>
          }
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate text-slate-900">{user?.name}</div>
            <div className="text-xs text-slate-500 truncate">{dealer?.agencyName || "Dealer"}</div>
          </div>
          {dealer?.isVerified && (
            <div className="w-4 h-4 bg-emerald-500 rounded-full shrink-0 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
            dealer?.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            {dealer?.status || "PENDING"} · {dealer?.package || "BASIC"}
          </span>
          <button type="button" onClick={handleRefresh} title="Refresh status"
            className="text-gray-400 hover:text-emerald-600 transition-colors">
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {LINKS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            aria-current={active(href, exact) ? "page" : undefined}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              active(href, exact)
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon size={17} className={active(href, exact) ? "text-emerald-600" : "text-slate-400"} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors">
          <LogOut size={17} className="text-slate-400" /> Logout
        </button>
      </div>
    </aside>
  );
}
