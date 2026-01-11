"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Mosque } from "@/lib/types";
import L from "leaflet";
import Link from "next/link";

// Fix for default marker icon in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapComponent({ mosques }: { mosques: Mosque[] }) {
  // Default center (France)
  const center: [number, number] = [46.603354, 1.888334];

  return (
    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mosques.map((mosque) => (
        <Marker
          key={mosque.id}
          position={[mosque.latitude, mosque.longitude]}
          icon={icon}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{mosque.name}</h3>
              <p className="text-sm text-gray-600">{mosque.city}</p>
              <Link href={`/mosque/${mosque.id}`} className="text-primary hover:underline text-sm block mt-2">
                Voir détails
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
