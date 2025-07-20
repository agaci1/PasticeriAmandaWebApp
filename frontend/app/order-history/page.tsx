"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GradientText } from "@/components/ui/gradient-text"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  orderType: "MENU_ITEM" | "CUSTOM"
  description: string
  status: string // e.g., PENDING, COMPLETED, CANCELED
  price: number | null // Null for custom orders until admin sets it
  orderDate: string
  // Add other relevant fields like product details for menu items, custom order details
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await authenticatedFetch("/api/orders/client/orders")

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data: Order[] = await res.json()
        setOrders(data)
      } catch (err) {
        console.error("Failed to fetch order history:", err)
        setError("Failed to load order history. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load your order history.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-royal-blue">
        <p>Loading order history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-12">Your Order History</GradientText>

      <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
        <CardHeader>
          <CardTitle className="text-royal-purple">Recent Orders</CardTitle>
          <p className="text-royal-blue">View the status and details of your past orders.</p>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-royal-purple/10 text-royal-purple">
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Order Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="text-royal-blue hover:bg-gold/10">
                     <TableCell className="font-medium">{String(order.id).substring(0, 8)}...</TableCell>
                      <TableCell>{order.orderType === "CUSTOM" ? "Custom Order" : "Menu Item"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.description}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                      {typeof order.price === "number" ? (
  `€${order.price.toFixed(2)}`
) : (
  <span className="text-muted-foreground">Price Pending</span>
)}

</TableCell>

                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-royal-blue text-lg py-8">You haven&apos;t placed any orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
