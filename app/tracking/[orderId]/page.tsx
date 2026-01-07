import { prisma } from '../../../lib/db'
import TrackingClient from './TrackingClient' // 👇 Humne jo nayi file banayi thi wo import ki

export default async function TrackingPage(props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  
  // 1. Fetch Order Data (Server Side)
  // Ye kaam Server par hi hoga (Database se baat karna)
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { driver: true }
  })

  // Agar Order nahi mila
  if (!order) {
    return <div className="p-10 text-center">Order not found 🤷‍♂️</div>
  }

  
  return <TrackingClient order={order} />
}