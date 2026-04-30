"use client";
import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

export interface FeaturesData {
  flooring: string;
  electricityBackup: string;
  otherMainFeatures: string;
  builtYear: string;
  parkingSpaces: string;
  floors: string;
  centralAirConditioning: boolean;
  centralHeating: boolean;
  wasteDisposal: boolean;
  elevatorOrLift: boolean;
  otherRooms: string;
  rooms: string;
  otherBizComm: string;
  broadbandInternet: boolean;
  satelliteOrCableTv: boolean;
  nearbySchools: string;
  nearbyHospitals: string;
  nearbyShoppingMalls: string;
  nearbyRestaurants: string;
  distanceFromAirport: string;
  nearbyPublicTransport: string;
  otherNearbyPlaces: string;
  otherFacilities: string;
  maintenanceStaff: boolean;
  securityStaff: boolean;
}

export const defaultFeatures = (): FeaturesData => ({
  flooring: "", electricityBackup: "", otherMainFeatures: "",
  builtYear: "", parkingSpaces: "", floors: "",
  centralAirConditioning: false, centralHeating: false,
  wasteDisposal: false, elevatorOrLift: false,
  otherRooms: "", rooms: "",
  otherBizComm: "", broadbandInternet: false, satelliteOrCableTv: false,
  nearbySchools: "", nearbyHospitals: "", nearbyShoppingMalls: "",
  nearbyRestaurants: "", distanceFromAirport: "", nearbyPublicTransport: "",
  otherNearbyPlaces: "", otherFacilities: "",
  maintenanceStaff: false, securityStaff: false,
});

const TABS = ["Main Features", "Rooms", "Business and Communication", "Nearby Locations and Other Facilities", "Other Facilities"] as const;
type Tab = typeof TABS[number];

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 bg-white";

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white hover:border-gray-200 transition-colors">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <div className="relative">
        <button type="button" onClick={() => setOpen(o => !o)}
          className={`flex items-center gap-2 border-2 rounded-lg px-4 py-1.5 text-sm min-w-[130px] justify-between transition-colors ${open ? "border-green-500 text-green-700" : "border-gray-200 text-gray-500"}`}>
          <span>{value || ""}</span>
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
            {options.map(o => (
              <button key={o} type="button"
                onClick={() => { onChange(o); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-green-50 hover:text-green-700 transition-colors ${value === o ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700"}`}>
                {o}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <input type="number" min={0} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ""}
        className="border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-green-500 text-center" />
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:border-green-500" />
    </div>
  );
}

function CheckField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white">
      <span className="text-sm text-gray-700 font-medium">{label}</span>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-green-600 cursor-pointer" />
    </div>
  );
}

interface Props {
  open: boolean;
  features: FeaturesData;
  onChange: (f: FeaturesData) => void;
  onClose: () => void;
}

export default function AmenitiesModal({ open, features, onChange, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("Main Features");
  if (!open) return null;

  const set = (key: keyof FeaturesData, val: string | boolean) =>
    onChange({ ...features, [key]: val });

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Feature and Amenities</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100 px-4 overflow-x-auto flex-shrink-0 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors -mb-px ${
                tab === t ? "border-green-600 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {tab === "Main Features" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectField label="Flooring" value={features.flooring}
                options={["Tiles", "Marble", "Wooden", "Chip", "Cement", "Other"]}
                onChange={v => set("flooring", v)} />
              <SelectField label="Electricity Backup" value={features.electricityBackup}
                options={["None", "Generator", "UPS", "Solar", "Other"]}
                onChange={v => set("electricityBackup", v)} />
              <TextField label="Other Main Features" value={features.otherMainFeatures} onChange={v => set("otherMainFeatures", v)} />
              <NumberField label="Built in year" value={features.builtYear} onChange={v => set("builtYear", v)} placeholder="e.g. 2020" />
              <NumberField label="Parking Spaces" value={features.parkingSpaces} onChange={v => set("parkingSpaces", v)} />
              <NumberField label="Floors" value={features.floors} onChange={v => set("floors", v)} />
              <CheckField label="Central Air Conditioning" value={features.centralAirConditioning} onChange={v => set("centralAirConditioning", v)} />
              <CheckField label="Central Heating" value={features.centralHeating} onChange={v => set("centralHeating", v)} />
              <CheckField label="Waste Disposal" value={features.wasteDisposal} onChange={v => set("wasteDisposal", v)} />
              <CheckField label="Elevator or Lift" value={features.elevatorOrLift} onChange={v => set("elevatorOrLift", v)} />
            </div>
          )}

          {tab === "Rooms" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberField label="Other Rooms" value={features.otherRooms} onChange={v => set("otherRooms", v)} />
              <NumberField label="Rooms" value={features.rooms} onChange={v => set("rooms", v)} />
            </div>
          )}

          {tab === "Business and Communication" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField label="Other Business and Communication Facilities" value={features.otherBizComm} onChange={v => set("otherBizComm", v)} />
              <CheckField label="Broadband Internet Access" value={features.broadbandInternet} onChange={v => set("broadbandInternet", v)} />
              <CheckField label="Satellite or Cable TV Ready" value={features.satelliteOrCableTv} onChange={v => set("satelliteOrCableTv", v)} />
            </div>
          )}

          {tab === "Nearby Locations and Other Facilities" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberField label="Nearby Schools" value={features.nearbySchools} onChange={v => set("nearbySchools", v)} />
              <NumberField label="Nearby Hospitals" value={features.nearbyHospitals} onChange={v => set("nearbyHospitals", v)} />
              <NumberField label="Nearby Shopping Malls" value={features.nearbyShoppingMalls} onChange={v => set("nearbyShoppingMalls", v)} />
              <NumberField label="Nearby Restaurants" value={features.nearbyRestaurants} onChange={v => set("nearbyRestaurants", v)} />
              <NumberField label="Distance From Airport (kms)" value={features.distanceFromAirport} onChange={v => set("distanceFromAirport", v)} />
              <NumberField label="Nearby Public Transport Service" value={features.nearbyPublicTransport} onChange={v => set("nearbyPublicTransport", v)} />
              <TextField label="Other Nearby Places" value={features.otherNearbyPlaces} onChange={v => set("otherNearbyPlaces", v)} />
            </div>
          )}

          {tab === "Other Facilities" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField label="Other Facilities" value={features.otherFacilities} onChange={v => set("otherFacilities", v)} />
              <CheckField label="Maintenance Staff" value={features.maintenanceStaff} onChange={v => set("maintenanceStaff", v)} />
              <CheckField label="Security Staff" value={features.securityStaff} onChange={v => set("securityStaff", v)} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors">
            Add Amenities
          </button>
        </div>
      </div>
    </div>
  );
}
