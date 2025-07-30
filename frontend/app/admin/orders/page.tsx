"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ListOrdered } from "lucide-react"
import API_BASE from "@/lib/api"

interface Order {
  id: number
  customer_email: string
  customer_name: string
  order_date: string
  product_name: string
  number_of_persons: number
  total_price: number
  status: string
  imageUrls?: string
  orderType?: string
  flavour?: string
  customNote?: string
  deliveryDateTime?: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await authenticatedFetch("/api/orders")
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: Order[] = await res.json()
      setOrders(data)
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

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
              <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-white" style={{
          textShadow: '0 0 10px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6, 0 0 40px #8b5cf6'
        }}>
          Manage Orders
        </h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Customer:</span> {order.customer_name}</p>
                    <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                    <p><span className="font-medium">Product:</span> {order.product_name}</p>
                    <p><span className="font-medium">Quantity:</span> {order.number_of_persons}</p>
                    <p><span className="font-medium">Total:</span> ALL{order.total_price}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'canceled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Date:</span> {order.order_date}</p>
                    {order.orderType && <p><span className="font-medium">Type:</span> {order.orderType}</p>}
                    {order.flavour && <p><span className="font-medium">Flavour:</span> {order.flavour}</p>}
                    {order.deliveryDateTime && <p><span className="font-medium">Delivery:</span> {order.deliveryDateTime}</p>}
                  </div>
                </div>

                                  {/* Images */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Order Images</h4>
                  {order.imageUrls ? (
                    <div className="grid grid-cols-2 gap-2">
                      {order.imageUrls.split(',').map((url, index) => {
                        const fullUrl = url.trim().startsWith('/uploads/') ? `${API_BASE}${url.trim()}` : url.trim()
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={fullUrl}
                              alt={`Order ${order.id} image ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => window.open(fullUrl, '_blank')}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">Click to enlarge</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No images uploaded</p>
                  )}
                </div>

                {/* Custom Note */}
                {order.customNote && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Custom Note</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{order.customNote}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
