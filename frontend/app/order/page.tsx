"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UploadCloud } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { GradientText } from "@/components/ui/gradient-text"

export default function OrderPage() {
  const [orderType, setOrderType] = useState<string>("menu")
  const [customOrderDate, setCustomOrderDate] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)


  const handleSubmitCustomOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
  
    const formData = new FormData(event.currentTarget)
  
    // Override some values
    formData.set("productName", "Custom Order")
    formData.set("numberOfPersons", "1")
    if (customOrderDate) {
      formData.set("orderDate", format(customOrderDate, "yyyy-MM-dd"))
    }
    if (uploadedImage instanceof File) {
      formData.set("uploadedImage", uploadedImage)
    }
  
    const token = localStorage.getItem("auth_token") // ✅ Retrieve JWT from localStorage
  
    try {
      const res = await fetch("http://localhost:8080/api/orders/custom", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token to backend
        },
        body: formData, // Do NOT set Content-Type, browser does it automatically
      })
  
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }
  
      toast({
        title: "Order Submitted!",
        description: "Your custom order has been sent to the admin. You will be notified with a price soon.",
      })
  
      event.currentTarget.reset()
      setCustomOrderDate(undefined)
      setUploadedImage(null)
      setPreviewUrl(null)
    } catch (error: any) {
      console.error("Failed to submit custom order:", error)
      toast({
        title: "Order Submission Failed",
        description: error.message || "There was an error submitting your order.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }  

  const handleSubmitMenuItemOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)

    const orderDetails = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      productId: formData.get("productId"), // Assuming a select input for product ID
      quantity: Number.parseInt(formData.get("quantity") as string),
    }

    try {
const token = localStorage.getItem("auth_token")

const res = await fetch("http://localhost:8080/api/orders/custom", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // ✅ required for Spring Security
  },
  body: formData,
})

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      toast({
        title: "Order Placed!",
        description: "Your menu item order has been placed successfully.",
      })
      event.currentTarget.reset() // Clear form
    } catch (error: any) {
      console.error("Failed to submit menu item order:", error)
      toast({
        title: "Order Placement Failed",
        description: error.message || "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 min-h-[calc(100vh-4rem)]">
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-12">Place Your Order</GradientText>

      <div className="max-w-3xl mx-auto space-y-8 text-royal-blue">
        <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
          <CardHeader>
            <CardTitle className="text-royal-purple">Choose Order Type</CardTitle>
            <CardDescription className="text-royal-blue">
              Select whether you want to order from our existing menu or create a custom order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="w-full bg-white border-royal-blue text-royal-blue">
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent className="bg-white text-royal-blue">
                <SelectItem value="menu">Order from Menu</SelectItem>
                <SelectItem value="custom">Custom Order</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {orderType === "menu" && (
          <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
            <CardHeader>
              <CardTitle className="text-royal-purple">Order from Menu</CardTitle>
              <CardDescription className="text-royal-blue">
                Select items from our menu and specify quantity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitMenuItemOrder} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerNameMenu">Your Name</Label>
                  <Input
                    id="customerNameMenu"
                    name="customerName"
                    placeholder="John Doe"
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerEmailMenu">Your Email</Label>
                  <Input
                    id="customerEmailMenu"
                    name="customerEmail"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                 <Label htmlFor="customerPhone">Your Phone</Label>
                   <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="text"
                  placeholder="+355 68 123 4567"
                  required
                  className="bg-white border-royal-blue text-royal-blue"
                   />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="productId">Select Product</Label>
                  <Select name="productId" required>
                    <SelectTrigger className="w-full bg-white border-royal-blue text-royal-blue">
                      <SelectValue placeholder="Choose a menu item" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-royal-blue">
                      {/* These would be dynamically loaded from your /api/products endpoint */}
                      <SelectItem value="1">Chocolate Fudge Cake ($35.00)</SelectItem>
                      <SelectItem value="2">Strawberry Tart ($8.50)</SelectItem>
                      <SelectItem value="3">Assorted Macarons (Box of 6) ($15.00)</SelectItem>
                      <SelectItem value="4">Vanilla Cupcake ($3.00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue={1}
                    min={1}
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-royal-purple text-white hover:bg-royal-blue transition-colors"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {orderType === "custom" && (
          <Card className="bg-white/80 backdrop-blur-sm border-gold shadow-lg">
            <CardHeader>
              <CardTitle className="text-royal-purple">Custom Order Request</CardTitle>
              <CardDescription className="text-royal-blue">
                Describe your dream cake or pastry, add pictures, and select a desired date.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCustomOrder} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customerNameCustom">Your Name</Label>
                  <Input
                    id="customerNameCustom"
                    name="customerName"
                    placeholder="John Doe"
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerEmailCustom">Your Email</Label>
                  <Input
                    id="customerEmailCustom"
                    name="customerEmail"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customerPhoneCustom">Your Phone</Label>
                  <Input
  id="customerPhoneCustom"
  name="customerPhone" // ✅ Match backend field name
  type="text"
  placeholder="+355 68 123 4567"
  required
  className="bg-white border-royal-blue text-royal-blue"
/>
          </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Order Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your custom cake (e.g., '3-tier wedding cake, floral design, vanilla flavor, serves 100')"
                    rows={5}
                    required
                    className="bg-white border-royal-blue text-royal-blue"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desiredDate">Desired Delivery/Pickup Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal bg-white border-royal-blue ${
                          !customOrderDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-gold" />
                        {customOrderDate ? format(customOrderDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-gold">
                      <Calendar mode="single" selected={customOrderDate} onSelect={setCustomOrderDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pictures">Add Pictures (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                  <label
  htmlFor="uploadedImage"
  className="flex flex-col items-center justify-center w-full h-32 border-2 border-royal-blue border-dashed rounded-lg cursor-pointer bg-white/50 hover:bg-white/70 transition-colors"
>
  <div className="flex flex-col items-center justify-center pt-5 pb-6">
    <UploadCloud className="w-8 h-8 mb-3 text-royal-purple" />
    <p className="mb-2 text-sm text-royal-blue">
      <span className="font-semibold">Click to upload</span> or drag and drop
    </p>
    {previewUrl && (
  <div className="mt-2 text-center">
    <img
      src={previewUrl}
      alt="Preview"
      className="mx-auto h-24 rounded-lg object-contain border border-royal-blue"
    />
    <p className="text-sm text-royal-blue mt-1">{uploadedImage?.name}</p>
  </div>
)}
    <p className="text-xs text-royal-blue">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
  </div>
  <Input
  id="uploadedImage"
  name="uploadedImage"
  type="file"
  className="hidden"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }}
/>
</label>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="bg-royal-purple text-white hover:bg-royal-blue transition-colors"
                  disabled={loading}
                >
                  {loading ? "Submitting Request..." : "Submit Custom Order Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
