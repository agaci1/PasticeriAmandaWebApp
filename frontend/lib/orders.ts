import API_BASE from "./api"

export type ApiOrder = {
  id: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  productName?: string
  numberOfPersons?: number
  totalPrice?: number | null
  orderDate?: string
  status?: string
  imageUrls?: string
  orderType?: string
  flavour?: string
  customNote?: string
  deliveryDateTime?: string
  // legacy snake_case from older admin pages
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  product_name?: string
  number_of_persons?: number
  total_price?: number | null
  order_date?: string
}

export function normalizeOrder(order: ApiOrder) {
  return {
    id: order.id,
    customerName: order.customerName ?? order.customer_name ?? "—",
    customerEmail: order.customerEmail ?? order.customer_email ?? "—",
    customerPhone: order.customerPhone ?? order.customer_phone ?? "—",
    productName: order.productName ?? order.product_name ?? "—",
    numberOfPersons: order.numberOfPersons ?? order.number_of_persons ?? 0,
    totalPrice: order.totalPrice ?? order.total_price ?? null,
    orderDate: order.orderDate ?? order.order_date ?? "",
    status: order.status ?? "—",
    imageUrls: order.imageUrls,
    orderType: order.orderType,
    flavour: order.flavour,
    customNote: order.customNote,
    deliveryDateTime: order.deliveryDateTime,
  }
}

export function getOrderImageUrls(imageUrls?: string) {
  if (!imageUrls) return []
  return imageUrls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
}

export function getFullImageUrl(url: string) {
  return url.startsWith("/uploads/") ? `${API_BASE}${url}` : url
}
