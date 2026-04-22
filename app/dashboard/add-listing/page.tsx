"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { CITIES, AMENITIES, toBase64 } from "@/lib/utils";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";

type Step = 1|2|3|4|5;
const STEPS = ["Purpose & Type","Location","Details","Photos & Amenities","Price & Submit"];

type ImageRef = { url: string; publicId?: string };

export default function AddListingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    purpose: "SALE", type: "HOUSE", city: "Lahore", areaName: "", address: "",
    title: "", description: "", area: "", areaUnit: "MARLA",
    bedrooms: "", bathrooms: "", floors: "", furnishing: "UNFURNISHED", buildYear: "",
    amenities: [] as string[], images: [] as ImageRef[], price: "",
  });

  const s = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const handleImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (form.images.length + files.length > 20) return toast.error("Max 20 images");
    setUploading(true);
    try {
      const b64s = await Promise.all(files.map(toBase64));
      const res = await api.post<{ urls: string[]; images: ImageRef[] }>("/upload", { images: b64s, folder: "arzepak/properties" });
      s("images", [...form.images, ...(res.images || []).filter(Boolean)]);
      toast.success(`${files.length} image(s) uploaded`);
    } catch { toast.error("Upload failed — check Cloudinary config in backend .env"); }
    setUploading(false);
  };

  const toggleAmenity = (a: string) => s("amenities", form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);

  const submit = async () => {
    if (!form.price) return toast.error("Price is required");
    setSubmitting(true);
    try {
      await api.post("/properties", {
        ...form,
        area: Number(form.area), price: Number(form.price),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        floors: form.floors ? Number(form.floors) : undefined,
        buildYear: form.buildYear ? Number(form.buildYear) : undefined,
      });
      toast.success("Listing published successfully!");
      router.push("/dashboard/listings");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Submit failed"); }
    setSubmitting(false);
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
  const lbl = "block text-sm font-medium text-gray-700 mb-1.5";

  const next = () => {
    if (step === 2 && !form.areaName) return toast.error("Area name required");
    if (step === 3 && (!form.title || !form.description || !form.area)) return toast.error("Fill required fields");
    setStep(s => (s + 1) as Step);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Add New Listing</h1><p className="text-gray-500 text-sm mt-1">Step-by-step property submission</p></div>

      {/* Steps */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-1 shrink-0">
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${step === i+1 ? "bg-green-600 text-white" : step > i+1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0 ${step > i+1 ? "bg-green-600 text-white" : step === i+1 ? "bg-white text-green-600" : "bg-gray-300 text-gray-600"}`}>{step > i+1 ? "✓" : i+1}</span>
              <span className="hidden sm:block">{label}</span>
            </div>
            {i < 4 && <div className={`w-3 h-0.5 ${step > i+1 ? "bg-green-500" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800">Purpose & Type</h2>
            <div><label className={lbl}>Purpose</label>
              <div className="flex gap-3">
                {["SALE","RENT"].map(p => <button key={p} onClick={() => s("purpose",p)} className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.purpose===p?"border-green-600 bg-green-50 text-green-700":"border-gray-200 text-gray-500"}`}>{p==="SALE"?"For Sale":"For Rent"}</button>)}
              </div></div>
            <div><label className={lbl}>Property Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["HOUSE","APARTMENT","PLOT","COMMERCIAL","FARMHOUSE","ROOM"].map(t => <button key={t} onClick={() => s("type",t)} className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${form.type===t?"border-green-600 bg-green-50 text-green-700":"border-gray-200 text-gray-500"}`}>{t}</button>)}
              </div></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800">Location</h2>
            <div><label className={lbl}>City</label><select value={form.city} onChange={e => s("city",e.target.value)} className={inp}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className={lbl}>Area / Society *</label><input type="text" placeholder="e.g. DHA Phase 6" value={form.areaName} onChange={e => s("areaName",e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Street Address (optional)</label><input type="text" placeholder="e.g. Street 5, Block C" value={form.address} onChange={e => s("address",e.target.value)} className={inp} /></div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800">Property Details</h2>
            <div><label className={lbl}>Title *</label><input type="text" placeholder="e.g. Modern 5 Marla House in DHA" value={form.title} onChange={e => s("title",e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Description *</label><textarea rows={4} placeholder="Describe the property..." value={form.description} onChange={e => s("description",e.target.value)} className={`${inp} resize-none`} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Area Size *</label><input type="number" placeholder="5" value={form.area} onChange={e => s("area",e.target.value)} className={inp} /></div>
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
                  <div><label className={lbl}>Furnishing</label><select value={form.furnishing} onChange={e => s("furnishing",e.target.value)} className={inp}>{["UNFURNISHED","SEMI_FURNISHED","FURNISHED"].map(f=><option key={f}>{f.replace("_"," ")}</option>)}</select></div>
                  <div><label className={lbl}>Build Year</label><input type="number" placeholder="2020" value={form.buildYear} onChange={e => s("buildYear",e.target.value)} className={inp} /></div>
                </div>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800">Photos & Amenities</h2>
            <div>
              <label className={lbl}>Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES.map(a => <button key={a} onClick={() => toggleAmenity(a)} className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-left ${form.amenities.includes(a)?"border-green-500 bg-green-50 text-green-700":"border-gray-200 text-gray-500"}`}>{form.amenities.includes(a)?"✓ ":""}{a}</button>)}
              </div>
            </div>
            <div>
              <label className={lbl}>Photos (Max 20)</label>
              <label className={`${inp} flex items-center justify-center gap-2 py-8 border-dashed cursor-pointer hover:bg-gray-50`}>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} disabled={uploading} />
                {uploading ? <span className="text-green-600 text-sm flex items-center gap-2"><div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />Uploading to Cloudinary...</span>
                  : <span className="text-gray-400 text-sm flex items-center gap-2"><Upload size={18} />Click to upload photos</span>}
              </label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.url} alt="" className="w-full h-20 object-cover rounded-xl" />
                      <button onClick={() => s("images", form.images.filter((_,j)=>j!==i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-bold text-gray-800">Price & Submit</h2>
            <div><label className={lbl}>Price (PKR) *</label><input type="number" placeholder="25000000" value={form.price} onChange={e => s("price",e.target.value)} className={inp} /></div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
              {[["Purpose",form.purpose],["Type",form.type],["City",form.city],["Area",form.areaName||"—"],["Size",form.area?`${form.area} ${form.areaUnit}`:"—"],["Photos",`${form.images.length}`],["Amenities",`${form.amenities.length} selected`]].map(([l,v])=>(
                <div key={l} className="flex justify-between"><span className="text-gray-500">{l}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && <button onClick={() => setStep(s=>(s-1) as Step)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50">← Back</button>}
          {step < 5
            ? <button onClick={next} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold">Next →</button>
            : <button onClick={submit} disabled={submitting || !form.price} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold">{submitting ? "Submitting..." : "Submit Listing"}</button>
          }
        </div>
      </div>
    </div>
  );
}
