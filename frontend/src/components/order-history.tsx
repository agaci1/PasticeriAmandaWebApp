"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { updateOrder } from "@/actions/order"
import { useActionState } from "react-dom"

interface Order {
  id: string
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

interface OrderHistoryProps {
  orders: Order[]
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [state, formAction, isPending] = useActionState(updateOrder, null)

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order)
    setIsEditDialogOpen(true)
    setFile(null) // Clear file input when opening dialog
  }

  const handleDialogClose = () => {
    setIsEditDialogOpen(false)
    setSelectedOrder(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null)
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-title text-xl text-royalPurple">
              Order for {order.products?.name || "Unknown Product"}
            </CardTitle>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === "pending"
                  ? "bg-babyPink text-royalPurple"
                  : order.status === "confirmed"
                    ? "bg-gold text-white"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-4">
              {order.products?.image_url && (
                <Image
                  src={order.products.image_url || "/placeholder.svg"}
                  alt={order.products.name || "Product Image"}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              )}
              <div>
                <p className="font-body text-gray-700">Persons: {order.number_of_persons}</p>
                <p className="font-body text-gray-700">Provisional Price: ${order.provisional_price.toFixed(2)}</p>
                {order.final_price && (
                  <p className="font-body text-gold font-semibold">Final Price: ${order.final_price.toFixed(2)}</p>
                )}
                <p className="font-body text-sm text-gray-500">
                  Ordered on: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {order.custom_note && (
              <p className="font-body text-gray-600 italic">Note: &quot;{order.custom_note}&quot;</p>
            )}
            {order.uploaded_image_url && (
              <div className="mt-2">
                <p className="font-body text-gray-700">Design Reference:</p>
                <Image
                  src={order.uploaded_image_url || "/placeholder.svg"}
                  alt="Uploaded Design Reference"
                  width={150}
                  height={150}
                  className="rounded-md object-cover mt-1 border border-lightAccent"
                />
              </div>
            )}
            {order.status === "pending" && (
              <Button
                variant="outline"
                className="mt-4 border-royalBlue text-royalBlue hover:bg-royalBlue hover:text-white bg-transparent"
                onClick={() => handleEditClick(order)}
              >
                Edit Order
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {selectedOrder && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white p-6 rounded-lg shadow-xl">
            <DialogHeader>
              <DialogTitle className="font-title text-2xl text-royalPurple">Edit Order</DialogTitle>
              <DialogDescription className="font-body text-gray-700">
                You can update the number of persons, custom note, or upload a new image for this pending order.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="orderId" value={selectedOrder.id} />
              <div>
                <Label htmlFor="edit-persons" className="font-semibold text-royalBlue mb-1 block">
                  Number of Persons
                </Label>
                <Input
                  id="edit-persons"
                  name="numberOfPersons"
                  type="number"
                  min="1"
                  defaultValue={selectedOrder.number_of_persons}
                  required
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="edit-note" className="font-semibold text-royalBlue mb-1 block">
                  Custom Note
                </Label>
                <Textarea
                  id="edit-note"
                  name="customNote"
                  defaultValue={selectedOrder.custom_note || ""}
                  rows={4}
                  className="font-body border-lightAccent focus:border-babyPink"
                />
              </div>
              <div>
                <Label htmlFor="edit-image" className="font-semibold text-royalBlue mb-1 block">
                  Upload New Design Reference Image (Optional)
                </Label>
                {selectedOrder.uploaded_image_url && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Current Image:</p>
                    <Image
                      src={selectedOrder.uploaded_image_url || "/placeholder.svg"}
                      alt="Current Design Reference"
                      width={100}
                      height={100}
                      className="rounded-md object-cover mt-1 border border-lightAccent"
                    />
                    <input type="hidden" name="existingImageUrl" value={selectedOrder.uploaded_image_url} />
                  </div>
                )}
                <Input
                  id="edit-image"
                  name="uploadedImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="font-body h-10 border-lightAccent focus:border-babyPink"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gold text-white hover:bg-royalPurple transition-colors duration-300 shadow-md hover:shadow-lg"
                disabled={isPending}
              >
                {isPending ? "Updating Order..." : "Update Order"}
              </Button>
              {state?.message && <p className="text-center text-sm mt-2">{state.message}</p>}
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
