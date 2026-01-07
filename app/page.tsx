'use client' // 👈 Ye zaroori hai kyunki hum Hooks use kar rahe hain

import Link from 'next/link';
import { useLanguage } from '../components/LanguageContext';

export default function Home() {
  const { t, lang, toggleLanguage, isRTL } = useLanguage();

  // Button par kya dikhana hai (Next Language preview)
  const getLangButtonLabel = () => {
    switch (lang) {
      case 'en': return '🇫🇷 Français'; // English hai to French dikhao
      case 'fr': return '🇲🇦 العربية';  // French hai to Arabic dikhao
      case 'ar': return '🇺🇸 English';  // Arabic hai to English dikhao
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* 🌍 LANGUAGE SWITCHER (Top Right) */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={toggleLanguage}
          className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-white hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <span>🌐</span>
          {getLangButtonLabel()}
        </button>
      </div>

      {/* Branding */}
      <div className="mb-10 text-center z-10">
        <h1 className="text-5xl font-extrabold text-red-700 tracking-tighter italic drop-shadow-sm">
          ≫ {t.title}
        </h1>
        <p className="text-gray-500 mt-3 text-sm font-medium tracking-wide uppercase">
          {t.subtitle}
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 z-10">
        
        {/* Location Input Fake Box */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-gray-600 text-sm font-medium flex justify-between items-center border border-gray-100 cursor-pointer hover:bg-gray-100 transition">
          <span>{t.question}</span>
          {/* Arrow flips based on RTL */}
          <span className={`text-gray-400 font-bold ${isRTL ? 'rotate-180' : ''}`}>&gt;</span>
        </div>

        {/* The 3 Categories */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          
          {/* 1. Express */}
          <Link href="/request/express" className="flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-red-200">
              <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold text-gray-800 leading-tight group-hover:text-red-700 transition-colors">
                {t.express}
              </span>
              <span className="text-[10px] text-gray-400 leading-none mt-1 block">
                {t.expressDesc}
              </span>
            </div>
          </Link>

          {/* 2. Essentials */}
          <Link href="/request/essentials" className="flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-green-200">
              <span className="text-2xl group-hover:scale-110 transition-transform">🛍️</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold text-gray-800 leading-tight group-hover:text-green-700 transition-colors">
                {t.essentials}
              </span>
              <span className="text-[10px] text-gray-400 leading-none mt-1 block">
                {t.essentialsDesc}
              </span>
            </div>
          </Link>

          {/* 3. Documents */}
          <Link href="/request/documents" className="flex flex-col items-center gap-3 group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-blue-200">
              <span className="text-2xl group-hover:scale-110 transition-transform">📄</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
                {t.documents}
              </span>
              <span className="text-[10px] text-gray-400 leading-none mt-1 block">
                {t.documentsDesc}
              </span>
            </div>
          </Link>

        </div>

        {/* CTA */}
        <button className="w-full bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 hover:bg-red-800 hover:shadow-xl transition-all active:scale-95 flex justify-center items-center gap-2">
          {t.btnStart}
          <span className={`text-lg ${isRTL ? 'rotate-180' : ''}`}>→</span>
        </button>

      </div>

      {/* Footer Text */}
      <div className="mt-8 text-center z-10">
        <p className="text-xs text-gray-400 font-medium opacity-60">
          {t.footer}
        </p>
      </div>

    </main>
  );
}