"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Search, X, ChevronDown } from "lucide-react";
import { CITY_DATA, getAreas, getCityCoords, getAreaCoords } from "@/lib/locationData";
import type { AreaItem } from "@/lib/locationData";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

const ALL_CITIES = CITY_DATA.map(c => c.name);

interface Props {
  city: string;
  areaName: string;
  lat: number;
  lng: number;
  onCityChange: (city: string) => void;
  onAreaChange: (area: string) => void;
  onCoordsChange: (lat: number, lng: number) => void;
}

function Dropdown({
  value, placeholder, options, disabled, onSelect, onClear,
}: {
  value: string; placeholder: string; options: string[];
  disabled?: boolean; onSelect: (v: string) => void; onClear: () => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative" ref={ref}>
      <div className={`flex items-center border-2 rounded-xl bg-white transition-colors ${
        open ? "border-green-500" : "border-gray-200"
      } ${disabled ? "opacity-50" : ""}`}>
        <Search size={14} className="ml-3 text-gray-400 flex-shrink-0" />
        <input
          className="flex-1 px-2.5 py-2.5 text-sm bg-transparent focus:outline-none placeholder-gray-400"
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => !disabled && setOpen(true)}
        />
        {value
          ? <button type="button" onClick={() => { onClear(); setQuery(""); setOpen(false); }}
              className="mr-2 text-gray-400 hover:text-gray-600 flex-shrink-0"><X size={14} /></button>
          : <ChevronDown size={14} className="mr-3 text-gray-400 flex-shrink-0" />
        }
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-[200] left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
          {filtered.map(o => (
            <button key={o} type="button"
              onClick={() => { onSelect(o); setQuery(o); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                value === o
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
              <MapPin size={12} className="text-green-500 flex-shrink-0" />
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LocationPicker({ city, areaName, lat, lng, onCityChange, onAreaChange, onCoordsChange }: Props) {
  const [showMap, setShowMap] = useState(false);
  const areas: AreaItem[] = city ? getAreas(city) : [];

  const handleCitySelect = (v: string) => {
    onCityChange(v);
    onAreaChange("");
    setShowMap(false);
    const [clat, clng] = getCityCoords(v);
    onCoordsChange(clat, clng);
  };

  const handleAreaSelect = (v: string) => {
    onAreaChange(v);
    if (v && city) {
      const coords = getAreaCoords(city, v);
      if (coords) { onCoordsChange(coords[0], coords[1]); setShowMap(true); }
    }
  };

  return (
    <div className="space-y-3">
      {/* City */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">City *</label>
        <Dropdown
          value={city} placeholder="Search city e.g. Lahore, Karachi..."
          options={ALL_CITIES}
          onSelect={handleCitySelect}
          onClear={() => { onCityChange(""); onAreaChange(""); setShowMap(false); onCoordsChange(0, 0); }}
        />
      </div>

      {/* Area */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
          Location / Area *
        </label>
        <Dropdown
          value={areaName}
          placeholder={city ? `Search area in ${city}...` : "Select city first"}
          options={areas.map(a => a.name)}
          disabled={!city}
          onSelect={handleAreaSelect}
          onClear={() => { onAreaChange(""); setShowMap(false); }}
        />
      </div>

      {/* Map */}
      {showMap && lat !== 0 && (
        <div className="rounded-xl overflow-hidden border-2 border-green-200">
          {/* Map header */}
          <div className="flex items-center justify-between px-3 py-2 bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700 truncate">
                {areaName}{city ? `, ${city}` : ""}
              </span>
            </div>
            <span className="text-[10px] text-green-500 font-medium">Drag pin to adjust</span>
          </div>

          {/* Map */}
          <div className="h-52">
            <MapPicker lat={lat} lng={lng} onChange={onCoordsChange} />
          </div>

          {/* Coords */}
          <div className="px-3 py-1.5 bg-green-50 border-t border-green-100">
            <span className="text-[10px] text-green-600 font-mono">{lat}, {lng}</span>
          </div>
        </div>
      )}

      {/* Show map button */}
      {city && !showMap && (
        <button type="button"
          onClick={() => { const [clat, clng] = getCityCoords(city); onCoordsChange(clat, clng); setShowMap(true); }}
          className="flex items-center gap-2 text-xs text-green-600 font-semibold border border-green-200 rounded-lg px-3 py-2 hover:bg-green-50 transition-colors">
          <MapPin size={13} /> Set Location on Map
        </button>
      )}
    </div>
  );
}
