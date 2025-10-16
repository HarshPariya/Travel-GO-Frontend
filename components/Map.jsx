// components/Map.jsx
"use client";

import { useEffect, useState } from "react";


export default function Map({ location, attractions = [] }) {
  const [coords, setCoords] = useState([20.5937, 78.9629]); 
  const [loading, setLoading] = useState(true);

  // Resolve string or object location into lat/lng
  useEffect(() => {
    let mounted = true;

    async function resolveLocation() {
      try {
        if (!location) return;

        if (typeof location === "object" && location.lat && location.lng) {
          if (mounted) setCoords([Number(location.lat), Number(location.lng)]);
          return;
        }

        if (typeof location === "string") {
          const q = encodeURIComponent(location);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${q}`,
            { headers: { "User-Agent": "travelgo-app/1.0 (dev)" } }
          );
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            const { lat, lon } = json[0];
            if (mounted) setCoords([Number(lat), Number(lon)]);
            return;
          }
        }
      } catch (err) {
        console.warn("Geocoding failed:", err);
      }
    }

    resolveLocation().finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [location]);

  if (loading) {
    return (
      <div className="h-80 w-full rounded-2xl overflow-hidden shadow-md bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-500">Loading map…</div>
      </div>
    );
  }

  // Build satellite map iframe (Esri World Imagery via leaflet providers)
  const [lat, lng] = coords;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.1},${lat-0.1},${lng+0.1},${lat+0.1}&layer=Esri.WorldImagery&marker=${lat},${lng}`;

  return (
    <div className="h-80 w-full rounded-2xl overflow-hidden shadow-md">
      <iframe
        src={embedSrc}
        className="w-full h-full border-0"
        title="Satellite Map"
        loading="lazy"
      />
    </div>
  );
}
