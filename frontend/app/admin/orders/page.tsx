"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { ListOrdered } from "lucide-react"

interface Order {
  id: number
  customer_email: string
  customer_name: string
  order_date: string
  product_name: string
  number_of_persons: number
  total_price: number
  status: string
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Product(s)</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Total (ALL)</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.customer_name}</td>
                  <td className="px-4 py-2">{order.customer_email}</td>
                  <td className="px-4 py-2">{order.product_name}</td>
                  <td className="px-4 py-2">{order.number_of_persons}</td>
                  <td className="px-4 py-2">{order.total_price}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.order_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
