"use client";
import useSWR from "swr";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Home, Users, TrendingUp, Clock, PlusCircle } from "lucide-react";
import Link from "next/link";
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

export default function DashboardHome() {
  const { data, isLoading } = useSWR<{ data: Analytics }>("/dealers/me/analytics", fetcher);
  const d = data?.data;

  const chartData = d?.monthlyLeads.map(m => ({ name: MONTHS[m._id.month - 1], Leads: m.count })) ?? [];

  const stats = [
    { label: "Total Listings",  value: d?.totalListings ?? 0,  icon: Home,       color: "bg-green-50 text-green-600",   sub: `${d?.activeListings ?? 0} active` },
    { label: "Total Leads",     value: d?.totalLeads ?? 0,     icon: Users,      color: "bg-blue-50 text-blue-600",     sub: `${d?.newLeads ?? 0} new` },
    { label: "New Leads",       value: d?.newLeads ?? 0,       icon: TrendingUp, color: "bg-purple-50 text-purple-600", sub: "unread" },
  ];

  if (isLoading) return <div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Link href="/dashboard/listings/add"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow">
          <PlusCircle size={16} /> Add Listing
        </Link>
      </div>

      {(d?.pendingListings ?? 0) > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 flex items-center gap-2">
          <Clock size={15} /> <strong>{d?.pendingListings}</strong> listing(s) awaiting admin approval
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-3`}><s.icon size={20} /></div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-green-600 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-green-600" /> Monthly Leads</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Leads" fill="#16a34a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">No lead data yet</div>}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Home size={18} className="text-green-600" /> Recent Listings</h2>
          <div className="space-y-3">
            {d?.topProperties?.length ? d.topProperties.map(p => (
              <div key={p._id} className="flex items-center gap-3">
                <img src={p.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80"} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-gray-400">{p.city} · {formatPrice(p.price)}</div>
                </div>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-6">No listings yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
