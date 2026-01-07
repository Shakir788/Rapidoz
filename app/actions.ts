'use server'

import { prisma } from '../lib/db' 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- 1. SETUP: Create Initial Zones ---
export async function createInitialZones() {
  try {
    const existing = await prisma.zone.findFirst();
    if (!existing) {
      await prisma.zone.createMany({
        data: [
          { name: 'Casablanca Centre' },
          { name: 'Maarif' },
          { name: 'Ain Diab' },
          { name: 'Sidi Bernoussi' }
        ]
      })
    }
  } catch (error) {
    console.log("Zone check failed:", error)
  }
}

// --- 2. ADMIN: Create New Driver ---
export async function createDriver(formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const idCardNo = formData.get('idCardNo') as string

  if (!name || !phone || !idCardNo) {
    throw new Error('All fields are required')
  }

  try {
    await prisma.driver.create({
      data: {
        name,
        phone,
        idCardNo,
        isVerified: true, // Testing: Direct Verified
        isOnline: true,   // Testing: Direct Online
      },
    })
  } catch (error) {
    console.error("Error creating driver:", error)
  }

  revalidatePath('/admin')
  redirect('/admin')
}

// --- 3. ADMIN: Manage Drivers ---

// ✅ FIX: Ye function missing tha
export async function assignZoneToDriver(driverId: string, zoneId: string) {
  await prisma.driver.update({
    where: { id: driverId },
    data: { zoneId: zoneId }
  })
  revalidatePath('/admin')
}

export async function toggleDriverVerification(driverId: string, currentStatus: boolean) {
  await prisma.driver.update({
    where: { id: driverId },
    data: { isVerified: !currentStatus },
  })
  revalidatePath('/admin')
}

// --- 4. USER: Create Order ---
export async function createOrder(formData: FormData) {
  const phone = formData.get('phone') as string
  const description = formData.get('description') as string
  const pickupAddr = formData.get('pickupAddr') as string
  const dropAddr = formData.get('dropAddr') as string
  const categoryRaw = formData.get('category') as string 

  const categoryMap: Record<string, 'EXPRESS' | 'ESSENTIALS' | 'DOCUMENTS'> = {
    'express': 'EXPRESS',
    'essentials': 'ESSENTIALS',
    'documents': 'DOCUMENTS'
  }
  const category = categoryMap[categoryRaw] || 'EXPRESS'

  // Upsert User (Create if not exists)
  const user = await prisma.user.upsert({
    where: { phone: phone },
    update: {}, 
    create: {
      phone: phone,
      name: 'Guest User'
    }
  })

  // Create Order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      category: category,
      description: description,
      pickupAddr: pickupAddr,
      dropAddr: dropAddr,
      status: 'PENDING'
    }
  })

  redirect(`/tracking/${order.id}`)
}

// --- 5. ADMIN: Live Operations ---

// ✅ FIX: Naam 'assignDriver' se 'assignDriverToOrder' kar diya
export async function assignDriverToOrder(orderId: string, driverId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { 
      driverId: driverId, 
      status: 'ACCEPTED'
    } 
  })
  revalidatePath('/admin')
}

// Update Status
export async function updateOrderStatus(orderId: string, status: string) {
  const statusMap: Record<string, 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED'> = {
    'PENDING': 'PENDING',
    'ACCEPTED': 'ACCEPTED',
    'PICKED_UP': 'PICKED_UP',
    'DELIVERED': 'DELIVERED',
    'CANCELLED': 'CANCELLED'
  }
  
  if(statusMap[status]) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: statusMap[status] }
    })
  }
  revalidatePath('/admin')
}