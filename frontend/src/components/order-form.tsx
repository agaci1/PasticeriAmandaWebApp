"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useActionState } from "react"
import { submitOrder } from "@/actions/order"
import { createClientComponentClient } from "@/lib/supabase/client"

type Category = "normal-cakes" | "wedding-cakes" | "sweets" | "special-orders"

interface Product {
  id: string
  name: string
  description: string
  image_url: string | null
  base_price: number
  price_per_person: number
  category: Category
}

export function OrderForm() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [numberOfPersons, setNumberOfPersons] = useState<number>(1)
  const [products, setProducts] = useState<Product[]>([])
  const [file, setFile] = useState<File | null>(null)

  const [state, formAction, isPending] = useActionState(submitOrder, null)

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase.from("products").select("*")
      if (error) {
        console.error("Error fetching products:", error.message)
      } else {
        setProducts(data as Product[])
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (state?.success) {
      alert(state.message)
      // Reset form
      setSelectedCategory(null)
      setSelectedProduct(null)
      setNumberOfPersons(1)
      setFile(null)
      // Clear form fields manually if not using controlled components for all
      const form = document.getElementById("order-form") as HTMLFormElement
      if (form) {
        form.reset()
      }
    } else if (state?.message) {
      alert(state.message)
    }
  }, [state])

  const provisionalPrice = selectedProduct
    ? (selectedProduct.base_price + selectedProduct.price_per_person * numberOfPersons).toFixed(2)
    : "0.00"

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : []

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl animate-fade-in-up">
      <CardHeader className="text-center">
        <CardTitle className="font-title text-3xl text-royalPurple">Place Your Order</CardTitle>
        <CardDescription className="font-body text-md text-gray-700">
          Select your desired delight and tell us about your event.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form id="order-form" action={formAction} className="space-y-6">
          {/* Category Selection */}
          <div>
            <Label htmlFor="category" className="font-semibold text-royalBlue text-lg mb-2 block">
              Choose a Category
            </Label>
            <Select
              onValueChange={(value: Category) => {
                setSelectedCategory(value)
                setSelectedProduct(null) // Reset product when category changes
              }}
              value={selectedCategory || ""}
            >
              <SelectTrigger className="w-full font-body text-lg h-12 border-gold focus:ring-gold">
                <SelectValue placeholder="Select a dessert category" />
              </SelectTrigger>
              <SelectContent className="font-body">
                <SelectItem value="normal-cakes">🎂 Normal Cakes</SelectItem>
                <SelectItem value="wedding-cakes">💍 Wedding Cakes</SelectItem>
                <SelectItem value="sweets">🍬 Sweets</SelectItem>
                <SelectItem value="special-orders">💎 Special Orders</SelectItem>
              </SelectContent>
            </Select>
            {selectedCategory && (
              <p className="mt-2 text-sm text-gray-600 font-body">
                {selectedCategory === "normal-cakes" && "Perfect for birthdays, anniversaries, or any celebration."}
                {selectedCategory === "wedding-cakes" && "Exquisite designs for your special day."}
                {selectedCategory === "sweets" && "Delightful small treats for any occasion."}
                {selectedCategory === "special-orders" &&
                  "Have something unique in mind? At Amanda Pastry Shop, we craft custom cakes based on your imagination. Upload an image or leave a note — we’ll bring your dessert dreams to life with elegance and precision."}
              </p>
            )}
          </div>

          {/* Product Selection */}
          {selectedCategory && (
            <div>
              <Label htmlFor="productId" className="font-semibold text-royalBlue text-lg mb-2 block">
                Select Your Delight
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer border-2 ${selectedProduct?.id === product.id ? "border-gold shadow-lg" : "border-lightAccent hover:border-babyPink"} transition-all duration-200`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Image
                        src={product.image_url || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="rounded-full object-cover mb-3"
                      />
                      <h4 className="font-title text-xl text-royalPurple">{product.name}</h4>
                      <p className="text-sm text-gray-600 font-body mt-1">{product.description}</p>
                      <p className="text-md font-semibold text-gold mt-2">
                        Base: ${product.base_price.toFixed(2)} | Per Person: ${product.price_per_person.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <input type="hidden" name="productId" value={selectedProduct?.id || ""} />
            </div>
          )}

          {/* Number of Persons & Provisional Price */}
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <Label htmlFor="numberOfPersons" className="font-semibold text-royalBlue text-lg mb-2 block">
                  Number of Persons
                </Label>
                <Input
                  id="numberOfPersons"
                  name="numberOfPersons"
                  type="number"
                  min="1"
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(Number.parseInt(e.target.value) || 1)}
                  className="font-body text-lg h-12 border-gold focus:ring-gold"
                />
              </div>
              <div className="text-right md:text-left">
                <p className="font-semibold text-royalBlue text-lg">Provisional Price:</p>
                <p className="font-title text-4xl text-gold mt-1">${provisionalPrice}</p>
                <p className="text-sm text-gray-500 font-body">(Excluding delivery & final customizations)</p>
              </div>
            </div>
          )}

          <Separator className="bg-babyPink my-6" />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-title text-2xl text-royalPurple text-center">Your Contact Details</h3>
            <div>
              <Label htmlFor="fullName" className="font-semibold text-royalBlue mb-1 block">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="email" className="font-semibold text-royalBlue mb-1 block">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="font-semibold text-royalBlue mb-1 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                required
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="customNote" className="font-semibold text-royalBlue mb-1 block">
                Optional Note/Message
              </Label>
              <Textarea
                id="customNote"
                name="customNote"
                placeholder="Any special requests or details?"
                rows={4}
                className="font-body border-lightAccent focus:border-babyPink"
              />
            </div>
            <div>
              <Label htmlFor="uploadedImage" className="font-semibold text-royalBlue mb-1 block">
                Upload Design Reference Image (Optional)
              </Label>
              <Input
                id="uploadedImage"
                name="uploadedImage"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="font-body h-10 border-lightAccent focus:border-babyPink"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg font-semibold bg-gold text-white hover:bg-royalPurple transition-colors duration-300 shadow-md hover:shadow-lg"
            disabled={isPending || !selectedProduct}
          >
            {isPending ? "Submitting Order..." : "Submit Order"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
