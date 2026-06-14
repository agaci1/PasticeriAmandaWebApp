import API_BASE from "./api"

type OrderSummary = {
  id?: number
  status?: string
}

export function isMailDeliveryError(message: string) {
  return /mail server|smtp|mailconnect|failed to submit custom order.*mail/i.test(message)
}

export async function countPendingCustomOrders(token: string) {
  const res = await fetch(`${API_BASE}/api/client/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return 0

  const orders: OrderSummary[] = await res.json()
  return orders.filter((order) => order.status === "pending-quote").length
}

export async function orderWasSavedDespiteError(
  token: string,
  pendingCountBefore: number
) {
  const pendingCountAfter = await countPendingCustomOrders(token)
  return pendingCountAfter > pendingCountBefore
}
