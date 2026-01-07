'use client' // 👈 Client Component banana zaroori hai translations ke liye

import { use, useState } from 'react';
import { createOrder } from '../../actions'
import Link from 'next/link'
import { useLanguage } from '../../../components/LanguageContext'; // Import Context

export default function RequestPage({ params }: { params: Promise<{ category: string }> }) {
  // Unwrapping params for Next.js 15+
  const { category } = use(params);
  
  // Use Language Hook
  const { t, isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className={`text-sm text-gray-500 hover:text-red-700 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{isRTL ? '→' : '←'}</span> {t.back}
        </Link>
        <span className="font-bold text-red-700 tracking-tighter italic">RAPIDOZ</span>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        
        <div className="mb-6 text-center">
          <div className="inline-block px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase mb-2 border border-red-100">
            {category}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{t.formTitle}</h2>
        </div>

        <form action={createOrder} onSubmit={() => setIsSubmitting(true)} className="flex flex-col gap-4">
          
          {/* Hidden Input for Category */}
          <input type="hidden" name="category" value={category} />

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.lblPhone}</label>
            <input 
              name="phone" 
              type="tel" 
              placeholder="0612345678"
              required 
              className={`w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${isRTL ? 'text-right' : ''}`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{t.lblDesc}</label>
            <textarea 
              name="description" 
              rows={2}
              placeholder="..."
              required
              className={`w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${isRTL ? 'text-right' : ''}`}
            ></textarea>
          </div>

          {/* Pickup */}
          <div>
            <label className="block text-xs font-bold text-green-700 mb-1 uppercase flex items-center gap-1">
              <span>🟢</span> {t.lblPickup}
            </label>
            <input 
              name="pickupAddr" 
              type="text" 
              required
              className={`w-full bg-green-50/50 border border-green-100 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${isRTL ? 'text-right' : ''}`}
            />
          </div>

          {/* Drop */}
          <div>
            <label className="block text-xs font-bold text-red-700 mb-1 uppercase flex items-center gap-1">
              <span>🔴</span> {t.lblDrop}
            </label>
            <input 
              name="dropAddr" 
              type="text" 
              required
              className={`w-full bg-red-50/50 border border-red-100 rounded-xl p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${isRTL ? 'text-right' : ''}`}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t.loading : t.btnConfirm}
          </button>

        </form>
      </div>
    </div>
  )
}