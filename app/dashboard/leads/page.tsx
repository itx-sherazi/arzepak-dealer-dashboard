"use client";
import useSWR from "swr";
import { useState } from "react";
import { formatDate, statusColor } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Phone, Mail, MessageSquare } from "lucide-react";

import { fetcher } from "@/lib/fetcher";

interface Lead {
  _id: string; name: string; email: string; phone: string; message: string; status: string; createdAt: string;
  propertyId: { _id: string; title: string; city: string; images: string[]; price: number };
}

const STATUSES = ["NEW","CONTACTED","CONVERTED","CLOSED"];

export default function LeadsPage() {
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string|null>(null);

  const q = `/dealers/me/leads?page=${page}&limit=15${filter !== "ALL" ? `&status=${filter}` : ""}`;
  const { data, isLoading, mutate } = useSWR<{ data: Lead[]; total: number; pages: number }>(q, fetcher);

  const updateStatus = async (id: string, status: string) => {
    try { await api.patch(`/dealers/leads/${id}`, { status }); toast.success("Updated"); mutate(); }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Leads & Inquiries</h1><p className="text-gray-500 text-sm">{data?.total ?? 0} total leads</p></div>
        <div className="flex gap-2 flex-wrap">
          {["ALL",...STATUSES].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${filter===s?"bg-green-600 text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
          ))}
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
      : !data?.data?.length ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-5xl mb-3">📩</div>
          <h3 className="font-semibold text-gray-700">No leads yet</h3>
          <p className="text-gray-400 text-sm mt-1">Leads appear when buyers contact you through listings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.data.map(lead => (
            <div key={lead._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={lead.propertyId?.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80"} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400">Inquiry for</div>
                    <div className="font-semibold text-gray-800 text-sm truncate">{lead.propertyId?.title}</div>
                    <div className="text-xs text-gray-400">{lead.propertyId?.city}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{lead.name}</div>
                  <div className="flex items-center gap-4 mt-1">
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600"><Phone size={12}/>{lead.phone}</a>
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600"><Mail size={12}/>{lead.email}</a>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(lead.createdAt)}</div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(lead.status)}`}>{lead.status}</span>
                  <select value={lead.status} onChange={e => updateStatus(lead._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500">
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setExpanded(expanded===lead._id?null:lead._id)}
                    className="text-xs text-green-600 flex items-center gap-1 hover:underline">
                    <MessageSquare size={12}/>{expanded===lead._id?"Hide":"Message"}
                  </button>
                </div>
              </div>
              {expanded === lead._id && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  <div className="bg-gray-50 rounded-xl p-4 mt-3 text-sm text-gray-600">{lead.message}</div>
                  <div className="flex gap-2 mt-3">
                    <a href={`https://wa.me/${lead.phone}`} target="_blank" rel="noreferrer" className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-xl text-center">WhatsApp</a>
                    <a href={`tel:${lead.phone}`} className="flex-1 border border-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl text-center hover:bg-gray-50">Call</a>
                    <a href={`mailto:${lead.email}`} className="flex-1 border border-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-xl text-center hover:bg-gray-50">Email</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {(data?.pages ?? 0) > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40">← Prev</button>
          <span className="text-sm text-gray-500 self-center">Page {page} of {data?.pages}</span>
          <button disabled={page===data?.pages} onClick={() => setPage(p=>p+1)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  );
}
