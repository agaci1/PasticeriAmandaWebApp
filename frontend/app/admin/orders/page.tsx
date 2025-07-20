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
  id: string
  customerName: string
  customerEmail: string
  orderType: "MENU_ITEM" | "CUSTOM"
  description: string
  status: string // e.g., PENDING, PRICE_SET, COMPLETED
  price: number | null // Null for custom orders until admin sets it
  orderDate: string
  desiredDate?: string // For custom orders
  imageUrl?: string // For custom orders
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [newPrice, setNewPrice] = useState<number | "">("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [filterMonth, setFilterMonth] = useState<Date | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await authenticatedFetch("/api/admin/orders/progress") // Assuming /api/admin/orders/progress
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
        description: "Failed to load orders in progress.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSetPrice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentOrder || newPrice === "") return

    try {
      const res = await authenticatedFetch(`/api/admin/orders/${currentOrder.id}/set-price`, {
        method: "PUT",
        body: JSON.stringify({ price: newPrice }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      toast({
        title: "Price Set!",
        description: `Price for order ${currentOrder.id.substring(0, 8)}... has been set to $${newPrice.toFixed(2)}.`,
      })
      setIsPriceDialogOpen(false)
      setCurrentOrder(null)
      setNewPrice("")
      fetchOrders() // Refresh list
    } catch (error: any) {
      console.error("Failed to set price:", error)
      toast({
        title: "Operation Failed",
        description: error.message || "There was an error setting the price. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMarkComplete = async (orderId: string) => {
    if (!confirm("Are you sure you want to mark this order as completed?")) return

    try {
      const res = await authenticatedFetch(`/api/admin/orders/${orderId}/complete`, {
        method: "PUT",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      toast({
        title: "Order Completed!",
        description: `Order ${orderId.substring(0, 8)}... has been moved to completed orders.`,
      })
      fetchOrders() // Refresh list
    } catch (error: any) {
      console.error("Failed to mark order complete:", error)
      toast({
        title: "Operation Failed",
        description: error.message || "There was an error marking the order complete. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openPriceDialog = (order: Order) => {
    setCurrentOrder(order)
    setNewPrice(order.price || "")
    setIsPriceDialogOpen(true)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus
    const matchesMonth =
      !filterMonth ||
      (new Date(order.orderDate).getMonth() === filterMonth.getMonth() &&
        new Date(order.orderDate).getFullYear() === filterMonth.getFullYear())
    const matchesSearch =
      searchTerm === "" ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesMonth && matchesSearch
  })

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-12">Manage Orders</GradientText>

      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-royal-purple text-2xl">Orders in Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Loading orders...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <ListOrdered className="h-16 w-16 text-gold mx-auto" />
                <p className="text-royal-blue">
                  View and manage all pending and in-progress orders, including custom order pricing.
                </p>
                <Button asChild className="bg-royal-purple text-white hover:bg-royal-blue transition-colors">
                  <Link href="/admin/orders/in-progress">Go to Orders in Progress</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-royal-purple text-2xl">Completed Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CheckCircle className="h-16 w-16 text-gold mx-auto" />
            <p className="text-royal-blue">Review all orders that have been marked as completed.</p>
            <Button asChild className="bg-royal-purple text-white hover:bg-royal-blue transition-colors">
              <Link href="/admin/orders/completed">Go to Completed Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
