'use client'

import Link from 'next/link'
import { useLanguage } from '../../../components/LanguageContext'

// Helper to show status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'ACCEPTED': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'PICKED_UP': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
    case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function TrackingClient({ order }: { order: any }) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className={`text-sm text-gray-500 hover:text-red-700 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{isRTL ? '→' : '←'}</span> {t.back}
        </Link>
        <span className="font-bold text-red-700 tracking-tighter italic">RAPIDOZ LIVE</span>
      </div>

      <div className="w-full max-w-md flex flex-col gap-4">
        
        {/* Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{t.status}</p>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ')}
          </div>
          
          <div className="mt-6 flex justify-center">
            {/* Simple Visual Timeline */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`h-3 w-3 rounded-full ${order.status === 'PENDING' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <div className="h-1 w-10 bg-gray-200">
                <div className={`h-full bg-green-500 ${['ACCEPTED', 'PICKED_UP', 'DELIVERED'].includes(order.status) ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`h-3 w-3 rounded-full ${order.status === 'ACCEPTED' ? 'bg-blue-500 animate-pulse' : ['PICKED_UP', 'DELIVERED'].includes(order.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className="h-1 w-10 bg-gray-200">
                <div className={`h-full bg-green-500 ${['PICKED_UP', 'DELIVERED'].includes(order.status) ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`h-3 w-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        {order.driver ? (
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase mb-4 text-left">{t.pilot}</h3>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                🛵
              </div>
              <div>
                <div className="font-bold text-lg text-gray-800">{order.driver.name}</div>
                <div className="text-sm text-gray-500">{order.driver.phone}</div>
                <div className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
                  Verified Pilot
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center opacity-70">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 bg-gray-200 rounded-full mb-3"></div>
              <p className="text-sm font-semibold text-gray-500">{t.finding}</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className={`text-gray-500 text-xs font-bold uppercase mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t.formTitle}</h3>
          <div className="space-y-4">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-xs text-gray-400">{t.lblDesc}</p>
              <p className="font-semibold text-gray-800">{order.description}</p>
            </div>
            <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="w-1/2">
                <p className="text-xs text-gray-400">{t.lblPickup}</p>
                <p className="text-sm font-medium text-gray-700">{order.pickupAddr}</p>
              </div>
              <div className="w-1/2">
                <p className="text-xs text-gray-400">{t.lblDrop}</p>
                <p className="text-sm font-medium text-gray-700">{order.dropAddr}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <a href={`/tracking/${order.id}`} className="text-center text-xs text-blue-600 font-semibold hover:underline mt-4">
          {t.refresh}
        </a>

      </div>
    </div>
  )
}