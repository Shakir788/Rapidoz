import Link from 'next/link'
import { createDriver } from '../../actions' // Note: ../../actions sahi hai yahan

export default function AddDriverPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        <div className="bg-gray-800 p-6 text-white">
          <h2 className="text-xl font-bold">Register New Driver</h2>
          <p className="text-gray-400 text-sm mt-1">Internal Authority Use Only</p>
        </div>

        <div className="p-8">
          <form action={createDriver} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" type="text" required placeholder="e.g. Ahmed Benali" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input name="phone" type="tel" required placeholder="+212 6XX XXX XXX" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID (CIN)</label>
              <input name="idCardNo" type="text" required placeholder="e.g. AB123456" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 outline-none" />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-lg shadow-md transition">
                Create Driver Profile
              </button>
              <Link href="/admin" className="text-center text-sm text-gray-500 hover:text-gray-800">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}