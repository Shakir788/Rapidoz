import { prisma } from '../../lib/db'
import { redirect } from 'next/navigation'

export default function PilotLogin() {
  
  // Server Action for Login
  async function login(formData: FormData) {
    'use server'
    const phone = formData.get('phone') as string
    
    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: { phone }
    })

    if (driver) {
      // Agar driver hai, to uske dashboard par bhej do
      redirect(`/pilot/${driver.id}`)
    } else {
      // Error handling (abhi ke liye console log)
      console.log("Driver not found")
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-3xl font-bold text-red-600 italic tracking-tighter mb-2">RAPIDOZ PILOT</h1>
      <p className="text-gray-400 text-sm mb-8">Partner App Login</p>

      <div className="w-full max-w-sm bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
            <input 
              name="phone" 
              type="tel" 
              placeholder="0612345678"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white font-bold mt-2 focus:border-red-600 focus:outline-none transition"
              required
            />
          </div>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition active:scale-95">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  )
}