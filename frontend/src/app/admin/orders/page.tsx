"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { fetchAllOrders, updateOrderStatusAndPrice, sendOrderConfirmationEmail } from "@/actions/admin"
import { useActionState } from "react-dom"

interface Order {
  id: string
  user_id: string
  product_id: string
  full_name: string
  email: string
  phone: string
  number_of_persons: number
  custom_note: string | null
  uploaded_image_url: string | null
  provisional_price: number
  final_price: number | null
  status: string
  created_at: string
  products: {
    name: string
    image_url: string | null
  } | null
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const [updateState, updateAction, isUpdatePending] = useActionState(updateOrderStatusAndPrice, null)
  const [emailState, emailAction, isEmailPending] = useActionState(sendOrderConfirmationEmail, null)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      const { orders: fetchedOrders, message } = await fetchAllOrders()
      if (fetchedOrders) {
        setOrders(fetchedOrders as Order[])
      } else {
        console.error(message)
      }
      setLoading(false)
    }
    loadOrders()
  }, [updateState, emailState]) // Re-fetch orders after update or email send

  useEffect(() => {
    if (updateState?.success === false) {
      alert(updateState.message)
    } else if (updateState?.success === true) {
      alert(updateState.message)
      setIsDetailsDialogOpen(false)
    }
  }, [updateState])

  useEffect(() => {
    if (emailState?.success === false) {
      alert(emailState.message)
    } else if (emailState?.success === true) {
      alert(emailState.message)
    }
  }, [emailState])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsDialogOpen(true)
  }

  const handleUpdateOrder = async (formData: FormData) => {
    if (!selectedOrder) return
    const newStatus = formData.get("status") as string
    const finalPrice = Number.parseFloat(formData.get("finalPrice") as string)
    await updateAction(selectedOrder.id, newStatus, finalPrice)
  }

  const handleSendEmail = async () => {
    if (!selectedOrder || selectedOrder.final_price === null) {
      alert("Final price must be set before sending email.")
      return
    }
    await emailAction(selectedOrder.id, selectedOrder.email, selectedOrder.final_price)
  }

  if (loading) {
    return <div className="text-center font-body text-royalPurple">Loading orders...</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="font-title text-4xl font-bold text-royalPurple text-outline-royal-purple">
        Manage Customer Orders
      </h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-title text-2xl text-royalBlue">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="font-body text-center text-gray-600">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-babyPink text-royalPurple">
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Item</TableHead>
                    <TableHead className="font-semibold">Persons</TableHead>
                    <TableHead className="font-semibold">Provisional Price</TableHead>
                    <TableHead className="font-semibold">Final Price</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-lightAccent">
                      <TableCell className="font-body text-sm">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell className="font-body text-sm">{order.full_name}</TableCell>
                      <TableCell className="font-body text-sm">{order.products?.name || "N/A"}</TableCell>
                      <TableCell className="font-body text-sm">{order.number_of_persons}</TableCell>
                      <TableCell className="font-body text-sm">${order.provisional_price.toFixed(2)}</TableCell>
                      <TableCell className="font-body text-sm">
                        {order.final_price ? `$${order.final_price.toFixed(2)}` : "N/A"}
                      </TableCell>
                      <TableCell className="font-body text-sm">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            order.status === "pending"
                              ? "bg-babyPink text-royalPurple"
                              : order.status === "confirmed"
                                ? "bg-gold text-white"
                                : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                          className="border-royalBlue text-royalBlue hover:bg-royalBlue hover:text-white"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[700px] bg-white p-6 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="font-title text-2xl text-royalPurple">
                Order Details: {selectedOrder.id.substring(0, 8)}
              </DialogTitle>
              <DialogDescription className="font-body text-gray-700">
                Review and update order status and final price.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-royalBlue text-lg">Customer Info</h3>
                <p className="font-body text-gray-700">
                  <strong>Name:</strong> {selectedOrder.full_name}
                </p>
                <p className="font-body text-gray-700">
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
                <p className="font-body text-gray-700">
                  <strong>Phone:</strong> {selectedOrder.phone}
                </p>
                <p className="font-body text-gray-700">
                  <strong>Ordered On:</strong> {new Date(selectedOrder.created_at).toLocaleString()}
                </p>

                <h3 className="font-semibold text-royalBlue text-lg mt-4">Order Details</h3>
                <p className="font-body text-gray-700">
                  <strong>Item:</strong> {selectedOrder.products?.name || "N/A"}
                </p>
                <p className="font-body text-gray-700">
                  <strong>Persons:</strong> {selectedOrder.number_of_persons}
                </p>
                <p className="font-body text-gray-700">
                  <strong>Provisional Price:</strong> ${selectedOrder.provisional_price.toFixed(2)}
                </p>
                {selectedOrder.custom_note && (
                  <p className="font-body text-gray-700">
                    <strong>Note:</strong> {selectedOrder.custom_note}
                  </p>
                )}
                {selectedOrder.uploaded_image_url && (
                  <div>
                    <p className="font-body text-gray-700">
                      <strong>Design Reference:</strong>
                    </p>
                    <Image
                      src={selectedOrder.uploaded_image_url || "/placeholder.svg"}
                      alt="Uploaded Design Reference"
                      width={200}
                      height={200}
                      className="rounded-md object-cover mt-1 border border-lightAccent"
                    />
                  </div>
                )}
              </div>
              <form action={handleUpdateOrder} className="space-y-4">
                <div>
                  <Label htmlFor="status" className="font-semibold text-royalBlue mb-1 block">
                    Status
                  </Label>
                  <Select name="status" defaultValue={selectedOrder.status}>
                    <SelectTrigger className="w-full font-body h-10 border-lightAccent focus:border-babyPink">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="finalPrice" className="font-semibold text-royalBlue mb-1 block">
                    Final Price
                  </Label>
                  <Input
                    id="finalPrice"
                    name="finalPrice"
                    type="number"
                    step="0.01"
                    defaultValue={selectedOrder.final_price?.toFixed(2) || selectedOrder.provisional_price.toFixed(2)}
                    className="font-body h-10 border-lightAccent focus:border-babyPink"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gold text-white hover:bg-royalPurple"
                  disabled={isUpdatePending}
                >
                  {isUpdatePending ? "Updating..." : "Update Order"}
                </Button>
                <Button
                  type="button"
                  onClick={handleSendEmail}
                  className="w-full bg-royalBlue text-white hover:bg-gold"
                  disabled={isEmailPending || selectedOrder.final_price === null}
                >
                  {isEmailPending ? "Sending Email..." : "Send Confirmation Email"}
                </Button>
                {emailState?.message && <p className="text-center text-sm mt-2">{emailState.message}</p>}
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
