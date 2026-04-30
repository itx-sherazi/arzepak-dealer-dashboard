"use client";
import useSWR from "swr";
import { useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate, statusColor } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { MoreVertical, Pencil, Trash2, PlusCircle } from "lucide-react";
import { fetcher } from "@/lib/fetcher";

interface Property {
  _id: string; slug: string; title: string; city: string; areaName: string; price: number;
  type: string; purpose: string; status: string; images: Array<string | { url: string; publicId?: string }>; createdAt: string;
  bedrooms?: number; area: number; areaUnit: string;
}

const STATUSES = ["ALL","ACTIVE","PENDING","REJECTED","EXPIRED","SOLD","RENTED"];

export default function ListingsPage() {
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<string | null>(null);

  const q = `/properties/my?page=${page}&limit=10${filter !== "ALL" ? `&status=${filter}` : ""}`;
  const { data, isLoading, mutate } = useSWR<{ data: Property[]; total: number; pages: number }>(q, fetcher);

  const del = async (slug: string) => {
    if (!confirm("Delete this listing? All images will also be removed from storage.")) return;
    try { await api.delete(`/properties/${slug}`); toast.success("Deleted"); mutate(); } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error"); }
    setMenu(null);
  };

  const setStatus = async (slug: string, status: string) => {
    try { await api.patch(`/properties/${slug}/status`, { status }); toast.success(`Marked as ${status}`); mutate(); } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error"); }
    setMenu(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
          <p className="text-gray-500 text-sm">{data?.total ?? 0} properties</p>
        </div>
        <Link href="/dashboard/listings/add" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 w-fit">
          <PlusCircle size={16} /> Add Listing
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${filter === s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
        ))}
      </div>

      {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      : !data?.data?.length ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-5xl mb-3">🏠</div>
          <h3 className="font-semibold text-gray-700">No listings found</h3>
          <Link href="/dashboard/listings/add" className="inline-block mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">Add First Listing</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                {["Property","Price","Location","Status","Date",""].map(h => <th key={h} className="text-left px-4 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {data.data.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            (typeof p.images?.[0] === "string"
                              ? p.images?.[0]
                              : p.images?.[0]?.url) ||
                            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80"
                          }
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div><div className="font-semibold text-gray-800 line-clamp-1">{p.title}</div><div className="text-xs text-gray-400">{p.type} · {p.purpose}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-green-600 whitespace-nowrap">{formatPrice(p.price)}</td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap hidden md:table-cell">{p.areaName}, {p.city}</td>
                    <td className="px-4 py-4"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(p.status)}`}>{p.status}</span></td>
                    <td className="px-4 py-4 text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="relative">
                        <button onClick={() => setMenu(menu === p._id ? null : p._id)} className="p-1.5 hover:bg-gray-100 rounded-lg"><MoreVertical size={16} className="text-gray-500" /></button>
                        {menu === p._id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-36 py-1">
                            <Link href={`/dashboard/listings/${p.slug}/edit`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><Pencil size={14}/> Edit</Link>
                            {p.status === "ACTIVE" && <>
                              <button onClick={() => setStatus(p.slug, "SOLD")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50">✓ Sold</button>
                              <button onClick={() => setStatus(p.slug, "RENTED")} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50">✓ Rented</button>
                            </>}
                            <button onClick={() => del(p.slug)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14}/> Delete</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(data.pages ?? 0) > 1 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-500">Page {page} of {data.pages}</span>
              <div className="flex gap-2">
                <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                <button disabled={page===data.pages} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
