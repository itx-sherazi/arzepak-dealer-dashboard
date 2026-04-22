"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { CITIES, AMENITIES, toBase64 } from "@/lib/utils";
import toast from "react-hot-toast";
import { Upload, X, RefreshCw, ArrowLeft } from "lucide-react";

type ImageRef = { url: string; publicId?: string };

interface PropertyData {
  _id: string; slug: string; title: string; description: string;
  purpose: string; type: string; city: string; areaName: string; address: string;
  area: number; areaUnit: string; bedrooms?: number; bathrooms?: number;
  floors?: number; furnishing?: string; buildYear?: number;
  price: number; amenities: string[]; images: Array<string | ImageRef>; status: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EditListingPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    purpose: "SALE", type: "HOUSE", city: "Lahore", areaName: "", address: "",
    title: "", description: "", area: "", areaUnit: "MARLA",
    bedrooms: "", bathrooms: "", floors: "", furnishing: "UNFURNISHED", buildYear: "",
    amenities: [] as string[], images: [] as ImageRef[], price: "",
  });

  // Track which image slots are being replaced (index → uploading flag)
  const [replacingIdx, setReplacingIdx] = useState<Record<number, boolean>>({});
  const [addingImages, setAddingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE}/properties/${slug}`, { credentials: "include" });
        const json = await res.json();
        const p: PropertyData = json.data;
        const normalizedImages: ImageRef[] = (p.images || []).map((img) =>
          typeof img === "string" ? { url: img } : img
        ).filter((x): x is ImageRef => Boolean(x?.url));
        setForm({
          purpose: p.purpose || "SALE",
          type: p.type || "HOUSE",
          city: p.city || "Lahore",
          areaName: p.areaName || "",
          address: p.address || "",
          title: p.title || "",
          description: p.description || "",
          area: String(p.area || ""),
          areaUnit: p.areaUnit || "MARLA",
          bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
          bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
          floors: p.floors != null ? String(p.floors) : "",
          furnishing: p.furnishing || "UNFURNISHED",
          buildYear: p.buildYear != null ? String(p.buildYear) : "",
          amenities: p.amenities || [],
          images: normalizedImages,
          price: String(p.price || ""),
        });
      } catch { toast.error("Failed to load property"); }
      setLoading(false);
    })();
  }, [slug]);

  const s = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const toggleAmenity = (a: string) => s("amenities", form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);

  // Remove an image from the list (backend will delete from Cloudinary on save)
  const removeImage = (idx: number) => {
    s("images", form.images.filter((_, i) => i !== idx));
  };

  // Replace a specific image slot — upload new → swap URL at that index
  const replaceImage = async (idx: number, file: File) => {
    setReplacingIdx(r => ({ ...r, [idx]: true }));
    try {
      const b64 = await toBase64(file);
      const res = await api.post<{ urls: string[]; images: ImageRef[] }>("/upload", { images: [b64], folder: "arzepak/properties" });
      const newImg = res.images?.[0];
      if (!newImg?.url) throw new Error("Upload failed");
      setForm(f => {
        const imgs = [...f.images];
        imgs[idx] = newImg;
        return { ...f, images: imgs };
      });
      toast.success("Image replaced");
    } catch { toast.error("Replace failed"); }
    setReplacingIdx(r => ({ ...r, [idx]: false }));
  };

  // Add new images (appended to the list)
  const addImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (form.images.length + files.length > 20) return toast.error("Max 20 images");
    setAddingImages(true);
    try {
      const b64s = await Promise.all(files.map(toBase64));
      const res = await api.post<{ urls: string[]; images: ImageRef[] }>("/upload", { images: b64s, folder: "arzepak/properties" });
      s("images", [...form.images, ...(res.images || []).filter(Boolean)]);
      toast.success(`${files.length} image(s) added`);
    } catch { toast.error("Upload failed"); }
    setAddingImages(false);
    e.target.value = "";
  };

  const save = async () => {
    if (!form.title) return toast.error("Title is required");
    if (!form.price) return toast.error("Price is required");
    if (!form.areaName) return toast.error("Area name is required");
    setSaving(true);
    try {
      await api.put(`/properties/${slug}`, {
        ...form,
        area: Number(form.area),
        price: Number(form.price),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        floors: form.floors ? Number(form.floors) : undefined,
        buildYear: form.buildYear ? Number(form.buildYear) : undefined,
      });
      toast.success("Listing updated!");
      router.push("/dashboard/listings");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Save failed"); }
    setSaving(false);
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
  const lbl = "block text-sm font-medium text-gray-700 mb-1.5";

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Listing</h1>
          <p className="text-gray-500 text-sm mt-0.5 font-mono text-xs">{slug}</p>
        </div>
      </div>

      {/* Section: Purpose & Type */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-green-600">Purpose & Type</h2>
        <div><label className={lbl}>Purpose</label>
          <div className="flex gap-3">
            {["SALE","RENT"].map(p => <button key={p} onClick={() => s("purpose",p)} className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.purpose===p?"border-green-600 bg-green-50 text-green-700":"border-gray-200 text-gray-500"}`}>{p==="SALE"?"For Sale":"For Rent"}</button>)}
          </div>
        </div>
        <div><label className={lbl}>Property Type</label>
          <div className="grid grid-cols-3 gap-2">
            {["HOUSE","APARTMENT","PLOT","COMMERCIAL","FARMHOUSE","ROOM"].map(t => <button key={t} onClick={() => s("type",t)} className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${form.type===t?"border-green-600 bg-green-50 text-green-700":"border-gray-200 text-gray-500"}`}>{t}</button>)}
          </div>
        </div>
      </div>

      {/* Section: Location */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-green-600">Location</h2>
        <div><label className={lbl}>City</label><select value={form.city} onChange={e => s("city",e.target.value)} className={inp}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label className={lbl}>Area / Society *</label><input type="text" placeholder="e.g. DHA Phase 6" value={form.areaName} onChange={e => s("areaName",e.target.value)} className={inp} /></div>
        <div><label className={lbl}>Street Address (optional)</label><input type="text" placeholder="e.g. Street 5, Block C" value={form.address} onChange={e => s("address",e.target.value)} className={inp} /></div>
      </div>

      {/* Section: Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-green-600">Property Details</h2>
        <div><label className={lbl}>Title *</label><input type="text" value={form.title} onChange={e => s("title",e.target.value)} className={inp} /></div>
        <div><label className={lbl}>Description *</label><textarea rows={4} value={form.description} onChange={e => s("description",e.target.value)} className={`${inp} resize-none`} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={lbl}>Area Size *</label><input type="number" value={form.area} onChange={e => s("area",e.target.value)} className={inp} /></div>
          <div><label className={lbl}>Unit</label><select value={form.areaUnit} onChange={e => s("areaUnit",e.target.value)} className={inp}>{["MARLA","KANAL","SQFT","SQYD"].map(u=><option key={u}>{u}</option>)}</select></div>
        </div>
        {form.type !== "PLOT" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[{l:"Beds",k:"bedrooms"},{l:"Baths",k:"bathrooms"},{l:"Floors",k:"floors"}].map(f=>(
                <div key={f.k}><label className={lbl}>{f.l}</label><input type="number" placeholder="0" value={form[f.k as keyof typeof form] as string} onChange={e => s(f.k,e.target.value)} className={inp} /></div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Furnishing</label><select value={form.furnishing} onChange={e => s("furnishing",e.target.value)} className={inp}>{["UNFURNISHED","SEMI_FURNISHED","FURNISHED"].map(f=><option key={f} value={f}>{f.replace(/_/g," ")}</option>)}</select></div>
              <div><label className={lbl}>Build Year</label><input type="number" placeholder="2020" value={form.buildYear} onChange={e => s("buildYear",e.target.value)} className={inp} /></div>
            </div>
          </>
        )}
      </div>

      {/* Section: Images */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-green-600">Photos ({form.images.length}/20)</h2>
        <p className="text-xs text-gray-400">Click the refresh icon on any image to replace it individually. Click × to remove it.</p>

        {form.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={`${img.publicId || img.url}-${i}`} className="relative group aspect-square">
                <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl" />
                {/* Overlay buttons */}
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Replace button */}
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={el => { replaceInputRefs.current[i] = el; }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) replaceImage(i, f); e.target.value = ""; }}
                    />
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors" title="Replace image">
                      {replacingIdx[i] ? <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /> : <RefreshCw size={14} className="text-gray-700" />}
                    </div>
                  </label>
                  {/* Remove button */}
                  <button onClick={() => removeImage(i)} className="w-8 h-8 bg-red-500/90 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors" title="Remove image">
                    <X size={14} className="text-white" />
                  </button>
                </div>
                {/* Position badge */}
                <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-md">{i + 1}</div>
              </div>
            ))}
          </div>
        )}

        {/* Add more images */}
        {form.images.length < 20 && (
          <label className={`${inp} flex items-center justify-center gap-2 py-6 border-dashed cursor-pointer hover:bg-gray-50`}>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={addImages} disabled={addingImages} />
            {addingImages
              ? <span className="text-green-600 text-sm flex items-center gap-2"><div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />Uploading...</span>
              : <span className="text-gray-400 text-sm flex items-center gap-2"><Upload size={18} />Add more photos</span>}
          </label>
        )}
      </div>

      {/* Section: Amenities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-green-600">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITIES.map(a => <button key={a} onClick={() => toggleAmenity(a)} className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${form.amenities.includes(a)?"border-green-500 bg-green-50 text-green-700":"border-gray-200 text-gray-500"}`}>{form.amenities.includes(a)?"✓ ":""}{a}</button>)}
        </div>
      </div>

      {/* Section: Price */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wide text-green-600">Price</h2>
        <div><label className={lbl}>Price (PKR) *</label><input type="number" placeholder="25000000" value={form.price} onChange={e => s("price",e.target.value)} className={inp} /></div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-8">
        <button onClick={() => router.back()} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
        <button onClick={save} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
