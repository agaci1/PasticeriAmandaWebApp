"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import API_BASE from "@/lib/api"
import { useTranslation } from "@/contexts/TranslationContext"
import { cn } from "@/lib/utils"

interface Order {
  id: number
  productName: string
  numberOfPersons: number
  status: string
  orderDate: string
  totalPrice: number
  flavour?: string
  customNote?: string
  deliveryDateTime?: string
  orderType?: string
  imageUrls?: string
}

type OrderSection = "active" | "previous"

const heading = "var(--font-cormorant), Georgia, serif"
const body = "var(--font-playfair), Georgia, serif"
const script = "var(--font-dancing), cursive"

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<OrderSection>("active")
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCannotCancelDialog, setShowCannotCancelDialog] = useState(false)
  const [cannotCancelReason, setCannotCancelReason] = useState("")
  const { toast } = useToast()
  const { t } = useTranslation()

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/client/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
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

  const getOrderType = (order: Order) => {
    const isCustomOrder =
      (order.customNote && order.customNote.trim() !== "") ||
      (order.flavour && order.flavour.trim() !== "") ||
      (order.imageUrls && order.imageUrls.trim() !== "") ||
      order.status === "pending-quote" ||
      order.orderType === "custom"
    return isCustomOrder ? "custom" : "menu"
  }

  const canCancelOrder = (order: Order) => {
    if (order.status === "completed" || order.status === "canceled") {
      return false
    }

    const orderType = getOrderType(order)

    if (orderType === "custom") {
      const orderDateTime = new Date(order.orderDate).getTime()
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000
      return orderDateTime - now > oneDay
    }

    if (order.deliveryDateTime) {
      const deliveryDateTime = new Date(order.deliveryDateTime).getTime()
      const now = Date.now()
      const fiveHours = 5 * 60 * 60 * 1000
      return deliveryDateTime - now > fiveHours
    }
    return false
  }

  const isActiveOrder = (order: Order) => {
    if (order.status === "canceled") return false

    const orderType = getOrderType(order)

    if (orderType === "custom") {
      const orderDateTime = new Date(order.orderDate).getTime()
      return orderDateTime > Date.now()
    }

    if (order.deliveryDateTime) {
      return new Date(order.deliveryDateTime).getTime() > Date.now()
    }
    return false
  }

  const isPreviousOrder = (order: Order) => {
    if (order.status === "canceled") return true

    const orderType = getOrderType(order)

    if (orderType === "custom") {
      return new Date(order.orderDate).getTime() <= Date.now()
    }

    if (order.deliveryDateTime) {
      return new Date(order.deliveryDateTime).getTime() <= Date.now()
    }
    return false
  }

  const handleCancelOrder = async () => {
    if (!cancelOrderId) return

    setIsCanceling(true)
    try {
      const res = await fetch(`${API_BASE}/api/client/orders/${cancelOrderId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.message || "Unknown error"

        if (errorMessage.includes("completed") || errorMessage.includes("Cannot cancel")) {
          setCannotCancelReason("This order has already been completed and cannot be cancelled.")
          setShowCannotCancelDialog(true)
          setCancelOrderId(null)
          return
        }

        if (errorMessage.includes("1 day")) {
          setCannotCancelReason("Custom orders can only be cancelled at least 1 day before the due date.")
          setShowCannotCancelDialog(true)
          setCancelOrderId(null)
          return
        }
        if (errorMessage.includes("5 hours")) {
          setCannotCancelReason("Menu orders can only be cancelled at least 5 hours before the delivery time.")
          setShowCannotCancelDialog(true)
          setCancelOrderId(null)
          return
        }

        throw new Error(errorMessage)
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === cancelOrderId ? { ...o, status: "canceled" } : o))
      )

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const activeOrders = orders.filter(isActiveOrder)
  const previousOrders = orders.filter(isPreviousOrder)
  const displayOrders = selectedSection === "active" ? activeOrders : previousOrders

  const statusStyle = (status: string) => {
    if (status === "canceled") return "bg-red-50 text-red-700 border-red-200"
    if (status === "completed") return "bg-emerald-50 text-emerald-800 border-emerald-200"
    if (status === "pending-quote") return "bg-[#C9A961]/15 text-[#8B6914] border-[#C9A961]/40"
    return "bg-[#1C1C1E]/5 text-[#1C1C1E] border-[#1C1C1E]/15"
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#F5F1EA]">
      <div className="pointer-events-none absolute inset-0 vintage-paper opacity-60" />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <header className="mb-10 text-center md:mb-12">
          <p className="mb-2 text-lg text-[#C9A961]" style={{ fontFamily: script }}>
            Pastiçeri Amanda
          </p>
          <h1
            className="text-3xl font-light text-[#1C1C1E] sm:text-4xl md:text-5xl"
            style={{ fontFamily: heading }}
          >
            {t("purchaseHistory")}
          </h1>
          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#C9A961] to-transparent" />
        </header>

        {loading ? (
          <p className="text-center text-[#1C1C1E]/60" style={{ fontFamily: body }}>
            Loading…
          </p>
        ) : orders.length === 0 ? (
          <div className="luxury-panel mx-auto max-w-md p-10 text-center">
            <p className="text-[#1C1C1E]/70" style={{ fontFamily: body }}>
              No orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center gap-2">
              {(["active", "previous"] as const).map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setSelectedSection(section)}
                  className={cn(
                    "px-6 py-2.5 text-sm uppercase tracking-wider transition-all duration-300",
                    selectedSection === section
                      ? "bg-[#1C1C1E] text-[#F5F0E8]"
                      : "border border-[#C9A961]/40 bg-transparent text-[#1C1C1E]/80 hover:border-[#C9A961]"
                  )}
                  style={{ fontFamily: body }}
                >
                  {section === "active" ? "Active Orders" : "Previous Orders"}
                </button>
              ))}
            </div>

            {displayOrders.length === 0 ? (
              <p
                className="py-12 text-center italic text-[#1C1C1E]/50"
                style={{ fontFamily: body }}
              >
                No {selectedSection === "active" ? "active" : "previous"} orders.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {displayOrders.map((order) => {
                  const orderType = getOrderType(order)
                  return (
                    <article key={order.id} className="luxury-panel p-5 sm:p-6">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <p
                            className="text-xs uppercase tracking-[0.2em] text-[#C9A961]"
                            style={{ fontFamily: body }}
                          >
                            Order #{order.id}
                          </p>
                          <p className="mt-1 text-lg text-[#1C1C1E]" style={{ fontFamily: heading }}>
                            {orderType === "custom" ? "Custom Order" : "Menu Order"}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-sm border px-2.5 py-1 text-xs font-medium capitalize",
                            statusStyle(order.status)
                          )}
                          style={{ fontFamily: body }}
                        >
                          {order.status.replace("-", " ")}
                        </span>
                      </div>

                      <dl
                        className="space-y-2 text-sm text-[#1C1C1E]/80"
                        style={{ fontFamily: body }}
                      >
                        <div className="flex justify-between gap-4 border-b border-[#C9A961]/15 pb-2">
                          <dt>Product</dt>
                          <dd className="text-right font-medium text-[#1C1C1E]">{order.productName}</dd>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-[#C9A961]/15 pb-2">
                          <dt>Quantity</dt>
                          <dd>{order.numberOfPersons}</dd>
                        </div>
                        {order.flavour && (
                          <div className="flex justify-between gap-4 border-b border-[#C9A961]/15 pb-2">
                            <dt>Flavour</dt>
                            <dd>{order.flavour}</dd>
                          </div>
                        )}
                        {order.totalPrice > 0 && (
                          <div className="flex justify-between gap-4 border-b border-[#C9A961]/15 pb-2">
                            <dt>Price</dt>
                            <dd>
                              {t("currencySymbol")}
                              {order.totalPrice}
                            </dd>
                          </div>
                        )}
                        {orderType === "custom" ? (
                          <div className="flex justify-between gap-4">
                            <dt>Due Date</dt>
                            <dd>{formatDate(order.orderDate)}</dd>
                          </div>
                        ) : (
                          order.deliveryDateTime && (
                            <div className="flex justify-between gap-4">
                              <dt>Delivery</dt>
                              <dd className="text-right">
                                {new Date(order.deliveryDateTime).toLocaleDateString()} at{" "}
                                {new Date(order.deliveryDateTime).toLocaleTimeString().slice(0, 5)}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>

                      {selectedSection === "active" && canCancelOrder(order) && (
                        <Button
                          type="button"
                          onClick={() => setCancelOrderId(order.id)}
                          variant="outline"
                          className="mt-5 w-full rounded-none border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                          style={{ fontFamily: body }}
                        >
                          Cancel Order
                        </Button>
                      )}

                      {order.status === "canceled" && (
                        <p className="mt-4 text-center text-sm font-medium text-red-600" style={{ fontFamily: body }}>
                          Cancelled
                        </p>
                      )}
                      {order.status === "completed" && (
                        <p className="mt-4 text-center text-sm font-medium text-emerald-700" style={{ fontFamily: body }}>
                          Completed
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            <div className="luxury-panel p-6 sm:p-8">
              <h3
                className="mb-5 text-xl text-[#1C1C1E]"
                style={{ fontFamily: heading }}
              >
                {t("importantNotes")}
              </h3>
              <div className="space-y-4" style={{ fontFamily: body }}>
                <div className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#C9A961]" />
                  <div>
                    <p className="font-medium text-[#1C1C1E]">{t("forCustomOrders")}</p>
                    <p className="mt-1 text-sm text-[#1C1C1E]/65">{t("customOrderCancelNote")}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1C1C1E]/40" />
                  <div>
                    <p className="font-medium text-[#1C1C1E]">{t("forMenuOrders")}</p>
                    <p className="mt-1 text-sm text-[#1C1C1E]/65">{t("menuOrderCancelNote")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!cancelOrderId} onOpenChange={(open) => !open && setCancelOrderId(null)}>
        <DialogContent className="luxury-panel border-[#C9A961]/30 bg-[#F5F1EA] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1C1C1E]" style={{ fontFamily: heading }}>
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-[#1C1C1E]/70" style={{ fontFamily: body }}>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setCancelOrderId(null)}
              disabled={isCanceling}
              className="rounded-none border-[#C9A961]/40"
              style={{ fontFamily: body }}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCanceling}
              className="rounded-none"
              style={{ fontFamily: body }}
            >
              {isCanceling ? "Cancelling…" : "Yes, Cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCannotCancelDialog} onOpenChange={(open) => !open && setShowCannotCancelDialog(false)}>
        <DialogContent className="luxury-panel border-[#C9A961]/30 bg-[#F5F1EA] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1C1C1E]" style={{ fontFamily: heading }}>
              Cannot Cancel Order
            </DialogTitle>
            <DialogDescription className="text-[#1C1C1E]/70" style={{ fontFamily: body }}>
              {cannotCancelReason}
            </DialogDescription>
          </DialogHeader>
          <div className="border border-[#C9A961]/25 bg-[#F5F0E8] p-4 text-sm" style={{ fontFamily: body }}>
            <p className="font-medium text-[#1C1C1E]">Need help?</p>
            <p className="mt-2 text-[#1C1C1E]/70">
              Phone: +355 69 352 0462 · pasticeriamanda@gmail.com
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowCannotCancelDialog(false)}
              className="btn-luxury rounded-none"
              style={{ fontFamily: body }}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
