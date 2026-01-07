'use client'

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Icon Fix
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// 🚁 Ye component Map ko fly karwayega nayi location par
function Recenter({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 14, { duration: 2 });
  }, [lat, lng, map]);
  return null;
}

// Props accept karenge taaki Home page se location control kar sakein
export default function Map({ coords }: { coords: [number, number] }) {
  // Agar koi coords nahi aaye, to default Casablanca
  const position = coords || [33.5731, -7.5898];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // 🚫 Zoom buttons hata diye
      >
        {/* Clean CartoDB Map (Uber Style) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position} icon={icon}></Marker>
        <Recenter lat={position[0]} lng={position[1]} />
      </MapContainer>
    </div>
  )
}