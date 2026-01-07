import { prisma } from '../../../lib/db'
import { updateOrderStatus } from '../../actions' // Reuse existing action
import Link from 'next/link'

// Auto-refresh for live updates
export const dynamic = 'force-dynamic'

export default async function PilotDashboard(props: { params: Promise<{ driverId: string }> }) {
  const params = await props.params;

  // 1. Fetch Driver Info
  const driver = await prisma.driver.findUnique({
    where: { id: params.driverId }
  })

  if (!driver) return <div>Driver not found</div>

  // 2. Fetch Assigned Orders (Active Only)
  const orders = await prisma.order.findMany({
    where: { 
      driverId: driver.id,
      status: { not: 'CANCELLED' } // Cancelled mat dikhao
    },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      
      {/* Header */}
      <div className="bg-black text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold italic text-red-600">RAPIDOZ</h1>
            <p className="text-sm text-gray-400">Welcome, {driver.name}</p>
          </div>
          <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
            🛵
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="text-center">
            <span className="block text-2xl font-bold">{orders.filter(o => o.status === 'DELIVERED').length}</span>
            <span className="text-[10px] text-gray-500 uppercase">Completed</span>
          </div>
          <div className="w-[1px] bg-gray-800"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-green-500">{orders.filter(o => o.status !== 'DELIVERED').length}</span>
            <span className="text-[10px] text-gray-500 uppercase">Active</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {orders.filter(o => o.status !== 'DELIVERED').map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            
            {/* Header: ID & Status */}
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                #{order.id.slice(-4)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                order.status === 'PICKED_UP' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Pickup</p>
                    <p className="font-bold text-gray-800">{order.pickupAddr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Dropoff</p>
                    <p className="font-bold text-gray-800">{order.dropAddr}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mt-2">
                📦 {order.description} • 📞 {order.user?.phone}
              </div>
            </div>

            {/* ACTION BUTTONS (The Real Magic) */}
            <div className="grid grid-cols-2 gap-2">
              
              {/* PICKUP BUTTON */}
              {order.status === 'ACCEPTED' && (
                <form action={async () => {
                  'use server'
                  await updateOrderStatus(order.id, 'PICKED_UP')
                }} className="col-span-2">
                  <button className="w-full bg-black text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition">
                    CONFIRM PICKUP
                  </button>
                </form>
              )}

              {/* DELIVERY BUTTONS */}
              {order.status === 'PICKED_UP' && (
                <>
                  <a href={`tel:${order.user?.phone}`} className="flex items-center justify-center bg-gray-100 text-gray-800 py-3 rounded-xl font-bold active:scale-95 transition">
                    📞 CALL
                  </a>
                  <form action={async () => {
                    'use server'
                    await updateOrderStatus(order.id, 'DELIVERED')
                  }}>
                    <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition">
                      DELIVERED ✅
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>
        ))}

        {orders.filter(o => o.status !== 'DELIVERED').length === 0 && (
            <div className="text-center py-10 text-gray-400">
                <p>No active jobs right now.</p>
                <p className="text-sm">Rest easy, Pilot! ☕</p>
            </div>
        )}
      </div>

      {/* Simple Bottom Nav */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 flex justify-around text-gray-400">
        <Link href="/" className="flex flex-col items-center gap-1 hover:text-red-600">
            <span>🏠</span>
            <span className="text-[10px] font-bold">Home</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-red-600">
            <span>🛵</span>
            <span className="text-[10px] font-bold">Jobs</span>
        </div>
        <Link href={`/pilot/${driver.id}/profile`} className="flex flex-col items-center gap-1 hover:text-red-600">
            <span>👤</span>
            <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>

    </div>
  )
}