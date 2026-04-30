"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toBase64 } from "@/lib/utils";
import AmenitiesModal, { defaultFeatures } from "@/components/AmenitiesModal";
import type { FeaturesData } from "@/components/AmenitiesModal";
import PhoneField from "@/components/PhoneField";
import toast from "react-hot-toast";
import {
  Home, Building2, DollarSign, Maximize2, Bed, Bath,
  Upload, X, Plus, Loader2, CheckCircle2, ChevronDown,
  MapPin,
} from "lucide-react";

/* ── types & constants ───────────────────────────── */
type ImageRef = { url: string; publicId?: string };

/* SVG icons — same monochrome style as Zameen.com */
const Icons: Record<string, React.ReactNode> = {
  Sell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 22V12h6v10"/>
    </svg>
  ),
  Rent: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <circle cx="12" cy="12" r="9"/><path d="M12 6v6l3 3"/>
    </svg>
  ),
  House: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 22V12h6v10"/>
    </svg>
  ),
  Flat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
    </svg>
  ),
  UpperPortion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="9" rx="1"/><rect x="3" y="12" width="18" height="9" rx="1" opacity="0.3"/><path d="M9 3v9M15 3v9"/>
    </svg>
  ),
  LowerPortion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="9" rx="1" opacity="0.3"/><rect x="3" y="12" width="18" height="9" rx="1"/><path d="M9 12v9M15 12v9"/>
    </svg>
  ),
  Room: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M10 21V8a1 1 0 011-1h2a1 1 0 011 1v13"/><circle cx="12" cy="14" r="1" fill="currentColor"/>
    </svg>
  ),
  FarmHouse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M2 12L12 3l10 9"/><path d="M5 10v9a1 1 0 001 1h12a1 1 0 001-1v-9"/><rect x="9" y="14" width="6" height="6"/>
    </svg>
  ),
  Penthouse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M3 21h18M5 21V9l7-6 7 6v12"/><path d="M10 21v-6h4v6"/>
      <path d="M9 9h6" strokeDasharray="2 1"/>
    </svg>
  ),
  ResidentialPlot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 8h18M8 3v18"/>
    </svg>
  ),
  CommercialPlot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 8h18M8 3v18M14 3v18M3 14h18"/>
    </svg>
  ),
  Agricultural: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M12 22V12"/><path d="M12 12C12 7 8 4 3 4c0 5 3 8 9 8z"/><path d="M12 12c0-5 4-8 9-8 0 5-3 8-9 8z"/>
      <path d="M3 22h18"/>
    </svg>
  ),
  IndustrialLand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="2" y="10" width="20" height="11" rx="1"/><path d="M7 10V6M17 10V6M2 15h20M7 15v6M12 15v6M17 15v6"/>
    </svg>
  ),
  PlotFile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>
    </svg>
  ),
  PlotForm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>
    </svg>
  ),
  Office: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="2" y="3" width="20" height="18" rx="1"/><path d="M16 3v18M2 9h20M2 15h14"/>
    </svg>
  ),
  Shop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M4 7h16l1 5H3L4 7z"/><rect x="3" y="12" width="18" height="9" rx="1"/><path d="M9 12v9M15 12v9"/>
    </svg>
  ),
  Warehouse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M2 12L12 4l10 8"/><rect x="4" y="12" width="16" height="9" rx="0.5"/><rect x="9" y="16" width="6" height="5"/>
    </svg>
  ),
  Factory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <path d="M2 21h20M4 21V9l5 4V9l5 4V9l5 4V4"/><path d="M4 9v12M9 13v8M14 13v8M19 8v13"/>
    </svg>
  ),
  Building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 2v20M4 7h5M4 12h5M4 17h5M15 7h1M15 12h1M15 17h1"/>
    </svg>
  ),
  Other: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4">
      <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
    </svg>
  ),
};

const PURPOSES = [
  { value: "SALE", label: "Sell",  iconKey: "Sell" },
  { value: "RENT", label: "Rent",  iconKey: "Rent" },
];

