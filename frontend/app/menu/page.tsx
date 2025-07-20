"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/ui/gradient-text"
import Image from "next/image"
import { useEffect, useState } from "react"
import { authenticatedFetch } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const res = await authenticatedFetch("/api/products") // Assuming /api/products endpoint for menu items
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data: MenuItem[] = await res.json()
        setMenuItems(data)
      } catch (err) {
        console.error("Failed to fetch menu items:", err)
        setError("Failed to load menu. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load menu items.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [toast])

  const handleAddToCart = (item: MenuItem) => {
    // This would typically add to a client-side cart state or send to a backend cart endpoint
    console.log(`Added ${item.name} to cart!`)
    toast({
      title: "Item Added!",
      description: `${item.name} has been added to your cart.`,
    })
    // In a real app, you'd send this to a backend cart API
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] text-royal-blue">
        <p>Loading menu...</p>
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
      <GradientText className="text-4xl md:text-5xl font-extrabold text-center mb-12">Our Delicious Menu</GradientText>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-gold"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.imageUrl || "/placeholder.svg?height=300&width=400"}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-royal-purple text-xl">{item.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-royal-blue text-base">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gold text-2xl font-bold">${item.price.toFixed(2)}</span>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-royal-purple text-white hover:bg-royal-blue transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-royal-blue text-lg">
            No menu items available yet. Please check back soon!
          </p>
        )}
      </div>
    </div>
  )
}
