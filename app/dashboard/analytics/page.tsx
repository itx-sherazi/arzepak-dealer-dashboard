"use client";
import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, Home, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

import { fetcher } from "@/lib/fetcher";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Analytics {
  totalListings: number; activeListings: number; pendingListings: number;
  totalLeads: number; newLeads: number;
  package: string; packageExpiry?: string;
  topProperties: { _id: string; title: string; city: string; price: number; images: string[] }[];
  monthlyLeads: { _id: { month: number; year: number }; count: number }[];
}

export default function AnalyticsPage() {
  const { data, isLoading } = useSWR<{ data: Analytics }>("/dealers/me/analytics", fetcher);
  const d = data?.data;

  const leadsChart = d?.monthlyLeads.map(m => ({ name: MONTHS[m._id.month-1], Leads: m.count })) ?? [];

  if (isLoading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Analytics</h1><p className="text-gray-500 text-sm">Your performance overview</p></div>

      {/* Package */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-5 text-white">
        <div className="text-xs text-green-200 uppercase tracking-wider mb-1">Current Package</div>
        <div className="text-2xl font-bold">{d?.package || "BASIC"}</div>
        {d?.packageExpiry && <div className="text-green-200 text-sm mt-0.5">Expires: {new Date(d.packageExpiry).toLocaleDateString()}</div>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Listings", value: d?.activeListings ?? 0, icon: Home,       color: "bg-green-50 text-green-600" },
          { label: "Total Leads",     value: d?.totalLeads ?? 0,     icon: Users,      color: "bg-blue-50 text-blue-600" },
          { label: "New Leads",       value: d?.newLeads ?? 0,       icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}><s.icon size={18} /></div>
            <div className="text-2xl font-bold text-gray-800">{s.value.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">Monthly Leads</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={leadsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Leads" fill="#16a34a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4">Recent Listings</h2>
          <div className="space-y-4">
            {d?.topProperties?.length ? d.topProperties.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i===0?"bg-green-500 text-white":i===1?"bg-green-300 text-white":"bg-gray-100 text-gray-500"}`}>{i+1}</div>
                <img src={p.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80"} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-gray-400">{p.city} · {formatPrice(p.price)}</div>
                </div>
              </div>
            )) : <p className="text-gray-400 text-sm text-center py-6">No listings yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