const TYPE_GROUPS = [
  {
    label: "Home",
    types: [
      { value: "HOUSE",         label: "House",          iconKey: "House" },
      { value: "APARTMENT",     label: "Flat",            iconKey: "Flat" },
      { value: "UPPER_PORTION", label: "Upper Portion",   iconKey: "UpperPortion" },
      { value: "LOWER_PORTION", label: "Lower Portion",   iconKey: "LowerPortion" },
      { value: "ROOM",          label: "Room",            iconKey: "Room" },
      { value: "FARMHOUSE",     label: "Farm House",      iconKey: "FarmHouse" },
      { value: "PENTHOUSE",     label: "Penthouse",       iconKey: "Penthouse" },
    ],
  },
  {
    label: "Plots",
    types: [
      { value: "RESIDENTIAL_PLOT", label: "Residential Plot",  iconKey: "ResidentialPlot" },
      { value: "COMMERCIAL_PLOT",  label: "Commercial Plot",   iconKey: "CommercialPlot" },
      { value: "AGRICULTURAL",     label: "Agricultural Land", iconKey: "Agricultural" },
      { value: "INDUSTRIAL_LAND",  label: "Industrial Land",   iconKey: "IndustrialLand" },
      { value: "PLOT_FILE",        label: "Plot File",         iconKey: "PlotFile" },
      { value: "PLOT_FORM",        label: "Plot Form",         iconKey: "PlotForm" },
    ],
  },
  {
    label: "Commercial",
    types: [
      { value: "OFFICE",    label: "Office",    iconKey: "Office" },
      { value: "SHOP",      label: "Shop",      iconKey: "Shop" },
      { value: "WAREHOUSE", label: "Warehouse", iconKey: "Warehouse" },
      { value: "FACTORY",   label: "Factory",   iconKey: "Factory" },
      { value: "BUILDING",  label: "Building",  iconKey: "Building" },
      { value: "OTHER",     label: "Other",     iconKey: "Other" },
    ],
  },
];

const AREA_UNITS = ["Marla", "Kanal", "Sq. Ft.", "Sq. Yd."];
const AREA_UNIT_MAP: Record<string, string> = {
  "Marla": "MARLA", "Kanal": "KANAL", "Sq. Ft.": "SQFT", "Sq. Yd.": "SQYD",
};

const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "6+"];
const FURNISHING_OPTIONS = ["Unfurnished", "Semi-Furnished", "Furnished"];
const FURNISHING_MAP: Record<string, string> = {
  "Unfurnished": "UNFURNISHED", "Semi-Furnished": "SEMI_FURNISHED", "Furnished": "FURNISHED",
};

const PLOT_TYPES = new Set(["RESIDENTIAL_PLOT","COMMERCIAL_PLOT","AGRICULTURAL","INDUSTRIAL_LAND","PLOT_FILE","PLOT_FORM"]);
const COMMERCIAL_TYPES = new Set(["OFFICE","SHOP","WAREHOUSE","FACTORY","BUILDING","OTHER"]);

function extractYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

/* ── section wrapper ─────────────────────────────── */
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
  );
}

