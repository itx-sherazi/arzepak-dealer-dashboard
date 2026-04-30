"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Country { name: string; code: string; dial: string; flag: string; }

const COUNTRIES: Country[] = [
  { name: "Pakistan",             code: "PK", dial: "+92",   flag: "🇵🇰" },
  { name: "United Arab Emirates", code: "AE", dial: "+971",  flag: "🇦🇪" },
  { name: "Saudi Arabia",         code: "SA", dial: "+966",  flag: "🇸🇦" },
  { name: "United Kingdom",       code: "GB", dial: "+44",   flag: "🇬🇧" },
  { name: "United States",        code: "US", dial: "+1",    flag: "🇺🇸" },
  { name: "Canada",               code: "CA", dial: "+1",    flag: "🇨🇦" },
  { name: "Afghanistan",          code: "AF", dial: "+93",   flag: "🇦🇫" },
  { name: "Australia",            code: "AU", dial: "+61",   flag: "🇦🇺" },
  { name: "Bahrain",              code: "BH", dial: "+973",  flag: "🇧🇭" },
  { name: "Bangladesh",           code: "BD", dial: "+880",  flag: "🇧🇩" },
  { name: "China",                code: "CN", dial: "+86",   flag: "🇨🇳" },
  { name: "Egypt",                code: "EG", dial: "+20",   flag: "🇪🇬" },
  { name: "France",               code: "FR", dial: "+33",   flag: "🇫🇷" },
  { name: "Germany",              code: "DE", dial: "+49",   flag: "🇩🇪" },
  { name: "India",                code: "IN", dial: "+91",   flag: "🇮🇳" },
  { name: "Indonesia",            code: "ID", dial: "+62",   flag: "🇮🇩" },
  { name: "Iran",                 code: "IR", dial: "+98",   flag: "🇮🇷" },
  { name: "Iraq",                 code: "IQ", dial: "+964",  flag: "🇮🇶" },
  { name: "Italy",                code: "IT", dial: "+39",   flag: "🇮🇹" },
  { name: "Jordan",               code: "JO", dial: "+962",  flag: "🇯🇴" },
  { name: "Kuwait",               code: "KW", dial: "+965",  flag: "🇰🇼" },
  { name: "Malaysia",             code: "MY", dial: "+60",   flag: "🇲🇾" },
  { name: "Morocco",              code: "MA", dial: "+212",  flag: "🇲🇦" },
  { name: "Netherlands",          code: "NL", dial: "+31",   flag: "🇳🇱" },
  { name: "Nigeria",              code: "NG", dial: "+234",  flag: "🇳🇬" },
  { name: "Norway",               code: "NO", dial: "+47",   flag: "🇳🇴" },
  { name: "Oman",                 code: "OM", dial: "+968",  flag: "🇴🇲" },
  { name: "Philippines",          code: "PH", dial: "+63",   flag: "🇵🇭" },
  { name: "Qatar",                code: "QA", dial: "+974",  flag: "🇶🇦" },
  { name: "Russia",               code: "RU", dial: "+7",    flag: "🇷🇺" },
  { name: "Singapore",            code: "SG", dial: "+65",   flag: "🇸🇬" },
  { name: "South Africa",         code: "ZA", dial: "+27",   flag: "🇿🇦" },
  { name: "South Korea",          code: "KR", dial: "+82",   flag: "🇰🇷" },
  { name: "Spain",                code: "ES", dial: "+34",   flag: "🇪🇸" },
  { name: "Sri Lanka",            code: "LK", dial: "+94",   flag: "🇱🇰" },
  { name: "Sudan",                code: "SD", dial: "+249",  flag: "🇸🇩" },
  { name: "Sweden",               code: "SE", dial: "+46",   flag: "🇸🇪" },
  { name: "Syria",                code: "SY", dial: "+963",  flag: "🇸🇾" },
  { name: "Thailand",             code: "TH", dial: "+66",   flag: "🇹🇭" },
  { name: "Turkey",               code: "TR", dial: "+90",   flag: "🇹🇷" },
  { name: "Tunisia",              code: "TN", dial: "+216",  flag: "🇹🇳" },
  { name: "Yemen",                code: "YE", dial: "+967",  flag: "🇾🇪" },
];

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function PhoneField({ value, onChange, placeholder = "3xx xxxxxxx" }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [number, setNumber] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);

  useEffect(() => {
    onChange(`${country.dial}${number}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, number]);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <div className="relative flex items-center border border-gray-200 rounded-xl bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/10 transition-all">
        {/* Country button */}
        <button type="button" onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 px-3 py-3 border-r border-gray-200 hover:bg-gray-50 rounded-l-xl transition-colors flex-shrink-0">
          <span className="text-xl leading-none">{country.flag}</span>
          <span className="text-xs font-semibold text-gray-600">{country.dial}</span>
          <ChevronDown size={13} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {/* Number input */}
        <input
          type="tel"
          placeholder={placeholder}
          value={number}
          onChange={e => setNumber(e.target.value)}
          className="px-3 py-3 text-sm font-medium text-gray-800 focus:outline-none rounded-r-xl bg-transparent w-52"
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[9999] w-72 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-gray-50">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <input ref={searchRef} type="text" placeholder="Search country..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent focus:outline-none text-gray-700 placeholder-gray-400" />
              </div>
            </div>

            {/* List */}
            <div className="max-h-56 overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-400 text-center">No results</div>
              )}
              {filtered.map(c => (
                <button key={c.code} type="button"
                  onClick={() => { setCountry(c); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-green-50 transition-colors text-left ${country.code === c.code ? "bg-green-50 text-green-700 font-semibold" : "text-gray-700"}`}>
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-gray-400 font-medium">{c.dial}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
