"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapView({ tourLocation, nearbyAttractions = [] }) {
  const position = [tourLocation.lat, tourLocation.lng];

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <MapContainer center={position} zoom={13} className="h-full w-full">
        {/* Map tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {/* Main tour location */}
        <Marker position={position}>
          <Popup>
            <span className="font-semibold">Tour Location</span>
          </Popup>
        </Marker>

        {/* Highlight area around tour (2km circle) */}
        <Circle
          center={position}
          radius={2000}
          pathOptions={{ color: "#2563eb", fillColor: "#93c5fd", fillOpacity: 0.3 }}
        />

        {/* Nearby attractions */}
        {nearbyAttractions.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lng]}>
            <Popup>
              <span className="font-semibold">{place.name}</span>
              <br />
              <span className="text-sm text-gray-600">{place.type}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
