"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { CITIES, toBase64 } from "@/lib/utils";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  const { user, dealer, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [form, setForm] = useState({ agencyName: "", bio: "", whatsapp: "", city: "Lahore", areasServed: "", experience: "0", logo: "" });
  const [userForm, setUserForm] = useState({ name: "", phone: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (dealer) setForm({ agencyName: dealer.agencyName||"", bio: dealer.bio||"", whatsapp: dealer.whatsapp||"", city: dealer.city||"Lahore", areasServed: (dealer.areasServed||[]).join(", "), experience: String(dealer.experience||0), logo: dealer.logo||"" });
    if (user) setUserForm({ name: user.name, phone: user.phone||"" });
  }, [dealer, user]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const previousLogo = (form.logo || dealer?.logo || "").trim();
    setUploadingLogo(true);
    try {
      const b64 = await toBase64(file);
      const res = await api.post<{ urls: string[] }>("/upload", {
        images: [b64],
        folder: "arzepak/logos",
        ...(previousLogo && previousLogo.includes("res.cloudinary.com")
          ? { replaceUrl: previousLogo }
          : {}),
      });
      const newUrl = res.urls[0];
      const payload = {
        ...form,
        logo: newUrl,
        experience: Number(form.experience),
        areasServed: form.areasServed.split(",").map((a) => a.trim()).filter(Boolean),
      };
      await api.put("/dealers/me/profile", payload);
      setForm((f) => ({ ...f, logo: newUrl }));
      await refreshUser();
      toast.success("Logo updated");
    } catch {
      toast.error("Upload failed");
    }
    setUploadingLogo(false);
  };

  const saveDealer = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.put("/dealers/me/profile", { ...form, experience: Number(form.experience), areasServed: form.areasServed.split(",").map(a => a.trim()).filter(Boolean) });
      await refreshUser();
      toast.success("Profile updated");
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    setLoading(false);
  };

  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { await api.put("/auth/profile", userForm); await refreshUser(); toast.success("Updated"); }
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    setLoading(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      await api.put("/auth/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    setLoading(false);
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";
  const lbl = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">My Profile</h1><p className="text-gray-500 text-sm">Manage your account and dealer information</p></div>

      <div className={`rounded-xl p-4 flex items-center gap-3 text-sm font-medium border ${dealer?.status==="ACTIVE"?"bg-green-50 text-green-700 border-green-200":dealer?.status==="PENDING"?"bg-yellow-50 text-yellow-700 border-yellow-200":"bg-red-50 text-red-700 border-red-200"}`}>
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dealer?.status==="ACTIVE"?"bg-green-500":dealer?.status==="PENDING"?"bg-yellow-500":"bg-red-500"}`} />
        Account: <strong>{dealer?.status||"PENDING"}</strong>
        {dealer?.status==="PENDING" && " — Under review"}
        {dealer?.isVerified && <span className="ml-auto bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">✓ Verified</span>}
      </div>

      {/* Logo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Agency Logo</h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border-2 border-gray-200">
              {form.logo ? <img src={form.logo} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">{user?.name?.[0]?.toUpperCase()}</div>}
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700">
              <Camera size={13} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
            </label>
          </div>
          <div>
            <div className="font-semibold text-gray-700">{form.agencyName||user?.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{dealer?.package||"BASIC"} Package</div>
            {uploadingLogo && <div className="text-xs text-green-600 mt-1">Uploading...</div>}
          </div>
        </div>
      </div>

      <form onSubmit={saveUser} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800">Personal Information</h2>
        <div><label className={lbl}>Full Name</label><input type="text" value={userForm.name} onChange={e=>setUserForm({...userForm,name:e.target.value})} className={inp} /></div>
        <div><label className={lbl}>Email</label><input type="email" value={user?.email||""} disabled className={`${inp} bg-gray-50 text-gray-400`} /></div>
        <div><label className={lbl}>Phone</label><input type="tel" value={userForm.phone} onChange={e=>setUserForm({...userForm,phone:e.target.value})} className={inp} /></div>
        <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">{loading?"Saving...":"Save Personal Info"}</button>
      </form>

      <form onSubmit={saveDealer} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800">Dealer Information</h2>
        {[{l:"Agency Name",k:"agencyName",p:"City Properties"},{l:"WhatsApp",k:"whatsapp",p:"923XX-XXXXXXX"},{l:"Experience (years)",k:"experience",p:"5"}].map(f=>(
          <div key={f.k}><label className={lbl}>{f.l}</label><input type="text" placeholder={f.p} value={form[f.k as keyof typeof form]} onChange={e=>setForm({...form,[f.k]:e.target.value})} className={inp} /></div>
        ))}
        <div><label className={lbl}>City</label><select value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className={inp}>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label className={lbl}>Areas Served (comma-separated)</label><input type="text" placeholder="DHA, Bahria Town, Gulberg" value={form.areasServed} onChange={e=>setForm({...form,areasServed:e.target.value})} className={inp} /></div>
        <div><label className={lbl}>Bio</label><textarea rows={4} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className={`${inp} resize-none`} /></div>
        <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">{loading?"Saving...":"Save Dealer Info"}</button>
      </form>

      <form onSubmit={changePassword} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800">Change Password</h2>
        {[{l:"Current Password",k:"currentPassword"},{l:"New Password",k:"newPassword"},{l:"Confirm New",k:"confirm"}].map(f=>(
          <div key={f.k}><label className={lbl}>{f.l}</label><input type="password" value={pwForm[f.k as keyof typeof pwForm]} onChange={e=>setPwForm({...pwForm,[f.k]:e.target.value})} className={inp} /></div>
        ))}
        <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">{loading?"Changing...":"Change Password"}</button>
      </form>
    </div>
  );
}
