import Link from 'next/link'
import { prisma } from '../../lib/db'
import { 
  toggleDriverVerification, 
  assignZoneToDriver, 
  createInitialZones,
  assignDriverToOrder, // 👇 Ye Action humne abhi banaya tha
  updateOrderStatus    // 👇 Ye Action bhi abhi banaya tha
} from '../actions'

// Page ko dynamic banao taaki naye orders turant dikhein
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Ensure zones exist
  await createInitialZones();

  // 1. Fetch Drivers (Newest first)
  const drivers = await prisma.driver.findMany({
    include: { zone: true },
    orderBy: { createdAt: 'desc' }
  })
  
  // 2. Fetch Zones
  const zones = await prisma.zone.findMany()

  // 3. Fetch Orders (Include User & Driver details)
  const orders = await prisma.order.findMany({
    include: { user: true, driver: true },
    orderBy: { createdAt: 'desc' }
  })

  // Filter Verified Drivers for assignment dropdown
  // (Hum sirf unhi drivers ko kaam denge jo Verified hain)
  const verifiedDrivers = drivers.filter((d: any) => d.isVerified);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">RAPIDOZ CONTROL</h1>
          <p className="text-sm text-gray-500 font-medium">Dispatch & Fleet Management</p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href="/admin/add-driver"
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition flex items-center gap-2 shadow-lg shadow-gray-200"
          >
            <span>+</span> Add Pilot
          </Link>
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 flex items-center">
            🔴 Live Mode
          </div>
        </div>
      </div>

      {/* --- SECTION 1: LIVE DISPATCH OPERATIONS --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📡 Live Orders
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{orders.length}</span>
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs tracking-wider">
              <tr>
                <th className="p-5">Order Details</th>
                <th className="p-5">Route</th>
                <th className="p-5">Pilot Assignment</th>
                <th className="p-5">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">
                    No active orders. Waiting for requests... ⏳
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition group">
                    
                    {/* 1. Customer Info */}
                    <td className="p-5 align-top">
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 mb-1">
                        {order.category}
                      </div>
                      <div className="font-bold text-gray-800 text-base">{order.description}</div>
                      <div className="text-xs font-mono text-blue-600 mt-1 bg-blue-50 inline-block px-1 rounded">
                        {order.user?.phone || "Guest User"}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleTimeString()} • #{order.id.slice(-4)}
                      </div>
                    </td>

                    {/* 2. Locations */}
                    <td className="p-5 align-top">
                      <div className="flex flex-col gap-3 text-xs">
                        <div className="flex items-start gap-2">
                          <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                          <div>
                            <span className="text-gray-400 text-[10px] uppercase block">Pickup</span>
                            <span className="font-medium text-gray-700">{order.pickupAddr}</span>
                          </div>
                        </div>
                        <div className="w-0.5 h-3 bg-gray-200 ml-1 -my-2"></div>
                        <div className="flex items-start gap-2">
                          <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                          <div>
                            <span className="text-gray-400 text-[10px] uppercase block">Drop</span>
                            <span className="font-medium text-gray-700">{order.dropAddr}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 3. ASSIGN DRIVER (Action Form) */}
                    <td className="p-5 align-top">
                      <form action={async (formData) => {
                        'use server'
                        const driverId = formData.get('driverId') as string
                        if(driverId) await assignDriverToOrder(order.id, driverId)
                      }}>
                        <div className="flex flex-col gap-2">
                          <select 
                            name="driverId" 
                            defaultValue={order.driverId || ""}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-black/5 w-full cursor-pointer hover:border-gray-300 transition"
                          >
                            <option value="" disabled>Select Pilot...</option>
                            {verifiedDrivers.map((d: any) => (
                              <option key={d.id} value={d.id}>🛵 {d.name}</option>
                            ))}
                          </select>
                          <button type="submit" className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition shadow-sm">
                            Assign Pilot
                          </button>
                        </div>
                      </form>
                      
                      {order.driver && (
                        <div className="mt-2 flex items-center gap-2 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                          <span className="text-green-600 text-xs">●</span>
                          <span className="text-xs font-bold text-green-800">{order.driver.name}</span>
                        </div>
                      )}
                    </td>

                    {/* 4. UPDATE STATUS (Action Form) */}
                    <td className="p-5 align-top">
                      <form action={async (formData) => {
                        'use server'
                        const status = formData.get('status') as string
                        await updateOrderStatus(order.id, status)
                      }}>
                        <div className="flex flex-col gap-2">
                          <select 
                            name="status"
                            defaultValue={order.status}
                            className={`border rounded-lg px-3 py-2 text-xs font-bold outline-none cursor-pointer appearance-none ${
                              order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                              order.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            <option value="PENDING">🕒 Pending</option>
                            <option value="ACCEPTED">✅ Accepted</option>
                            <option value="PICKED_UP">📦 Picked Up</option>
                            <option value="DELIVERED">🎉 Delivered</option>
                            <option value="CANCELLED">❌ Cancelled</option>
                          </select>
                          <button type="submit" className="text-xs text-gray-500 font-bold hover:text-black underline decoration-gray-300 underline-offset-4">
                            Update Status
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECTION 2: DRIVER MANAGEMENT --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Fleet Management</h2>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs tracking-wider">
            <tr>
              <th className="p-5">Pilot Profile</th>
              <th className="p-5">Documents</th>
              <th className="p-5">Zone Assignment</th>
              <th className="p-5">Verification</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map((driver: any) => (
              <tr key={driver.id} className="hover:bg-gray-50 transition">
                <td className="p-5">
                  <div className="font-bold text-gray-800">{driver.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{driver.phone}</div>
                </td>
                <td className="p-5">
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono border border-gray-200">
                    {driver.idCardNo}
                  </span>
                </td>
                
                {/* Zone Selector */}
                <td className="p-5">
                  <form action={async (formData) => {
                    'use server'
                    const zoneId = formData.get('zoneId') as string
                    if(zoneId) await assignZoneToDriver(driver.id, zoneId)
                  }}>
                    <select 
                      name="zoneId"
                      defaultValue={driver.zoneId || ""}
                      onChange={(e) => e.target.form?.requestSubmit()} // Auto-submit on change
                      className="bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-500 transition cursor-pointer"
                    >
                      <option value="" disabled>Select Zone</option>
                      {zones.map((z: any) => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))}
                    </select>
                  </form>
                </td>

                {/* Status Badge */}
                <td className="p-5">
                  {driver.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-700 border border-green-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-yellow-50 text-yellow-700 border border-yellow-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Pending
                    </span>
                  )}
                </td>

                {/* Verify Action */}
                <td className="p-5 text-right">
                  <form action={async () => {
                    'use server'
                    await toggleDriverVerification(driver.id, driver.isVerified)
                  }}>
                    <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                      driver.isVerified 
                        ? 'bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200' 
                        : 'bg-green-600 text-white hover:bg-green-700 border border-transparent'
                    }`}>
                      {driver.isVerified ? 'Revoke Access' : 'Approve Pilot'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}