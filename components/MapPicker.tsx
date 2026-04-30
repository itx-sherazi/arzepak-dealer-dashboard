"use client";
import { useEffect, useRef } from "react";

interface Props {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

export default function MapPicker({ lat, lng, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef    = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  /* load Leaflet CSS + JS from CDN once */
  useEffect(() => {
    if (document.getElementById("leaflet-css")) return initMap();

    const link = document.createElement("link");
    link.id   = "leaflet-css";
    link.rel  = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = initMap;
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initMap() {
    if (!containerRef.current || mapRef.current) return;
    const L = window.L;
    if (!L) return;

    /* Green teardrop icon */
    const greenIcon = L.divIcon({
      className: "",
      html: `<div style="
        width:28px;height:36px;
        background:#16a34a;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,.4);
      "></div>`,
      iconSize: [28, 36],
      iconAnchor: [14, 36],
    });

    const center: [number, number] = lat && lng ? [lat, lng] : [31.5204, 74.3587];
    const zoom = lat && lng ? 15 : 12;

    const map = L.map(containerRef.current, { zoomControl: true }).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(center, { draggable: true, icon: greenIcon }).addTo(map);

    marker.on("dragend", () => {
      const p = marker.getLatLng();
      onChange(+p.lat.toFixed(6), +p.lng.toFixed(6));
    });

    map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
      marker.setLatLng([e.latlng.lat, e.latlng.lng]);
      onChange(+e.latlng.lat.toFixed(6), +e.latlng.lng.toFixed(6));
    });

    mapRef.current    = map;
    markerRef.current = marker;
  }

  /* Sync when coordinates change externally */
  useEffect(() => {
    if (!markerRef.current || !mapRef.current || !lat || !lng) return;
    markerRef.current.setLatLng([lat, lng]);
    mapRef.current.flyTo([lat, lng], 15, { duration: 0.7 });
  }, [lat, lng]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current    = null;
      markerRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
