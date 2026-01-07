'use client'

import Link from 'next/link';
import dynamic from 'next/dynamic'; 
import { useState } from 'react';
import { useLanguage } from '../components/LanguageContext';

// Map import with Loading state
const Map = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => <div className="h-48 w-full bg-gray-100 animate-pulse rounded-2xl" />
})

export default function Home() {
  const { t, lang, toggleLanguage, isRTL } = useLanguage();
  
  // 📍 State for Location Search
  const [searchQuery, setSearchQuery] = useState('');
  const [coords, setCoords] = useState<[number, number]>([33.5731, -7.5898]); // Default: Casablanca
  const [loading, setLoading] = useState(false);

  // 🔍 Search Function (OpenStreetMap API)
  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.length > 2) {
      setLoading(true);
      try {
        // Free Geocoding API call
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}+Casablanca`);
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoords([lat, lon]); // Map update hoga
        }
      } catch (error) {
        console.error("Search failed", error);
      }
      setLoading(false);
    }
  };

  const getLangButtonLabel = () => {
    switch (lang) {
      case 'en': return '🇫🇷 Français';
      case 'fr': return '🇲🇦 العربية';
      case 'ar': return '🇺🇸 English';
      default: return '🇺🇸 English';
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gray-50/50">
      
      {/* Language Button */}
      <div className="absolute top-6 right-6 z-10">
        <button onClick={toggleLanguage} className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-white transition-all flex items-center gap-2">
          <span>🌐</span> {getLangButtonLabel()}
        </button>
      </div>

      {/* Branding */}
      <div className="mb-6 text-center z-10">
        <h1 className="text-5xl font-extrabold text-red-700 tracking-tighter italic drop-shadow-sm">
          ≫ {t.title}
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide uppercase">
          {t.subtitle}
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 z-10">
        
        {/* 🗺️ MAP SECTION */}
        <div className="mb-6 h-48 rounded-2xl overflow-hidden shadow-inner border border-gray-100 relative">
           <Map coords={coords} />
           {/* Loading Indicator inside Map */}
           {loading && (
             <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-[1000]">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
             </div>
           )}
        </div>

        {/* 🔍 REAL INPUT BOX (Ab ye kaam karega) */}
        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">📍</span>
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder={t.question + " (e.g. Maarif)"} // "Where to go?"
            className="w-full bg-gray-50 text-gray-800 text-sm font-medium rounded-xl py-4 pl-10 pr-4 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">Enter</span>
          </div>
        </div>

        {/* 3 Categories (Ab yahi main buttons hain) */}
        <div className="grid grid-cols-3 gap-3">
          
          <Link href="/request/express" className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-red-200">
              <span className="text-xl group-hover:scale-110 transition-transform">📦</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold text-gray-800 group-hover:text-red-700">
                {t.express}
              </span>
            </div>
          </Link>

          <Link href="/request/essentials" className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-green-200">
              <span className="text-xl group-hover:scale-110 transition-transform">🛍️</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold text-gray-800 group-hover:text-green-700">
                {t.essentials}
              </span>
            </div>
          </Link>

          <Link href="/request/documents" className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-200">
              <span className="text-xl group-hover:scale-110 transition-transform">📄</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold text-gray-800 group-hover:text-blue-700">
                {t.documents}
              </span>
            </div>
          </Link>

        </div>
        {/* BUTTON REMOVED ❌ */}
      </div>

      <div className="mt-8 text-center z-10">
        <p className="text-xs text-gray-400 font-medium opacity-60">
          {t.footer}
        </p>
      </div>
    </main>
  );
}