/* ── main component ──────────────────────────────── */
export default function AddListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving]             = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const uploadBusy = uploadingSlot !== null;

  /* form state */
  const [purpose, setPurpose]         = useState("SALE");
  const [typeGroup, setTypeGroup]     = useState("Home");
  const [propType, setPropType]       = useState("HOUSE");
  const [city, setCity]               = useState("");
  const [areaName, setAreaName]       = useState("");
  const [address, setAddress]         = useState("");
  const [area, setArea]               = useState("");
  const [areaUnit, setAreaUnit]       = useState("Marla");
  const [price, setPrice]             = useState("");
  const [installmentAvailable, setInstallmentAvailable] = useState(false);
  const [advanceAmount, setAdvanceAmount]               = useState("");
  const [noOfInstallments, setNoOfInstallments]         = useState("");
  const [monthlyInstallment, setMonthlyInstallment]     = useState("");
  const [balloonPayment, setBalloonPayment]             = useState(false);
  const [balloonAmount, setBalloonAmount]               = useState("");
  const [noOfBalloonPayments, setNoOfBalloonPayments]   = useState("");
  const [ballotingFee, setBallotingFee]                 = useState({ enabled: false, amount: "" });
  const [possessionFee, setPossessionFee]               = useState({ enabled: false, amount: "" });
  const [developmentFee, setDevelopmentFee]             = useState({ enabled: false, amount: "" });
  const [bedrooms, setBedrooms]       = useState("");
  const [bathrooms, setBathrooms]     = useState("");
  const [furnishing, setFurnishing]   = useState("Unfurnished");
  const [amenities, setAmenities]     = useState<string[]>([]);
  const [features, setFeatures]       = useState<FeaturesData>(defaultFeatures());
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages]           = useState<ImageRef[]>([]);
  const [videoUrls, setVideoUrls]     = useState<string[]>([]);
  const [contactEmail, setContactEmail]   = useState("");
  const [mobiles, setMobiles]             = useState<string[]>(["92"]);
  const [landline, setLandline]           = useState("92");

  const isPlot       = PLOT_TYPES.has(propType);
  const isCommercial = COMMERCIAL_TYPES.has(propType);
  const showBedBath  = !isPlot && !isCommercial;

  const uploadImages = async (
    files: FileList | null,
    slot: string,
    onDone: (refs: ImageRef[]) => void,
  ) => {
    if (!files?.length) return;
    setUploadingSlot(slot);
    try {
      const b64s = await Promise.all(Array.from(files).map(toBase64));
      const r = await api.post<{ urls: string[]; images: ImageRef[] }>("/upload", {
        images: b64s, folder: "propfind/properties",
      });
      onDone(r.images ?? r.urls.map(url => ({ url })));
      toast.success(`${(r.images ?? r.urls).length} image(s) uploaded`);
    } catch { toast.error("Upload failed"); }
    setUploadingSlot(null);
  };


  const submit = async () => {
    if (!city)        return toast.error("Please select a city");
    if (!areaName)    return toast.error("Please enter location / area");
    if (!area)        return toast.error("Please enter area size");
    if (!price)       return toast.error("Please enter price");
    if (!title)       return toast.error("Please enter a title");
    if (!description) return toast.error("Please enter a description");

    setSaving(true);
    try {
      await api.post("/properties", {
        purpose,
        type: propType,
        city,
        areaName,
        address,
        area: Number(area),
        areaUnit: AREA_UNIT_MAP[areaUnit] ?? "MARLA",
        price: Number(price),
        bedrooms: bedrooms && bedrooms !== "Studio" ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        furnishing: FURNISHING_MAP[furnishing],
        title,
        description,
        images: images.map(i => i.url),
        videoUrls: videoUrls.filter(u => u.trim()),
        contactEmail: contactEmail.trim() || undefined,
        contactMobiles: mobiles.filter(m => m.trim()),
        contactLandline: landline.trim() || undefined,
        features: {
          ...features,
          builtYear: features.builtYear ? Number(features.builtYear) : undefined,
          parkingSpaces: features.parkingSpaces ? Number(features.parkingSpaces) : undefined,
          floors: features.floors ? Number(features.floors) : undefined,
          otherRooms: features.otherRooms ? Number(features.otherRooms) : undefined,
          rooms: features.rooms ? Number(features.rooms) : undefined,
          nearbySchools: features.nearbySchools ? Number(features.nearbySchools) : undefined,
          nearbyHospitals: features.nearbyHospitals ? Number(features.nearbyHospitals) : undefined,
          nearbyShoppingMalls: features.nearbyShoppingMalls ? Number(features.nearbyShoppingMalls) : undefined,
          nearbyRestaurants: features.nearbyRestaurants ? Number(features.nearbyRestaurants) : undefined,
          distanceFromAirport: features.distanceFromAirport ? Number(features.distanceFromAirport) : undefined,
          nearbyPublicTransport: features.nearbyPublicTransport ? Number(features.nearbyPublicTransport) : undefined,
        },
        installmentAvailable,
        advanceAmount: advanceAmount ? Number(advanceAmount) : undefined,
        noOfInstallments: noOfInstallments ? Number(noOfInstallments) : undefined,
        monthlyInstallment: monthlyInstallment ? Number(monthlyInstallment) : undefined,
        balloonPayment,
        balloonAmount: balloonAmount ? Number(balloonAmount) : undefined,
        noOfBalloonPayments: noOfBalloonPayments ? Number(noOfBalloonPayments) : undefined,
        ballotingFee: ballotingFee.enabled && ballotingFee.amount ? Number(ballotingFee.amount) : undefined,
        possessionFee: possessionFee.enabled && possessionFee.amount ? Number(possessionFee.amount) : undefined,
        developmentFee: developmentFee.enabled && developmentFee.amount ? Number(developmentFee.amount) : undefined,
      });
      toast.success("Listing submitted for review!");
      router.push("/dashboard/listings");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to submit");
    }
    setSaving(false);
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white";

  return (
    <div className="w-full space-y-5 pb-16">
      {/* Page header */}
      <div className="pt-1">  
        <h1 className="text-2xl font-bold text-gray-900">Add New Listing</h1>
        <p className="text-sm text-gray-400 mt-0.5">Fill in the details below to post your property</p>
      </div>

      {/* ── 1. Purpose + Type + Location (combined) ── */}
      <Section icon={<MapPin size={18} />} title="Location and Purpose">

        {/* Purpose */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Select Purpose</label>
          <div className="flex gap-3">
            {PURPOSES.map(p => (
              <button key={p.value} type="button" onClick={() => setPurpose(p.value)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-all ${
                  purpose === p.value
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-200 text-gray-600 hover:border-green-400 bg-white"
                }`}>
                {Icons[p.iconKey]}{p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Property Type */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Select Property Type</label>

          {/* Group tabs */}
          <div className="flex gap-1 border-b border-gray-100 mb-4">
            {TYPE_GROUPS.map(g => (
              <button key={g.label} type="button"
                onClick={() => { setTypeGroup(g.label); setPropType(g.types[0].value); }}
                className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                  typeGroup === g.label
                    ? "text-green-600 border-green-600"
                    : "text-gray-400 border-transparent hover:text-gray-700"
                }`}>
                {g.label}
              </button>
            ))}
          </div>

          {/* Type chips */}
          <div className="flex flex-wrap gap-2">
            {TYPE_GROUPS.find(g => g.label === typeGroup)?.types.map(t => (
              <button key={t.value} type="button" onClick={() => setPropType(t.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                  propType === t.value
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-200 text-gray-600 hover:border-green-300 bg-white"
                }`}>
                <span className={propType === t.value ? "text-green-600" : "text-gray-400"}>
                  {Icons[t.iconKey]}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* City */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">City *</label>
          <input className={inp} placeholder="e.g. Lahore" value={city} onChange={e => setCity(e.target.value)} />
        </div>

        {/* Location / Area */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Location / Area *</label>
          <input className={inp} placeholder="e.g. DHA Phase 5, Bahria Town, Gulberg" value={areaName} onChange={e => setAreaName(e.target.value)} />
        </div>

        {/* Address */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Full Address <span className="text-gray-300 font-normal">(optional)</span>
          </label>
          <input className={inp} placeholder="House no, street, block..."
            value={address} onChange={e => setAddress(e.target.value)} />
        </div>
      </Section>

      {/* ── 2. Price & Area ─────────────────────────── */}
      <Section icon={<DollarSign size={18} />} title="Price and Area">

        {/* Area Size */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Area Size *</label>
          <div className="flex gap-2">
            <input type="number" min={0} className={`${inp} flex-1`} placeholder="Enter Unit"
              value={area} onChange={e => setArea(e.target.value)} />
            <div className="relative">
              <select value={areaUnit} onChange={e => setAreaUnit(e.target.value)}
                className="h-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-8 min-w-[110px]">
                {AREA_UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            {purpose === "RENT" ? "Monthly Rent *" : "Price *"}
          </label>
          <div className="flex gap-2">
            <input type="number" min={0} className={`${inp} flex-1`}
              placeholder="Enter Price"
              value={price} onChange={e => setPrice(e.target.value)} />
            <div className="flex items-center border border-gray-200 rounded-xl px-4 bg-gray-50 text-sm text-gray-500 font-semibold">PKR</div>
          </div>
        </div>

        {/* Installment toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-sm font-semibold text-gray-800">Installment available</div>
            <div className="text-xs text-gray-400">Enable if listing is available on installments</div>
          </div>
          <button type="button" onClick={() => setInstallmentAvailable(v => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${installmentAvailable ? "bg-green-500" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${installmentAvailable ? "translate-x-6" : ""}`} />
          </button>
        </div>

        {/* Installment fields */}
        {installmentAvailable && (
          <div className="space-y-4 border-t border-gray-100 pt-4">

            {/* Advance + No of installments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Advance Amount</label>
                <div className="flex gap-2">
                  <input type="number" min={0} className={`${inp} flex-1`} placeholder="Enter Amount"
                    value={advanceAmount} onChange={e => setAdvanceAmount(e.target.value)} />
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 text-xs text-gray-500 font-semibold">PKR</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">No. of Installments</label>
                <input type="number" min={0} className={inp} placeholder="Enter Number"
                  value={noOfInstallments} onChange={e => setNoOfInstallments(e.target.value)} />
              </div>
            </div>

            {/* Monthly installment */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Monthly Installments</label>
              <div className="flex gap-2">
                <input type="number" min={0} className={`${inp} flex-1`} placeholder="Enter Amount"
                  value={monthlyInstallment} onChange={e => setMonthlyInstallment(e.target.value)} />
                <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-gray-50 text-xs text-gray-500 font-semibold">PKR</div>
              </div>
            </div>

            {/* Balloon Payment toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-sm font-semibold text-gray-800">Balloon Payment Available</div>
                <div className="text-xs text-gray-400">Enable if applicable</div>
              </div>
              <button type="button" onClick={() => setBalloonPayment(v => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${balloonPayment ? "bg-green-500" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${balloonPayment ? "translate-x-6" : ""}`} />
              </button>
            </div>

            {balloonPayment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Balloon Amount</label>
                  <input type="number" min={0} className={inp} placeholder="Enter Amount in PKR"
                    value={balloonAmount} onChange={e => setBalloonAmount(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">No. of Balloon Payments</label>
                  <input type="number" min={0} className={inp} placeholder="Enter Number"
                    value={noOfBalloonPayments} onChange={e => setNoOfBalloonPayments(e.target.value)} />
                </div>
              </div>
            )}

            {/* Fee toggles */}
            {([
              { key: "ballotingFee", label: "Balloting Fee", state: ballotingFee, set: setBallotingFee },
              { key: "possessionFee", label: "Possession Fee", state: possessionFee, set: setPossessionFee },
              { key: "developmentFee", label: "Development Fee", state: developmentFee, set: setDevelopmentFee },
            ] as const).map(({ key, label, state, set }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{label}</div>
                    <div className="text-xs text-gray-400">Enable if applicable</div>
                  </div>
                  <button type="button" onClick={() => set(v => ({ ...v, enabled: !v.enabled }))}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${state.enabled ? "bg-green-500" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${state.enabled ? "translate-x-6" : ""}`} />
                  </button>
                </div>
                {state.enabled && (
                  <input type="number" min={0} className={inp} placeholder="Enter Amount in PKR"
                    value={state.amount} onChange={e => set(v => ({ ...v, amount: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* ── 3. Features & Amenities ─────────────────── */}
      <Section icon={<Building2 size={18} />} title="Feature and Amenities">

        {/* Bedrooms */}
        {showBedBath && (
          <>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block flex items-center gap-1.5">
                <Bed size={13} /> Bedrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {BEDROOM_OPTIONS.map(b => (
                  <button key={b} type="button" onClick={() => setBedrooms(b === bedrooms ? "" : b)}
                    className={`w-12 h-10 rounded-full text-sm font-semibold border-2 transition-all ${bedrooms === b ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-400 bg-white"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block flex items-center gap-1.5">
                <Bath size={13} /> Bathrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {BATHROOM_OPTIONS.map(b => (
                  <button key={b} type="button" onClick={() => setBathrooms(b === bathrooms ? "" : b)}
                    className={`w-12 h-10 rounded-full text-sm font-semibold border-2 transition-all ${bathrooms === b ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-400 bg-white"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Furnishing</label>
              <div className="flex flex-wrap gap-2">
                {FURNISHING_OPTIONS.map(f => (
                  <button key={f} type="button" onClick={() => setFurnishing(f)}
                    className={`px-5 py-2 rounded-full text-sm font-medium border-2 transition-all ${furnishing === f ? "bg-green-50 border-green-500 text-green-700" : "border-gray-200 text-gray-600 hover:border-green-300 bg-white"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px bg-gray-100" />
          </>
        )}

        {/* Add Amenities row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-4 h-4 text-gray-500">
                <path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 22V12h6v10"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Feature and Amenities</div>
              <div className="text-xs text-gray-400 mt-0.5">Add additional features e.g. parking spaces, waste disposal, internet etc.</div>
            </div>
          </div>
          <button type="button" onClick={() => setAmenitiesOpen(true)}
            className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Add Amenities
          </button>
        </div>

        {/* Quality tip */}
        {(() => {
          const filled = Object.values(features).filter(v => v !== "" && v !== false && v !== 0).length;
          const pct = Math.min(100, Math.round((filled / 10) * 100));
          return (
            <div className={`flex items-center justify-between rounded-xl px-4 py-3 border ${pct >= 50 ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${pct >= 50 ? "bg-green-100" : "bg-gray-200"}`}>
                  <CheckCircle2 size={14} className={pct >= 50 ? "text-green-600" : "text-gray-400"} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-700">Quality Tip</div>
                  <div className="text-xs text-gray-400">Add at least 5 amenities</div>
                </div>
              </div>
              <span className={`text-sm font-bold ${pct >= 50 ? "text-green-600" : "text-red-500"}`}>{pct}%</span>
            </div>
          );
        })()}

        {/* Selected features as removable chips */}
        {(() => {
          const FEATURE_LABELS: Record<string, string> = {
            flooring: "Flooring", electricityBackup: "Electricity Backup",
            otherMainFeatures: "Other Main Features", builtYear: "Built in year",
            parkingSpaces: "Parking Spaces", floors: "Floors",
            centralAirConditioning: "Central Air Conditioning", centralHeating: "Central Heating",
            wasteDisposal: "Waste Disposal", elevatorOrLift: "Elevator or Lift",
            otherRooms: "Other Rooms", rooms: "Rooms",
            otherBizComm: "Business Facilities", broadbandInternet: "Broadband Internet",
            satelliteOrCableTv: "Satellite/Cable TV",
            nearbySchools: "Nearby Schools", nearbyHospitals: "Nearby Hospitals",
            nearbyShoppingMalls: "Nearby Malls", nearbyRestaurants: "Nearby Restaurants",
            distanceFromAirport: "Distance from Airport", nearbyPublicTransport: "Public Transport",
            otherNearbyPlaces: "Other Nearby", otherFacilities: "Other Facilities",
            maintenanceStaff: "Maintenance Staff", securityStaff: "Security Staff",
          };
          const chips = (Object.entries(features) as [keyof typeof features, string | boolean][])
            .filter(([, v]) => v !== "" && v !== false)
            .map(([k, v]) => ({
              key: k,
              label: typeof v === "boolean"
                ? FEATURE_LABELS[k]
                : `${FEATURE_LABELS[k]}: ${v}`,
            }));
          if (!chips.length) return null;
          return (
            <div className="flex flex-wrap gap-2">
              {chips.map(({ key, label }) => (
                <span key={key} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {label}
                  <button type="button"
                    onClick={() => setFeatures(f => ({ ...f, [key]: typeof f[key] === "boolean" ? false : "" }))}
                    className="text-gray-400 hover:text-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          );
        })()}
      </Section>

      <AmenitiesModal
        open={amenitiesOpen}
        features={features}
        onChange={setFeatures}
        onClose={() => setAmenitiesOpen(false)}
      />

      {/* ── 4. Ad Information ───────────────────────── */}
      <Section icon={<Maximize2 size={18} />} title="Ad Information">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Property Title *</label>
          <input className={inp} placeholder="e.g. Beautiful House in DHA Phase 5"
            value={title} onChange={e => setTitle(e.target.value)} maxLength={100} />
          <div className="text-right text-xs text-gray-300 mt-1">{title.length}/100</div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Description *</label>
          <textarea rows={5} className={`${inp} resize-none`}
            placeholder="Describe your property — location, features, nearby places, condition etc."
            value={description} onChange={e => setDescription(e.target.value)} maxLength={2000} />
          <div className="text-right text-xs text-gray-300 mt-1">{description.length}/2000</div>
        </div>
      </Section>

      {/* ── 5. Images ───────────────────────────────── */}
      <Section icon={<Upload size={18} />} title="Property Images and Videos">

        {/* Upload zone */}
        <label className={`flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-5 cursor-pointer hover:border-green-400 hover:bg-green-50/20 transition-all relative ${uploadBusy ? "pointer-events-none opacity-50" : ""}`}>
          {uploadingSlot === "gallery" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 z-10">
              <Loader2 className="h-7 w-7 animate-spin text-green-600" />
            </div>
          )}
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-green-100">
            <Upload size={22} className="text-green-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-700">Upload Images of your Property</div>
            <div className="text-xs text-gray-400 mt-0.5">JPG, PNG — max 5MB each · Up to 20 photos</div>
            <div className="text-xs text-green-600 font-semibold mt-1">Ads with pictures get 5× more inquiries</div>
          </div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" disabled={uploadBusy}
            onChange={e => { uploadImages(e.target.files, "gallery", refs => setImages(p => [...p, ...refs])); e.target.value = ""; }} />
        </label>

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100">
                {uploadingSlot === `replace-${i}` && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">COVER</span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
                <button type="button" onClick={() => setImages(p => p.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <X size={12} />
                </button>
                <label className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-white/90 text-gray-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow">
                  Replace
                  <input type="file" accept="image/*" className="hidden" disabled={uploadBusy}
                    onChange={e => {
                      const f = e.target.files; e.target.value = "";
                      uploadImages(f, `replace-${i}`, refs => setImages(p => p.map((x, idx) => idx === i ? refs[0] : x)));
                    }} />
                </label>
              </div>
            ))}

            {/* Add more tile */}
            {images.length < 20 && (
              <label className={`aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/20 transition-all ${uploadBusy ? "pointer-events-none opacity-40" : ""}`}>
                <Plus size={22} className="text-gray-300" />
                <span className="text-[10px] text-gray-400 mt-1 font-medium">Add more</span>
                <input type="file" multiple accept="image/*" className="hidden" disabled={uploadBusy}
                  onChange={e => { uploadImages(e.target.files, "gallery", refs => setImages(p => [...p, ...refs])); e.target.value = ""; }} />
              </label>
            )}
          </div>
        )}

        <div className="h-px bg-gray-100" />

        {/* YouTube videos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
              Videos (YouTube)
            </label>
            <button type="button"
              onClick={() => setVideoUrls(v => [...v, ""])}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors">
              <Plus size={13} /> Add Video
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">Upload videos to YouTube and paste links here.</p>

          {videoUrls.length === 0 && (
            <button type="button" onClick={() => setVideoUrls([""])}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 text-sm text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Add YouTube Video Link
            </button>
          )}

          <div className="space-y-3">
            {videoUrls.map((url, i) => {
              const ytId = extractYoutubeId(url);
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-500"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
                    </div>
                    <input className={`${inp} flex-1`}
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={url}
                      onChange={e => setVideoUrls(v => v.map((x, idx) => idx === i ? e.target.value : x))} />
                    <button type="button"
                      onClick={() => setVideoUrls(v => v.filter((_, idx) => idx !== i))}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                      <X size={15} />
                    </button>
                  </div>
                  {ytId && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 aspect-video">
                      <iframe src={`https://www.youtube.com/embed/${ytId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen title={`Video ${i + 1}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── Contact Information ─────────────────────── */}
      <Section icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-[18px] h-[18px]"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>} title="Contact Information">

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-3.5 h-3.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>
            Email
          </label>
          <input className={inp} type="email" placeholder="your@email.com"
            value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
        </div>

        {/* Mobile numbers */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-3.5 h-3.5"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>
            Mobile
          </label>
          <div className="space-y-2">
            {mobiles.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <PhoneField value={m} onChange={val => setMobiles(prev => prev.map((x, idx) => idx === i ? val : x))} />
                {mobiles.length > 1 && (
                  <button type="button" onClick={() => setMobiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 border border-gray-200 rounded-xl transition-colors flex-shrink-0">
                    <X size={15} />
                  </button>
                )}
                {i === mobiles.length - 1 && mobiles.length < 5 && (
                  <button type="button" onClick={() => setMobiles(prev => [...prev, ""])}
                    className="w-9 h-9 flex items-center justify-center text-green-600 border-2 border-green-500 rounded-xl hover:bg-green-50 transition-colors font-bold flex-shrink-0">
                    <Plus size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Landline */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="w-3.5 h-3.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
            Landline
          </label>
          <PhoneField value={landline} onChange={setLandline} placeholder="xx xxxxxxx" />
        </div>
      </Section>

      {/* ── Submit ──────────────────────────────────── */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="flex-1 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={saving || uploadBusy}
          className="flex-1 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shadow-sm">
          {saving
            ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
            : "Submit Listing"}
        </button>
      </div>
    </div>
  );
}
