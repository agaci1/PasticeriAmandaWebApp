"use client"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { ChevronDownIcon } from "lucide-react"

interface Order {
  id: number
  productName: string
  numberOfPersons: number
  status: string
  orderDate: string
  totalPrice: number
  flavour?: string
  customNote?: string
}

type OrderSection = "active" | "previous"

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<OrderSection>("active")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCannotCancelDialog, setShowCannotCancelDialog] = useState(false)
  const [cannotCancelReason, setCannotCancelReason] = useState("")
  const { toast } = useToast()

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8080/api/client/orders", { 
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` } 
      })
      if (!res.ok) throw new Error("Failed to fetch orders")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "Error",
        description: "Failed to load your orders.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const canCancelOrder = (order: Order) => {
    // Cannot cancel if already completed or canceled
    if (order.status === "completed" || order.status === "canceled") {
      return false
    }
    
    // Check time restriction (24 hours before due date)
    const orderDateTime = new Date(order.orderDate).getTime()
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    return orderDateTime - now > twentyFourHours
  }

  const isActiveOrder = (order: Order) => {
    if (order.status === "canceled") return false
    const orderDateTime = new Date(order.orderDate).getTime()
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    return orderDateTime - now > twentyFourHours
  }

  const isPreviousOrder = (order: Order) => {
    if (order.status === "canceled") return true
    const orderDateTime = new Date(order.orderDate).getTime()
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    return orderDateTime - now <= twentyFourHours
  }

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return

    setIsCanceling(true)
    try {
      const res = await fetch(`http://localhost:8080/api/client/orders/${cancelOrderId}/cancel`, { 
        method: "POST", 
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json"
        } 
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.message || "Unknown error"
        
        // Handle specific error cases with friendly messages
        if (errorMessage.includes("completed") || errorMessage.includes("Cannot cancel")) {
          setCannotCancelReason("This order has already been completed and cannot be cancelled.")
          setShowCannotCancelDialog(true)
          setCancelOrderId(null)
          return
        }
        
        if (errorMessage.includes("24 hours")) {
          setCannotCancelReason("Orders can only be cancelled at least 24 hours before the due date.")
          setShowCannotCancelDialog(true)
          setCancelOrderId(null)
          return
        }
        
        throw new Error(errorMessage)
      }

      // Update local state to reflect the cancellation
      setOrders(orders => orders.map(o => 
        o.id === cancelOrderId ? { ...o, status: "canceled" } : o
      ))

      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
      })

      setCancelOrderId(null)
    } catch (error) {
      console.error("Failed to cancel order:", error)
      toast({
        title: "Error",
        description: "Failed to cancel the order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCanceling(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const activeOrders = orders.filter(isActiveOrder)
  const previousOrders = orders.filter(isPreviousOrder)

  const getSectionTitle = () => {
    return selectedSection === "active" ? "Active Orders" : "Previous Orders"
  }

  const getDisplayOrders = () => {
    return selectedSection === "active" ? activeOrders : previousOrders
  }

  const getOrderCardStyle = (order: Order) => {
    if (selectedSection === "active") {
      return "border-green-200 bg-green-50"
    }
    if (order.status === "canceled") {
      return "border-red-200 bg-red-50"
    }
    return "border-gray-200 bg-gray-50"
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-2 min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold text-royal-purple mb-6">Purchase History</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-2 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold text-royal-purple mb-6">Purchase History</h1>
      
      {orders.length === 0 ? (
        <p className="text-royal-blue">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {/* Section Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full px-4 py-3 text-xl font-semibold text-royal-blue bg-white border border-royal-blue rounded-lg hover:bg-royal-blue hover:text-white transition-colors"
            >
              <span>{getSectionTitle()}</span>
              <ChevronDownIcon 
                className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-royal-blue rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setSelectedSection("active")
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-royal-blue hover:text-white transition-colors ${
                    selectedSection === "active" ? "bg-royal-blue text-white" : ""
                  }`}
                >
                  Active Orders
                </button>
                <button
                  onClick={() => {
                    setSelectedSection("previous")
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-royal-blue hover:text-white transition-colors ${
                    selectedSection === "previous" ? "bg-royal-blue text-white" : ""
                  }`}
                >
                  Previous Orders
                </button>
              </div>
            )}
          </div>

          {/* Orders Display */}
          <div>
            {getDisplayOrders().length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">
                No {selectedSection === "active" ? "active" : "previous"} orders.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getDisplayOrders().map(order => (
                  <Card key={order.id} className={`p-2 text-sm ${getOrderCardStyle(order)}`}>
                    <CardHeader>
                      <CardTitle className="text-royal-purple text-base">Order #{order.id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>Status: <span className={`font-semibold ${
                        order.status === "canceled" ? "text-red-600" : 
                        selectedSection === "active" ? "text-green-600" : "text-gray-600"
                      }`}>{order.status}</span></div>
                      <div>Product(s): {order.productName}</div>
                      <div>Quantity: {order.numberOfPersons}</div>
                      {order.flavour && <div>Flavour: {order.flavour}</div>}
                      <div>Total: ALL{order.totalPrice}</div>
                      <div>Due Date: {formatDate(order.orderDate)}</div>
                      {selectedSection === "active" && canCancelOrder(order) && (
                        <Button 
                          onClick={() => setCancelOrderId(order.id)} 
                          size="sm" 
                          className="mt-2"
                          variant="destructive"
                        >
                          Cancel Order
                        </Button>
                      )}
                      {order.status === "canceled" && (
                        <div className="mt-2 text-red-600 font-semibold">Cancelled</div>
                      )}
                      {order.status === "completed" && (
                        <div className="mt-2 text-green-600 font-semibold">✅ Completed</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!cancelOrderId} onOpenChange={(open) => !open && setCancelOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setCancelOrderId(null)}
              disabled={isCanceling}
            >
              No, Keep Order
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelOrder}
              disabled={isCanceling}
            >
              {isCanceling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Order"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cannot Cancel Dialog */}
      <Dialog open={showCannotCancelDialog} onOpenChange={(open) => !open && setShowCannotCancelDialog(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-royal-purple flex items-center gap-2">
              <div className="text-2xl">⚠️</div>
              Cannot Cancel Order
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {cannotCancelReason}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gradient-to-r from-royal-purple/10 to-royal-blue/10 p-4 rounded-lg border border-gold/20">
            <h4 className="font-semibold text-royal-purple mb-2">Need Help?</h4>
            <p className="text-sm text-gray-700 mb-3">
              If you have any questions or concerns about your order, please don't hesitate to contact us.
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>📞 <strong>Phone:</strong> +355 69 352 0462</p>
              <p>📧 <strong>Email:</strong> pasticeriamanda@gmail.com</p>
              <p>📍 <strong>Address:</strong> Rruga Lefter Talo</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowCannotCancelDialog(false)}
              className="bg-royal-purple text-white hover:bg-royal-blue"
            >
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
