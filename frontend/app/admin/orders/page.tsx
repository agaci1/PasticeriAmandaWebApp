"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import API_BASE from "@/lib/api"
import {
  ApiOrder,
  getFullImageUrl,
  getOrderImageUrls,
  normalizeOrder,
} from "@/lib/orders"
import { OrderImageLightbox } from "@/components/admin/OrderImageLightbox"

type Order = ReturnType<typeof normalizeOrder>

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await authenticatedFetch("/api/orders")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: ApiOrder[] = await res.json()
      setOrders(data.map(normalizeOrder))
    } catch (err) {
      console.error("Failed to fetch orders:", err)
      setError("Failed to load orders. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto min-h-[calc(100vh-4rem)] px-4 py-12 md:px-6">
      <h1
        className="mb-12 text-center text-3xl font-light text-[#1C1C1E] md:text-4xl"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        Manage Orders
      </h1>

      {loading ? (
        <p className="text-center text-[#1C1C1E]/60">Loading orders…</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-[#1C1C1E]/60">No orders found.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const images = getOrderImageUrls(order.imageUrls)
            return (
              <div key={order.id} className="luxury-panel p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-3">
                    <h3
                      className="text-lg text-[#1C1C1E]"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      Order #{order.id}
                    </h3>
                    <div className="space-y-2 text-sm text-[#1C1C1E]/80" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                      <p><span className="font-medium text-[#1C1C1E]">Customer:</span> {order.customerName}</p>
                      <p><span className="font-medium text-[#1C1C1E]">Email:</span> {order.customerEmail}</p>
                      <p><span className="font-medium text-[#1C1C1E]">Phone:</span> {order.customerPhone}</p>
                      <p><span className="font-medium text-[#1C1C1E]">Product:</span> {order.productName}</p>
                      <p><span className="font-medium text-[#1C1C1E]">Quantity:</span> {order.numberOfPersons}</p>
                      <p>
                        <span className="font-medium text-[#1C1C1E]">Total:</span>{" "}
                        {order.totalPrice != null ? `ALL ${order.totalPrice}` : "To be confirmed"}
                      </p>
                      <p>
                        <span className="font-medium text-[#1C1C1E]">Status:</span>{" "}
                        <span className="ml-1 rounded-sm border border-[#C9A961]/40 bg-[#C9A961]/10 px-2 py-0.5 text-xs font-medium capitalize text-[#8B6914]">
                          {order.status}
                        </span>
                      </p>
                      <p><span className="font-medium text-[#1C1C1E]">Date:</span> {formatDate(order.orderDate)}</p>
                      {order.orderType && <p><span className="font-medium text-[#1C1C1E]">Type:</span> {order.orderType}</p>}
                      {order.flavour && <p><span className="font-medium text-[#1C1C1E]">Flavour:</span> {order.flavour}</p>}
                      {order.deliveryDateTime && (
                        <p><span className="font-medium text-[#1C1C1E]">Delivery:</span> {order.deliveryDateTime}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-[#1C1C1E]">Order Images</h4>
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {images.map((url, index) => {
                          const fullUrl = getFullImageUrl(url)
                          return (
                            <button
                              key={index}
                              type="button"
                              className="group relative overflow-hidden rounded-sm border border-[#C9A961]/30"
                              onClick={() => setEnlargedImage(fullUrl)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={fullUrl}
                                alt={`Order ${order.id} image ${index + 1}`}
                                className="h-24 w-full object-cover transition-opacity group-hover:opacity-80"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/25">
                                <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                                  Click to enlarge
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-[#1C1C1E]/50">No images uploaded</p>
                    )}
                  </div>

                  {order.customNote && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-[#1C1C1E]">Custom Note</h4>
                      <p className="rounded-sm border border-[#C9A961]/20 bg-[#F5F0E8] p-3 text-sm text-[#1C1C1E]/80">
                        {order.customNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <OrderImageLightbox src={enlargedImage} onClose={() => setEnlargedImage(null)} />
    </div>
  )
}
